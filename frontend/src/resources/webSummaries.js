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

/**
 * One entry per sample for the Web Summaries popup, in the table's order. The project
 * table has a row per sample per run, so a sample sequenced on two runs came up twice.
 *
 *   { name, published: [summaries] }      it has published summaries: link those
 *   { name, downloads: [{ row, run }] }    otherwise one ngs-stats download per distinct
 *                                          run - those can differ, so they are not merged
 */
export const webSummaryEntries = (samples = [], publishedBySample = {}) => {
  const entries = [];
  const byName = {};
  samples.forEach(row => {
    const name = `${row.qc.sampleName}_IGO_${row.baseId}`;
    let entry = byName[name];
    if (!entry) {
      const published = publishedBySample[name] || [];
      entry = published.length ? { name, published } : { name, downloads: [] };
      byName[name] = entry;
      entries.push(entry);
    }
    const run = row.qc.run;
    if (entry.downloads && !entry.downloads.some(d => d.run === run)) {
      entry.downloads.push({ row, run });
    }
  });
  return entries;
};

/** 'Multiome (ARC) · BONO_0230_B23M3FMLT3' */
export const webSummaryLabel = summary => `${KIND_LABELS[summary.kind] || summary.kind} · ${summary.run}`;

/** The summary's URL on this site: '/static/html/FASTQ/CELLRANGER/...' */
export const webSummaryHref = summary => `/${summary.path}`;
