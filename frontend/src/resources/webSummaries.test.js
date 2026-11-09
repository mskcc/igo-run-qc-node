import { webSummariesBySample, webSummaryLabel, webSummaryShortLabel, webSummaryHref, webSummaryRowLinks, productionSummaryLabel } from './webSummaries';

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

  const row = (name, baseId, run, recipe = 'SC_Chromium-GEX') => ({ qc: { sampleName: name, run }, baseId, recipe });
  const isTenX = recipe => recipe.startsWith('SC_');

  it('gives every table row its own links, in the table\'s order', () => {
    const rows = [row('AS725', '19022_4', 'BONO_0226_B23MMK2LT3'), row('AS38', '19022_1', 'BONO_0226_B23MMK2LT3'),
                  row('AS725', '19022_4', 'FAUCI2_0236_A23MMJHLT3'), row('AS38', '19022_1', 'FAUCI2_0236_A23MMJHLT3')];
    const gex = { ...arc1, sample: 'AS38_IGO_19022_1', kind: 'GEX', run: 'FAUCI2_0236_A23MMJHLT3' };
    const links = webSummaryRowLinks(rows, { 'AS38_IGO_19022_1': [gex] }, isTenX);
    expect(links.map(l => l.name)).toEqual(['AS725_IGO_19022_4', 'AS38_IGO_19022_1', 'AS725_IGO_19022_4', 'AS38_IGO_19022_1']);
    // Temporal's summary sits on the row for the run that made it, not on the sample's other run.
    expect(links.map(l => l.published.length)).toEqual([0, 0, 0, 1]);
    expect(links[3].published[0]).toBe(gex);
    // Production's download is on every row, for that row's own run.
    expect(links.map(l => l.download.qc.run)).toEqual(rows.map(r => r.qc.run));
  });

  it('matches a run with or without its flowcell', () => {
    const rows = [row('S', '18995_1', 'BONO_0230'), row('S', '18995_1', 'BONO_02301_AAAA')];
    const links = webSummaryRowLinks(rows, { 'S_IGO_18995_1': [{ ...arc1, sample: 'S_IGO_18995_1', run: 'BONO_0230_B23M3FMLT3' }] }, isTenX);
    expect(links.map(l => l.published.length)).toEqual([1, 0]);
  });

  it('puts a summary whose run is on none of the sample\'s rows on its first row', () => {
    const rows = [row('X', '1_1', 'PEPE_221'), row('S', '18995_1', 'BONO_0226'), row('S', '18995_1', 'FAUCI2_0236')];
    const links = webSummaryRowLinks(rows, { 'S_IGO_18995_1': [{ ...arc1, sample: 'S_IGO_18995_1' }] }, isTenX);
    expect(links.map(l => l.published.length)).toEqual([0, 1, 0]);
  });

  it('offers production\'s download only where Cell Ranger ran', () => {
    const rows = [row('A', '1_1', 'R1', 'WGS'), row('B', '1_2', 'R1')];
    expect(webSummaryRowLinks(rows, {}, isTenX).map(l => !!l.download)).toEqual([false, true]);
    expect(webSummaryRowLinks(rows).map(l => l.download)).toEqual([null, null]);
    expect(webSummaryRowLinks(undefined)).toEqual([]);
  });

  it('labels a summary by what it is and which run made it, and links it from the site root', () => {
    expect(webSummaryLabel(arc1)).toBe('Temporal · Multiome (ARC) · BONO_0230');
    expect(webSummaryLabel({ ...arc1, kind: 'FB' })).toBe('Temporal · Feature Barcoding (multi) · BONO_0230');
    expect(webSummaryLabel({ ...arc1, kind: 'NEW' })).toBe('Temporal · NEW · BONO_0230');
    expect(productionSummaryLabel('BONO_0226')).toBe('Production · BONO_0226');
    expect(webSummaryShortLabel(arc1)).toBe('Temporal ARC');
    expect(webSummaryHref(arc1)).toBe('/static/html/FASTQ/CELLRANGER/18995/S_IGO_18995_1___ARC___BONO_0230_temporal.html');
  });
});
