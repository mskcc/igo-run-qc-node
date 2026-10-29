import { ngsStatsBase } from './ngsStats';

describe('ngs-stats address', () => {
  it('is production ngs-stats when only the host is set, as in existing configs', () => {
    expect(ngsStatsBase({ NGS_STATS: 'https://igodb.mskcc.org:8443' })).toBe('https://igodb.mskcc.org:8443/ngs-stats');
  });

  it('follows NGS_STATS_PATH when set', () => {
    expect(ngsStatsBase({ NGS_STATS: 'https://igodb.mskcc.org:8443', NGS_STATS_PATH: '/ngs-stats-dev' }))
      .toBe('https://igodb.mskcc.org:8443/ngs-stats-dev');
  });

  it('ignores a trailing slash on the host', () => {
    expect(ngsStatsBase({ NGS_STATS: 'https://igodb.mskcc.org:8443/' })).toBe('https://igodb.mskcc.org:8443/ngs-stats');
  });
});
