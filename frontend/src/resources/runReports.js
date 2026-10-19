// A run's lane summary on the QC site is <run>_laneBarcode.html, written by the Airflow
// pipeline, or <run>_laneBarcode_temporal.html, written by the Temporal pipeline.
const TEMPORAL_REPORT = /_laneBarcode_temporal\.html$/;

export const isTemporalReport = (fileName) => TEMPORAL_REPORT.test(fileName || '');

// The run a report belongs to: its file name up to _laneBarcode.
export const reportRunName = (fileName) => (fileName || '').split('_laneBarcode')[0];

// Airflow's reports and the Temporal pipeline's, each in its own list, order kept.
export const splitRunsByPipeline = (runs) => ({
  airflow: (runs || []).filter((run) => !isTemporalReport(run.runName)),
  temporal: (runs || []).filter((run) => isTemporalReport(run.runName))
});
