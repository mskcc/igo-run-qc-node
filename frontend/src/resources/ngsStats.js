// The ngs-stats address the browser links to: config.NGS_STATS is the host
// (https://igodb.mskcc.org:8443) and config.NGS_STATS_PATH the app's path, /ngs-stats
// unless set. Dev runqc sets /ngs-stats-dev, the dev ngs-stats behind the forwarder on igodb.
export const ngsStatsBase = ({ NGS_STATS = '', NGS_STATS_PATH = '/ngs-stats' } = {}) =>
  `${NGS_STATS.replace(/\/+$/, '')}${NGS_STATS_PATH}`;
