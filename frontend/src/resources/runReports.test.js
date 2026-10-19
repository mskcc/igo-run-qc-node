import { isTemporalReport, reportRunName, splitRunsByPipeline } from './runReports';

describe('run reports', () => {
  it('tells the Temporal pipeline\'s reports from Airflow\'s by name', () => {
    expect(isTemporalReport('BONO_0223_A25FT35LT4_laneBarcode_temporal.html')).toBe(true);
    expect(isTemporalReport('BONO_0223_A25FT35LT4_laneBarcode.html')).toBe(false);
    expect(isTemporalReport(undefined)).toBe(false);
  });

  it('names the run of either kind', () => {
    expect(reportRunName('BONO_0223_A25FT35LT4_laneBarcode_temporal.html')).toBe('BONO_0223_A25FT35LT4');
    expect(reportRunName('BONO_0223_A25FT35LT4_laneBarcode.html')).toBe('BONO_0223_A25FT35LT4');
  });

  it('splits a list into the two pipelines, keeping its order', () => {
    const runs = [
      { runName: 'A_laneBarcode.html' }, { runName: 'B_laneBarcode_temporal.html' },
      { runName: 'C_laneBarcode.html' }, { runName: 'D_laneBarcode_temporal.html' }
    ];
    const { airflow, temporal } = splitRunsByPipeline(runs);
    expect(airflow.map((r) => r.runName)).toEqual(['A_laneBarcode.html', 'C_laneBarcode.html']);
    expect(temporal.map((r) => r.runName)).toEqual(['B_laneBarcode_temporal.html', 'D_laneBarcode_temporal.html']);
    expect(splitRunsByPipeline(null)).toEqual({ airflow: [], temporal: [] });
  });
});
