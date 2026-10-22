/**
 * 10x web summaries the Temporal pipeline publishes beside the demux reports:
 *
 *   <FASTQC_PATH>/CELLRANGER/<project>/<sample>___<kind>___<run>_temporal.html
 *
 * kind is GEX, TCR, BCR, OCM, ARC (Multiome) or VISIUM. Inside FASTQ/ because nginx
 * serves only /static/html/FASTQ/; getRecentRunsData lists FASTQ/*.html alone, so the
 * subfolder is never taken for a run.
 */
const WEB_SUMMARY_DIR = 'CELLRANGER';
const WEB_SUMMARY_RE = /^(.+)___(GEX|TCR|BCR|OCM|ARC|VISIUM)___(.+)_temporal\.html$/;

/** 'S1_IGO_18995_1___ARC___BONO_0230_B23M3FMLT3_temporal.html' -> { sample, kind, run }, or null. */
const parseWebSummaryName = (fileName) => {
    const m = WEB_SUMMARY_RE.exec(fileName || '');
    return m ? { sample: m[1], kind: m[2], run: m[3] } : null;
};

/** A project id as it appears in a path: 18995, 12437_QH. Anything else could leave the folder. */
const isProjectId = (projectId) => /^[A-Za-z0-9_]+$/.test(projectId || '');

module.exports = { WEB_SUMMARY_DIR, parseWebSummaryName, isProjectId };
