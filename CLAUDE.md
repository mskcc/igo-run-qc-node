# CLAUDE.md

Guidance for Claude Code, and for people, working in this repo. Claude Code loads this file automatically in every session started here or in a worktree of this repo. Keep it current: update it in the same PR as a change that makes it stale.

## This repo

### What it is
IGO Run QC is the web app IGO staff use to review post-sequencing QC for runs, projects and samples. They make pass/fail/deliver decisions there, including setting sample QC status.
- An Express API (`backend/`) sits in front of two services:
  - the IGO LIMS REST service: project QC, recent deliveries, pending requests, the QC-status picklist, InterOp stats, search, and QC-status writes;
  - ngs-stats: fingerprint crosscheck metrics, Cell Ranger stats and web summaries.
- It also lists the run and 10x HTML reports that the demux pipelines (Airflow and Temporal) write under `FASTQC_PATH`.
- A React app (`frontend/`) is the UI.

### Layout
- `backend/index.js`: dotenv, MongoDB connection (users), JWT-cookie setup, CORS, and the `/api/` mount. It serves `../frontend/build` statically and `public/index.html` for everything else, and listens on `127.0.0.1:$PORT`.
- `backend/routes/api.js` mounts `homePage/`, `project/` and `search/`. Requests go to `controllers/{HomePage,Project,Search}Controller.js`, then to `services/services.js`, which makes every outbound LIMS/ngs-stats call and filesystem read.
- `backend/util/`: `jwt.js` (`authenticate`), `apiResponse.js` (response envelope), `helpers.js` (review-queue and sample enrichment logic), `webSummaries.js`, `winston.js`. `models/UserModel.js` is the users collection shared with the IGO login app.
- `frontend/src/`:
  - `App.js`: react-router v5, with routes `/`, `/search/:searchTerm`, `/projects/:projectId`, `/projects/fingerprinting/:projectId` and `/getInterOpsData`.
  - `store.js`: Redux Toolkit slices `features/home/homeSlice.js` and `features/project/projectSlice.js`.
  - `features/{home,project,search,interOpsData,common}`.
  - API clients in `services/igo-qc-service.js` and `services/ngs-stats-service.js`; helpers and constants in `resources/`.
  - QC tables use Handsontable (`features/project/qcTable.js`, `fingerprinting.js`).

### Commands
- Backend (`cd backend`):
  - `npm install`; `npm start` runs `node index.js`.
  - `npm test` runs `node --test util/*.test.js services/*.test.js` and needs no external services.
  - There is no lint or build script.
- Frontend (`cd frontend`):
  - `npm install`; `npm start` runs the CRA dev server on :3000; `npm run build` writes `frontend/build/`.
  - `npm test` runs Jest in watch mode; use `CI=true npm test` for a single run.
  - `npm run lint` / `npm run lint:fix`.
- Local sign-in (README): run the IGO login app locally on :3000 and sign in once so the auth cookie is set. Then stop it and start this app.

### Config
- **Backend:** `backend/.env` (gitignored, no template) with `PORT` (default 3001), `MONGODB_URL_LOGIN`, `JWT_SECRET` (must match the login app's), `LIMS_URL`, `LIMS_USER`, `LIMS_PASSWORD`, `NGS_STATS`, `FASTQC_PATH` (the report directory, with a trailing slash) and `NODE_ENV`.
- **Frontend:** `src/config.js` (gitignored, no template) is imported directly by each module that needs it.
  - Keys used: `NODE_API_ROOT`, `SITE_HOME`, `AUTH_URL`, `BASENAME` (router basename), `NGS_STATS` (the ngs-stats host, e.g. `https://igodb.mskcc.org:8443`), and optionally `NGS_STATS_PATH` (default `/ngs-stats`; dev sets `/ngs-stats-dev`). The browser's Excel links go to `resources/ngsStats.js`'s `ngsStatsBase(config)`.
  - The backend's `NGS_STATS` is the full base instead, path included (`https://igodb.mskcc.org:8443/ngs-stats`, or `/ngs-stats-dev` on dev).
  - `config.dev.js` and `config.prod.js` are gitignored too, but no code chooses between them. Put the target environment's values in `config.js` before `start` or `build`.
- **Dev proxy:** the CRA `proxy` in `frontend/package.json` is `localhost:3228`, while the backend defaults to 3001. Set `PORT` to match if `NODE_API_ROOT` is relative.
- Configuration and secrets come from these uncommitted files. Never commit real values.

### Deploy
`.github/workflows/deploy.yml` is started by hand (`workflow_dispatch`, choose `dev` or `production`) and runs on self-hosted runners.
1. It pulls the server's checkout.
2. It runs `CI=false npm run build` in `frontend/`; with `CI=true`, CRA would fail the build on warnings.
3. It copies `frontend/build/` into `backend/public/`, copies `backend/` to the served directory, and restarts it under PM2.
4. It fails if the process isn't online afterwards.

It does not run `npm install` or the tests, and it writes no config, so new dependencies and config changes have to be applied on the hosts separately. The report HTML is served by the front web server under `static/html/FASTQ/`, not by Express.

### Conventions and gotchas
- **Protecting new routes:** add them to an existing router, or mount a new router in `routes/api.js` with `authenticate` from `util/jwt.js`.
  - `authenticate` validates the login app's JWT cookie, then requires the MongoDB user to be a lab member.
  - It sets `res.user` (not `req.user`), and `successResponseWithData` echoes that back as `data.user`.
- **Responses:** reply through `util/apiResponse.js` (`{status, message, data}`). The frontend axios interceptor unwraps `data.data` into `response.payload`, and sends the browser to the login app on a 401.
- **Missing dependencies:**
  - `mongoose` is required by `index.js` and `models/UserModel.js` but is not in `backend/package.json`. On a fresh clone, run `npm install mongoose` or `npm start` fails.
  - `frontend/src/setupTests.js` imports `@testing-library/jest-dom`, which is not in `frontend/package.json`, so install it or `npm test` fails at setup. Use 5.x (`npm i --no-save --legacy-peer-deps @testing-library/jest-dom@5.17.0`); 6.x needs `@testing-library/dom`, which isn't installed either.
- **Formatting and Node:** `npm run format` points at `./.prettierrc`, which isn't committed, and the backend eslint/prettier configs are gitignored. No Node version is pinned; the backend tests need Node 18+ for `node:test`.
- **Never commit** `backend/.env`, `frontend/src/config*.js`, `frontend/build/`, `RunQc_*.log` (winston writes these to the working directory) or `backend/public/` (the deploy fills it, and it is not gitignored).
- **Logging:** use `logger` from `util/winston.js`. It logs to files, and adds a console transport only when `NODE_ENV=production`. The `winston.loggers.get('logger')` used in some controllers has no configuration.
- **Logic duplicated across backend and frontend; change both sides:**
  - web-summary kinds: `backend/util/webSummaries.js` and `frontend/src/resources/webSummaries.js`;
  - `_laneBarcode[_temporal].html` run-report names: `HomePageController.getInterOpsData` and `resources/runReports.js`;
  - search fields: `SearchController.js`, `services.searchQc` and `igo-qc-service.searchQc`;
  - Nanopore detection: `HomePageController`, `util/helpers.js` and `ProjectController.changeRunStatus`.
- **Unused file:** `backend/constants.js` isn't used, and it is written with ES `export` syntax, so requiring it from the CommonJS backend throws.
- **QC-status writes:** a QC-status change is a GET (`project/changeRunStatus`) that writes to whatever LIMS `LIMS_URL` points at. Point a local backend at a dev LIMS.
- **Run names from paths:** `getRecentRunsData` takes the run name from a fixed path segment (`split('/')[7]`), so a local `FASTQC_PATH` at a different depth gives wrong run names.

## Pull request workflow

This section is shared by the IGO team's repos. Change it in all of them together.

Every code change lands as a pull request. When you work with Claude Code, committing, pushing and opening the PR are pre-authorized: it does them without asking and reports the PR URL.

### 1. Branch in a fresh worktree
- Each change gets its own git worktree, branched off the latest default branch. Never commit to the default branch, and don't reuse an old branch or worktree.
  ```bash
  DEF=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@')
  DEF=${DEF:-$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)}
  git fetch origin
  git worktree add -b fix/<short-slug> ../<repo>-<short-slug> "origin/$DEF"   # or feat/, chore/, perf/
  ```
- Make all edits, builds, tests and commits inside that worktree. Other checkouts are often on stale branches.

### 2. Verify before opening the PR
- Run the full test suite. Note the counts (passed / failed / skipped). If something fails, say so in the PR; don't hide it.
- Exercise the change for real where you can: run it locally, call the endpoint, generate the output, and compare it with what it should be. Write down measured numbers (times, counts, before → after). Use only numbers you measured or verified.
- **UI changes:** run the app in a browser and screenshot every affected view. Take before AND after shots for visual changes, and after-only shots for new views. Save the PNGs with Playwright, because in-app browser screenshots aren't written to disk. If the layout changed, check phone width too.

### 3. Architecture diagram when the design changes
- If the change adds or moves components, data flow, tables, queues or endpoints, draw a **Current vs New** diagram.
- Make it a self-contained SVG: an inline `<style>` with literal colors, an explicit white background `<rect>`, and no external CSS or fonts. Commit it under `docs/architecture/<slug>.svg`, and render it to PNG for the PR body.

### 4. Rebase, push, open the PR
```bash
git fetch origin && git rebase "origin/$DEF"
git push -u origin <branch>            # after rebasing an already-pushed branch: git push --force-with-lease
gh pr create --base "$DEF" --head <branch> --title "<what changes, in plain words>" \
  --body-file pr-body.md --reviewer <reviewers>
```
- **Reviewers:** request review from everyone on the team except yourself: `RTimal`, `azheng4119`, `FahimehMirhaj`, `Ojasvi1329`. Also @-mention them on a `cc` line at the end of the body. If a PR went out without them, run `gh pr edit <n> --add-reviewer ...`.
- **Images (screenshots and diagram PNGs):** attach them as GitHub attachments. Drop the PNGs into the PR's comment box (by hand, or with Claude in Chrome's file upload). Copy the `https://github.com/user-attachments/assets/<uuid>` URLs it generates and put them in the body with `gh pr edit <n> --body-file pr-body.md`. Then clear the unsent comment.
- End commit messages and the PR description with Claude Code's attribution lines.

### 5. PR description
```markdown
## Summary
- **Why:** the problem, with the measured symptom (times, counts, errors).
- **Current:** how it works today: the components, queries, data flow, or the bug.
- **New:** how it works after this change: what was added, replaced or moved, and why this design.
- **Impact:** what changes for the lab or the business, with before → after numbers. Name any deploy or follow-up step still pending.

## What
- Plain-language bullets a non-developer in the lab could follow, one line each, about what changes for the people using it.

**Technical**
- Files, endpoints, migrations, queries, and how it was implemented.

## Screenshots  (UI changes)
| View | Before | After |
|---|---|---|
| ... | ![](https://github.com/user-attachments/assets/...) | ![](https://github.com/user-attachments/assets/...) |

## Architecture  (design changes)
Current vs new: ![](https://github.com/user-attachments/assets/...)  (source: `docs/architecture/<slug>.svg`)

## Tests and evidence
- Tests added or changed, and full-suite counts.
- The end-to-end check you ran and what it showed (real data, before → after).

## Not verified / follow-ups
- What wasn't tested, what still needs a deploy or data step, and open questions for the lab.

cc @RTimal @azheng4119 @FahimehMirhaj @Ojasvi1329
```

### 6. Keep it mergeable, and deploy safely
- If the default branch moves while the PR is open, rebase onto it, re-run the tests, and push with `--force-with-lease`.
- Editing the PR body never needs a new commit.
- Before deploying, check that nothing else is deploying the same service (`gh run list --workflow <deploy workflow> --status in_progress` and `--status queued`). Never start a concurrent deploy: wait for a healthy one to finish, and cancel only one that is stuck, failing or superseded.
- Keep this CLAUDE.md current: update it in the same PR as a change that makes it stale.

