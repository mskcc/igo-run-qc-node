/**
 * QC_STATS_SOURCE=ngs-stats: the project QC table's metrics come straight from ngs-stats (on dev, the
 * dev ngs-stats that Temporal beta files into) instead of LIMS's SeqAnalysisSampleQC records. LIMS still
 * supplies the samples, runs, QC statuses and record ids, so dev runqc can read production LIMS read-only.
 *
 * The values are what LimsRest's updateLimsSampleLevelSequencingQc would have filed in LIMS from the same
 * `picardstats/run/<run>` rows (UpdateLimsSampleLevelSequencingQcTask.getQcValues, then GetSampleQcTask):
 * the same field mapping, a missing number becomes 0 and a missing string "null".
 */

const NGS_STATS_SOURCE = 'ngs-stats';

const qcStatsSource = () => (process.env.QC_STATS_SOURCE || '').trim().toLowerCase();
const usesNgsStats = () => qcStatsSource() === NGS_STATS_SOURCE;

// ngs-stats picardstats field -> getProjectQc's qc field
const NUMERIC_FIELDS = {
    read_PAIRS_EXAMINED: 'readsExamined',
    TOTAL_READS: 'totalReads',
    unmapped_READS: 'unmapped',
    read_PAIRS_DUPLICATES: 'readsDuped',
    unpairedReads: 'unpairedReadsExamined',
    mean_COVERAGE: 'mean_COVERAGE',
    median_COVERAGE: 'median_COVERAGE',
    mean_TARGET_COVERAGE: 'meanTargetCoverage',
    pct_TARGET_BASES_100X: 'percentTarget100x',
    pct_TARGET_BASES_30X: 'percentTarget30x',
    pct_TARGET_BASES_10X: 'percentTarget10x',
    pct_ADAPTER: 'percentAdapters',
    pct_CODING_BASES: 'percentCodingBases',
    pct_EXC_BASEQ: 'pct_EXC_BASEQ',
    pct_EXC_DUPE: 'pct_EXC_DUPE',
    pct_EXC_MAPQ: 'pct_EXC_MAPQ',
    pct_EXC_TOTAL: 'pct_EXC_TOTAL',
    pct_INTERGENIC_BASES: 'percentIntergenicBases',
    pct_INTRONIC_BASES: 'percentIntronicBases',
    pct_MRNA_BASES: 'percentMrnaBases',
    pct_OFF_BAIT: 'percentOffBait',
    pct_RIBOSOMAL_BASES: 'percentRibosomalBases',
    pct_UTR_BASES: 'percentUtrBases',
    percent_DUPLICATION: 'percentDuplication',
    zero_CVG_TARGETS_PCT: 'zeroCoveragePercent',
};
const STRING_FIELDS = {
    bait_SET: 'baitSet',
    statsVersion: 'statsVersion',
};
// qc fields LimsRest doesn't fill from ngs-stats; blanked so no LIMS metric shows through
const UNFILLED_FIELDS = ['percentTarget40x', 'percentTarget80x'];
const METRIC_FIELDS = [...Object.values(NUMERIC_FIELDS), ...Object.values(STRING_FIELDS), ...UNFILLED_FIELDS];

// UpdateLimsSampleLevelSequencingQcTask.getVersionLessRunId
const versionLessRunId = (run) => String(run || '').replace(/_[A-Z][0-9]+$/, '');

const isNanopore = (sample) => !!(sample.recipe && sample.recipe.toLowerCase().includes('nanopore'));

/**
 * ngs-stats names a sample "<OtherSampleId>_IGO_<IGO id>"; getIgoId and getIgoSampleName in
 * UpdateLimsSampleLevelSequencingQcTask split it the same way (pooled normals keep name_barcode).
 */
const parseStatsSample = (statsSample) => {
    const parts = String(statsSample || '').split('_IGO_');
    if (parts.length !== 2) {
        return null;
    }
    const [name, igo] = parts;
    let igoId = igo;
    if (igo.includes('POOLEDNORMAL') || igo.includes('CTRL')) {
        const barcode = igo.split('_').pop();
        igoId = `${name}_${barcode}`;
    }
    return { igoId, sampleName: name.replace(/_rescue$/, '') };
};

const toQcFields = (row) => {
    const fields = {};
    for (const [from, to] of Object.entries(NUMERIC_FIELDS)) {
        const value = row[from];
        fields[to] = value === null || value === undefined ? 0 : Number(value);
    }
    for (const [from, to] of Object.entries(STRING_FIELDS)) {
        fields[to] = String(row[from] === undefined ? null : row[from]);
    }
    for (const to of UNFILLED_FIELDS) {
        fields[to] = null;
    }
    return fields;
};

/**
 * Index one run's picardstats rows by version-less run id and IGO id. Only the IGO id: matching on the
 * sample name too could give a row another project's values, and a blank row is safer than a wrong one.
 */
const indexRunStats = (runStats) => {
    const byId = new Map();
    for (const row of Object.values(runStats || {})) {
        const parsed = parseStatsSample(row.sample);
        if (!parsed) {
            continue;
        }
        byId.set(`${versionLessRunId(row.run)}|${parsed.igoId}`, row);
    }
    return byId;
};

/** Runs of the project's samples that need ngs-stats, one entry per run name as LIMS gives it. */
const runsToFetch = (samples) =>
    [...new Set(samples.filter(s => !isNanopore(s) && s.qc && s.qc.run).map(s => s.qc.run))];

/**
 * Returns new samples whose qc metrics come from ngs-stats. statsByRun maps a run name to that run's
 * picardstats response ({} or undefined when ngs-stats has none). Each sample's qc gets
 * ngsStatsMatched: true with the ngs-stats values, or false with every metric null. Nanopore samples
 * (ONT stats aren't in picardstats) are returned unchanged, without the flag.
 */
const overlayNgsStats = (samples, statsByRun) => {
    const indexes = new Map();
    const indexFor = (run) => {
        const key = versionLessRunId(run);
        if (!indexes.has(key)) {
            const merged = new Map();
            for (const [name, stats] of Object.entries(statsByRun || {})) {
                if (versionLessRunId(name) === key) {
                    indexRunStats(stats).forEach((v, k) => merged.set(k, v));
                }
            }
            indexes.set(key, merged);
        }
        return indexes.get(key);
    };

    return samples.map((sample) => {
        if (isNanopore(sample) || !sample.qc) {
            return sample;
        }
        const qc = sample.qc;
        const run = versionLessRunId(qc.run);
        const idx = indexFor(qc.run);
        const row = idx.get(`${run}|${sample.baseId}`);
        if (row) {
            return { ...sample, qc: { ...qc, ...toQcFields(row), ngsStatsMatched: true } };
        }
        const blank = Object.fromEntries(METRIC_FIELDS.map(f => [f, null]));
        return { ...sample, qc: { ...qc, ...blank, ngsStatsMatched: false } };
    });
};

/** { matched, total } over the samples overlayNgsStats flagged. */
const ngsStatsCounts = (samples) => {
    const flagged = samples.filter(s => s.qc && typeof s.qc.ngsStatsMatched === 'boolean');
    return { matched: flagged.filter(s => s.qc.ngsStatsMatched).length, total: flagged.length };
};

module.exports = {
    NGS_STATS_SOURCE,
    METRIC_FIELDS,
    usesNgsStats,
    versionLessRunId,
    parseStatsSample,
    toQcFields,
    indexRunStats,
    runsToFetch,
    overlayNgsStats,
    ngsStatsCounts,
};
