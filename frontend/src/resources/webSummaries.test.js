import { webSummariesBySample, webSummaryLabel, webSummaryHref, webSummaryEntries } from './webSummaries';

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

  it('lists each sample once, though the table has a row for each of its runs', () => {
    const row = (name, baseId, run) => ({ qc: { sampleName: name, run }, baseId });
    const rows = [row('AS725', '19022_4', 'BONO_0226'), row('AS38', '19022_1', 'BONO_0226'),
                  row('AS725', '19022_4', 'FAUCI2_0236'), row('AS38', '19022_1', 'FAUCI2_0236'),
                  row('AS70', '19022_3', 'BONO_0226'), row('AS70', '19022_3', 'BONO_0226')];
    const published = { 'AS38_IGO_19022_1': [{ ...arc1, sample: 'AS38_IGO_19022_1', kind: 'GEX' }] };
    const entries = webSummaryEntries(rows, published);
    expect(entries.map(e => e.name)).toEqual(['AS725_IGO_19022_4', 'AS38_IGO_19022_1', 'AS70_IGO_19022_3']);
    // Published: its summaries, once.
    expect(entries[1].published).toHaveLength(1);
    expect(entries[1].downloads).toBeUndefined();
    // Not published: one download per distinct run - those reports can differ.
    expect(entries[0].downloads.map(d => d.run)).toEqual(['BONO_0226', 'FAUCI2_0236']);
    expect(entries[2].downloads.map(d => d.run)).toEqual(['BONO_0226']);
    expect(webSummaryEntries(undefined)).toEqual([]);
  });

  it('labels a summary by what it is and which run made it, and links it from the site root', () => {
    expect(webSummaryLabel(arc1)).toBe('Multiome (ARC) · BONO_0230');
    expect(webSummaryLabel({ ...arc1, kind: 'NEW' })).toBe('NEW · BONO_0230');
    expect(webSummaryHref(arc1)).toBe('/static/html/FASTQ/CELLRANGER/18995/S_IGO_18995_1___ARC___BONO_0230_temporal.html');
  });
});
