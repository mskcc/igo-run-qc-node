import { webSummariesBySample, webSummaryLabel, webSummaryHref } from './webSummaries';

describe('web summaries', () => {
  const arc1 = { sample: 'S_IGO_18995_1', kind: 'ARC', run: 'BONO_0230', modified: '2026-10-22T18:00:00Z',
                 path: 'static/html/FASTQ/CELLRANGER/18995/S_IGO_18995_1___ARC___BONO_0230_temporal.html' };
  const arc1Later = { ...arc1, run: 'BONO_0231', modified: '2026-10-23T09:00:00Z' };
  const arc2 = { ...arc1, sample: 'S_IGO_18995_2' };

  it('groups a project\'s summaries by sample, newest first', () => {
    const grouped = webSummariesBySample([arc1, arc2, arc1Later]);
    expect(Object.keys(grouped).sort()).toEqual(['S_IGO_18995_1', 'S_IGO_18995_2']);
    expect(grouped['S_IGO_18995_1'].map(s => s.run)).toEqual(['BONO_0231', 'BONO_0230']);
  });

  it('has nothing for a project with none', () => {
    expect(webSummariesBySample([])).toEqual({});
    expect(webSummariesBySample(undefined)).toEqual({});
  });

  it('labels a summary by what it is and which run made it, and links it from the site root', () => {
    expect(webSummaryLabel(arc1)).toBe('Multiome (ARC) · BONO_0230');
    expect(webSummaryLabel({ ...arc1, kind: 'NEW' })).toBe('NEW · BONO_0230');
    expect(webSummaryHref(arc1)).toBe('/static/html/FASTQ/CELLRANGER/18995/S_IGO_18995_1___ARC___BONO_0230_temporal.html');
  });
});
