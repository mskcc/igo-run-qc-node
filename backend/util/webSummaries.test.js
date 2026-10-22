// node --test util/webSummaries.test.js
const test = require('node:test');
const assert = require('node:assert');
const { parseWebSummaryName, isProjectId } = require('./webSummaries');

test('reads sample, kind and run off a published name', () => {
    assert.deepStrictEqual(
        parseWebSummaryName('Rectal_82_C2_treated_IGO_18995_1___ARC___BONO_0230_B23M3FMLT3_temporal.html'),
        { sample: 'Rectal_82_C2_treated_IGO_18995_1', kind: 'ARC', run: 'BONO_0230_B23M3FMLT3' });
    assert.deepStrictEqual(parseWebSummaryName('AS38_IGO_19022_1___GEX___BONO_0226_B23MMK2LT3_temporal.html'),
        { sample: 'AS38_IGO_19022_1', kind: 'GEX', run: 'BONO_0226_B23MMK2LT3' });
    assert.deepStrictEqual(
        parseWebSummaryName('NSG-14w-liver_FB_IGO_19051_B_1___FB___BONO_0229_A25GH37LT4_temporal.html'),
        { sample: 'NSG-14w-liver_FB_IGO_19051_B_1', kind: 'FB', run: 'BONO_0229_A25GH37LT4' });
});

test('anything else is not a web summary', () => {
    assert.strictEqual(parseWebSummaryName('BONO_0230_B23M3FMLT3_laneBarcode_temporal.html'), null);
    assert.strictEqual(parseWebSummaryName('S1___XYZ___RUN_temporal.html'), null);
    assert.strictEqual(parseWebSummaryName('S1___GEX___RUN.html'), null);
    assert.strictEqual(parseWebSummaryName(undefined), null);
});

test('a project id cannot leave the folder', () => {
    assert.ok(isProjectId('18995') && isProjectId('12437_QH'));
    assert.ok(!isProjectId('../etc') && !isProjectId('18995/..') && !isProjectId(''));
});
