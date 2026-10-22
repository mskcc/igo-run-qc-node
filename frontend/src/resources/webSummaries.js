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
 *   { name, published: [summaries], downloads: [{ row, run }] }
 *
 * Both sources, side by side: the Temporal pipeline's published summaries, and
 * production's from ngs-stats - one download per distinct run, since those can differ.
 * Production stays the system of record; Temporal's copy is the one being validated.
 */
export const webSummaryEntries = (samples = [], publishedBySample = {}) => {
  const entries = [];
  const byName = {};
  samples.forEach(row => {
    const name = `${row.qc.sampleName}_IGO_${row.baseId}`;
    let entry = byName[name];
    if (!entry) {
      entry = { name, published: publishedBySample[name] || [], downloads: [] };
      byName[name] = entry;
      entries.push(entry);
    }
    const run = row.qc.run;
    if (!entry.downloads.some(d => d.run === run)) {
      entry.downloads.push({ row, run });
    }
  });
  return entries;
};

/** A published summary: 'Temporal · Multiome (ARC) · BONO_0230_B23M3FMLT3' */
export const webSummaryLabel = summary => `Temporal · ${KIND_LABELS[summary.kind] || summary.kind} · ${summary.run}`;

/** Production's copy of a run's summary, from ngs-stats: 'Production · BONO_0226_B23MMK2LT3' */
export const productionSummaryLabel = run => `Production · ${run}`;

/** The summary's URL on this site: '/static/html/FASTQ/CELLRANGER/...' */
export const webSummaryHref = summary => `/${summary.path}`;
