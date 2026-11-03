import { mapColumnsToHideByRecipe, unmappedFraction, isHighUnmapped } from './projectHelper';

describe('columns hidden by recipe', () => {
  const headers = ['QC Status', 'IGO ID', 'Sample', 'Sum Reads', 'Requested Reads (Millions)', 'Run', 'Recipe',
                   'Unpaired Reads', 'Examined Reads', 'Unmapped Reads'];
  const shown = recipe => {
    const hidden = mapColumnsToHideByRecipe(recipe, headers);
    return headers.filter((h, i) => !hidden.includes(i));
  };

  it('shows the split Multiome recipes\' reads as it does the combined recipe\'s', () => {
    for (const recipe of ['SC_Chromium-Multiome-GEX', 'SC_Chromium-Multiome-ATAC']) {
      expect(shown(recipe)).toEqual(shown('SC_Chromium-Multiome'));
      expect(shown(recipe)).toEqual(expect.arrayContaining(['Sum Reads', 'Requested Reads (Millions)', 'Unpaired Reads']));
    }
  });
});

describe('high unmapped reads', () => {
  it('is (Unmapped - Unpaired) / (Examined + Unpaired)', () => {
    // 18989_8_1 on BONO_0223: the contaminated ATAC library
    expect(unmappedFraction(90506964, 43633469, 87161588)).toBeCloseTo(0.3245, 4);
  });

  it('flags runs above 10% and leaves clean ones alone', () => {
    expect(isHighUnmapped(90506964, 43633469, 87161588)).toBe(true);   // 18989_8_1, 32.4%
    expect(isHighUnmapped(59450248, 5316226, 10513896)).toBe(false);   // 19019_3_1, 8.0%
    expect(isHighUnmapped(90, 0, 10)).toBe(true);                      // 11%
    expect(isHighUnmapped(90, 0, 9)).toBe(false);                      // exactly 10% is not over
  });

  it('does not flag demux-only runs or runs without reads', () => {
    expect(isHighUnmapped(0, 5000000, 0)).toBe(false);   // demux-only: nothing examined or unmapped
    expect(unmappedFraction(0, 0, 0)).toBeNull();
    expect(unmappedFraction(undefined, undefined, 5)).toBeNull();
    expect(unmappedFraction(100, 0, undefined)).toBeNull();
    expect(isHighUnmapped(undefined, undefined, undefined)).toBe(false);
  });
});

describe('QC table rows with QC_STATS_SOURCE=ngs-stats', () => {
  const { orderSampleQcData } = require('./projectHelper');
  const { TABLE_HEADERS, NO_NGS_STATS_LABEL } = require('./constants');
  const col = name => TABLE_HEADERS.indexOf(name);
  const sample = (qc) => ({
    baseId: '12437_QM_9', recipe: 'HumanWholeGenome', requestedReads: 30, coverageTarget: 30, initialPool: 'Pool-1',
    tumorOrNormal: 'Tumor', species: 'Human', sumReads: 102, sumMTC: 30.5,
    qc: { qcStatus: 'Under-Review', sampleName: 'DK-1', recordId: 7, run: 'BONO_0229_A25GH37LT4', readsExamined: 100,
          unpairedReadsExamined: 2, unmapped: 3, percentAdapters: 0.001, percentDuplication: 0.12, baitSet: 'IDT_Exome',
          percentOffBait: 0.1, percentTarget100x: 0.2, percentTarget30x: 0.9, meanTargetCoverage: 30.5, mean_COVERAGE: 31,
          median_COVERAGE: 29, percentMrnaBases: 0, percentRibosomalBases: 0, statsVersion: 'v2', ...qc },
  });
  const METRICS = ['Sum Reads', 'Sum Mean Target Coverage', '% mRNA', '% Ribosomal', 'Examined Reads', 'Unpaired Reads',
                   'Unmapped Reads', '% Adapters', '% Duplication', 'Bait Set', '% Off Bait', '% Target 100x',
                   '% Target 30x', 'Mean Target Coverage', 'Median Coverage'];
  const LIMS = ['QC Status', 'IGO ID', 'Sample', 'Requested Reads (Millions)', 'Coverage Target', 'QC Record Id',
                'Initial Pool', 'Run', 'Recipe', 'Tumor/Normal'];

  it('a row without stats has its metrics blank and is marked; its LIMS fields show', () => {
    const blankQc = Object.fromEntries(['readsExamined', 'unpairedReadsExamined', 'unmapped', 'percentAdapters',
      'percentDuplication', 'baitSet', 'percentOffBait', 'percentTarget100x', 'percentTarget30x', 'meanTargetCoverage',
      'mean_COVERAGE', 'median_COVERAGE', 'percentMrnaBases', 'percentRibosomalBases', 'statsVersion'].map(f => [f, null]));
    const [row] = orderSampleQcData([{ ...sample({ ...blankQc, ngsStatsMatched: false }), sumReads: undefined, sumMTC: undefined }]);
    for (const name of METRICS) expect([name, row[col(name)]]).toEqual([name, '']);
    expect(row[col('Stats Version')]).toBe(NO_NGS_STATS_LABEL);
    const full = orderSampleQcData([sample({})])[0];
    for (const name of LIMS) expect([name, row[col(name)]]).toEqual([name, full[col(name)]]);
  });

  it('a matched row and a LIMS row (no flag) show exactly the same cells', () => {
    const [matched] = orderSampleQcData([sample({ ngsStatsMatched: true })]);
    const [lims] = orderSampleQcData([sample({})]);
    expect(matched).toEqual(lims);
    expect(lims[col('Examined Reads')]).toBe(100);
    expect(lims[col('Stats Version')]).toBe('v2');
  });
});
