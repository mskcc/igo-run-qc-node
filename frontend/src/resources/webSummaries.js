/**
 * 10x web summaries the Temporal pipeline publishes for a project
 * (backend util/webSummaries.js), matched to the project table's rows.
 */

const KIND_LABELS = {
  GEX: 'Gene Expression',
  TCR: 'TCR',
  BCR: 'BCR',
  OCM: 'OCM',
  FB: 'Feature Barcoding (multi)',
  ARC: 'Multiome (ARC)',
  VISIUM: 'Visium'
};

/** [{ sample, kind, run, modified, path }] -> { sample: [entries, newest first] } */
export const webSummariesBySample = (summaries = []) => {
  const bySample = {};
  [...summaries]
    .sort((a, b) => (b.modified || '').localeCompare(a.modified || ''))
    .forEach(summary => {
      (bySample[summary.sample] = bySample[summary.sample] || []).push(summary);
    });
  return bySample;
};

/** 'BONO_0230' and 'BONO_0230_B23M3FMLT3' are the same run; 'BONO_0230' and 'BONO_02301' are not. */
const sameRun = (a, b) => !!a && !!b && (a === b || a.startsWith(`${b}_`) || b.startsWith(`${a}_`));

/**
 * The web summaries to link from each row of the project table: one entry per row of
 * `samples`, in the same order. The table has a row per sample per run.
 *
 *   { name, published: [summaries], download: row | null }
 *
 * Both sources, side by side:
 *   - published: the Temporal pipeline's summaries, each on the row of the run that made it.
 *     One whose run matches none of the sample's rows goes on the sample's first row, so none
 *     is lost.
 *   - download: production's summary for the row's own run, from ngs-stats, on the rows
 *     `hasProductionSummary(recipe)` says Cell Ranger ran for.
 * Production stays the system of record; Temporal's copy is the one being validated.
 */
export const webSummaryRowLinks = (samples = [], publishedBySample = {}, hasProductionSummary = () => false) => {
  const links = samples.map(row => ({
    name: `${row.qc.sampleName}_IGO_${row.baseId}`,
    published: [],
    download: hasProductionSummary(row.recipe) ? row : null
  }));
  const firstRowOf = {};
  links.forEach((link, i) => {
    if (!(link.name in firstRowOf)) {
      firstRowOf[link.name] = i;
    }
  });
  Object.keys(firstRowOf).forEach(name => {
    (publishedBySample[name] || []).forEach(summary => {
      const i = links.findIndex((link, j) => link.name === name && sameRun(samples[j].qc.run, summary.run));
      links[i >= 0 ? i : firstRowOf[name]].published.push(summary);
    });
  });
  return links;
};

/** What a published summary is, for its link in the table: 'Temporal ARC' */
export const webSummaryShortLabel = summary => `Temporal ${summary.kind}`;

/** A published summary: 'Temporal · Multiome (ARC) · BONO_0230_B23M3FMLT3' */
export const webSummaryLabel = summary => `Temporal · ${KIND_LABELS[summary.kind] || summary.kind} · ${summary.run}`;

/** Production's copy of a run's summary, from ngs-stats: 'Production · BONO_0226_B23MMK2LT3' */
export const productionSummaryLabel = run => `Production · ${run}`;

/** The summary's URL on this site: '/static/html/FASTQ/CELLRANGER/...' */
export const webSummaryHref = summary => `/${summary.path}`;
