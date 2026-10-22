/**
 * 10x web summaries the Temporal pipeline publishes for a project
 * (backend util/webSummaries.js), grouped for the Web Summaries popup.
 */

const KIND_LABELS = {
  GEX: 'Gene Expression',
  TCR: 'TCR',
  BCR: 'BCR',
  OCM: 'OCM',
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

/** 'Multiome (ARC) · BONO_0230_B23M3FMLT3' */
export const webSummaryLabel = summary => `${KIND_LABELS[summary.kind] || summary.kind} · ${summary.run}`;

/** The summary's URL on this site: '/static/html/FASTQ/CELLRANGER/...' */
export const webSummaryHref = summary => `/${summary.path}`;
