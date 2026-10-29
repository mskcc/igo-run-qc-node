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
