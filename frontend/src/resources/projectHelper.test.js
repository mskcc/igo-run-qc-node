import { mapColumnsToHideByRecipe } from './projectHelper';

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
