// node --test util/ngsStatsQc.test.js
const test = require('node:test');
const assert = require('node:assert');
const { overlayNgsStats, runsToFetch, ngsStatsCounts, parseStatsSample, toQcFields, versionLessRunId,
        usesNgsStats, METRIC_FIELDS } = require('./ngsStatsQc');
const { enrichSampleInfo } = require('./helpers');

const RUN_A = 'BONO_0229_A25GH37LT4';
const RUN_B = 'FAUCI2_0240_A25GHN3LT4';

// A getProjectQc sample as LimsRest returns it, with LIMS (production) metrics.
const limsSample = (baseId, name, run, extra = {}) => ({
    baseId, recipe: 'HumanWholeGenome',
    qc: { sampleName: name, run, qcStatus: 'Under-Review', recordId: 7, baitSet: 'lims-bait', readsExamined: 999,
          unpairedReadsExamined: 1, unmapped: 5, meanTargetCoverage: 99, mean_COVERAGE: 98, median_COVERAGE: 97,
          percentTarget40x: 0.5, statsVersion: 'lims', ...extra },
});
// A picardstats/run/<run> row as ngs-stats returns it.
const statsRow = (name, igo, run, extra = {}) => ({
    sample: `${name}_IGO_${igo}`, run, request: igo.replace(/_\d+$/, ''),
    read_PAIRS_EXAMINED: 100, unpairedReads: 2, unmapped_READS: 3, read_PAIRS_DUPLICATES: 4, TOTAL_READS: 206,
    mean_TARGET_COVERAGE: 30.5, mean_COVERAGE: 31.5, median_COVERAGE: 29, percent_DUPLICATION: 0.12,
    pct_TARGET_BASES_30X: 0.9, pct_ADAPTER: 0.001, bait_SET: 'IDT_Exome', statsVersion: 'v2', ...extra,
});

test('a matched row gets the ngs-stats values LimsRest would file; LIMS-only fields stay', () => {
    const [s] = overlayNgsStats([limsSample('12437_QM_9', 'DK-1', RUN_A)],
        { [RUN_A]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } });
    assert.strictEqual(s.qc.ngsStatsMatched, true);
    assert.strictEqual(s.qc.readsExamined, 100);
    assert.strictEqual(s.qc.unpairedReadsExamined, 2);
    assert.strictEqual(s.qc.unmapped, 3);
    assert.strictEqual(s.qc.readsDuped, 4);
    assert.strictEqual(s.qc.meanTargetCoverage, 30.5);
    assert.strictEqual(s.qc.percentTarget30x, 0.9);
    assert.strictEqual(s.qc.baitSet, 'IDT_Exome');
    assert.strictEqual(s.qc.statsVersion, 'v2');
    assert.strictEqual(s.qc.percentTarget40x, null, 'not filled from ngs-stats, so not shown from LIMS either');
    // from LIMS
    assert.deepStrictEqual([s.qc.sampleName, s.qc.run, s.qc.qcStatus, s.qc.recordId], ['DK-1', RUN_A, 'Under-Review', 7]);
});

test('missing ngs-stats values convert like LimsRest: numbers to 0, strings to "null"', () => {
    const f = toQcFields({ read_PAIRS_EXAMINED: null, percent_DUPLICATION: undefined, bait_SET: null });
    assert.strictEqual(f.readsExamined, 0);
    assert.strictEqual(f.percentDuplication, 0);
    assert.strictEqual(f.baitSet, 'null');
    assert.strictEqual(f.statsVersion, 'null');
});

test('a row ngs-stats has no stats for is blank and marked; its run may simply be missing', () => {
    const out = overlayNgsStats([limsSample('12437_QM_9', 'DK-1', RUN_A), limsSample('12437_QM_11', 'SW-1', RUN_B)],
        { [RUN_A]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } });
    const b = out[1];
    assert.strictEqual(b.qc.ngsStatsMatched, false);
    for (const f of METRIC_FIELDS) {
        assert.strictEqual(b.qc[f], null, f);
    }
    assert.deepStrictEqual([b.qc.sampleName, b.qc.run, b.qc.qcStatus, b.qc.recordId], ['SW-1', RUN_B, 'Under-Review', 7]);
    assert.deepStrictEqual(ngsStatsCounts(out), { matched: 1, total: 2 });
});

test('a sample on the same run but not in its stats is unmatched, not given another sample\'s values', () => {
    const [s] = overlayNgsStats([limsSample('12437_QM_10', 'DK-2', RUN_A)],
        { [RUN_A]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } });
    assert.strictEqual(s.qc.ngsStatsMatched, false);
});

test('ignores a run version suffix on either side', () => {
    const [s] = overlayNgsStats([limsSample('12437_QM_9', 'DK-1', `${RUN_A}_A2`)],
        { [`${RUN_A}_A2`]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } });
    assert.strictEqual(s.qc.ngsStatsMatched, true);
    assert.strictEqual(versionLessRunId(`${RUN_A}_A2`), RUN_A);
});

test('a same-named sample with another IGO id is not matched', () => {
    const [s] = overlayNgsStats([limsSample('19000_1', 'DK-1', RUN_A)],
        { [RUN_A]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } });
    assert.strictEqual(s.qc.ngsStatsMatched, false);
});

test('pooled normals and controls keep name_barcode as their IGO id, like LimsRest', () => {
    assert.deepStrictEqual(parseStatsSample('FFPEPOOLEDNORMAL_IGO_POOLEDNORMAL_ACGT_GTCA'),
        { igoId: 'FFPEPOOLEDNORMAL_GTCA', sampleName: 'FFPEPOOLEDNORMAL' });
    assert.strictEqual(parseStatsSample('no-igo-part'), null);
});

test('nanopore samples are left alone and not fetched', () => {
    const ont = { baseId: '1_1', recipe: 'Nanopore_cDNA', qc: { sampleName: 'o', run: 'PROM_1', readsExamined: 5 } };
    const [s] = overlayNgsStats([ont], {});
    assert.strictEqual(s, ont);
    assert.deepStrictEqual(runsToFetch([ont, limsSample('2_1', 'x', RUN_A), limsSample('2_2', 'y', RUN_A)]), [RUN_A]);
    assert.deepStrictEqual(ngsStatsCounts([s]), { matched: 0, total: 0 });
});

test('sums skip unmatched rows, so a sample\'s Sum Reads counts only runs with stats', () => {
    const out = enrichSampleInfo(overlayNgsStats(
        [limsSample('12437_QM_9', 'DK-1', RUN_A), limsSample('12437_QM_9', 'DK-1', RUN_B)],
        { [RUN_A]: { x: statsRow('DK-1', '12437_QM_9', RUN_A) } }));
    assert.strictEqual(out[0].sumReads, 102);
    assert.strictEqual(out[0].sumMTC, 30.5);
    assert.strictEqual(out[1].sumReads, 102, 'shared by the base IGO id, as before');
});

test('sums are unchanged for LIMS rows (no flag)', () => {
    const out = enrichSampleInfo([limsSample('1_1', 'a', RUN_A), limsSample('1_1', 'a', RUN_B)]);
    assert.strictEqual(out[0].sumReads, 2000);
    assert.strictEqual(out[0].sumMTC, 198);
});

test('QC_STATS_SOURCE selects ngs-stats only when set to ngs-stats', () => {
    for (const [value, expected] of [[undefined, false], ['', false], ['lims', false], ['ngs-stats', true], [' NGS-STATS ', true]]) {
        if (value === undefined) delete process.env.QC_STATS_SOURCE; else process.env.QC_STATS_SOURCE = value;
        assert.strictEqual(usesNgsStats(), expected, `QC_STATS_SOURCE=${value}`);
    }
    delete process.env.QC_STATS_SOURCE;
});
