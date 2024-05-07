import { PROJECT_FLAGS,  LIMS_REQUEST_ID, CROSSCHECK_METRICS_FLAG } from './constants';
import * as Constants from './constants';

export const setProjectFlags = (projectList, crosscheckMetrics) => {
    if(!projectList || Object.keys(projectList).length === 0) return [];
    const type = 'Fingerprinting';
    const updatedProjects = projectList.map((project) => {
        const pId = project[LIMS_REQUEST_ID];
        const projectEntry = crosscheckMetrics[pId] || {};
        const flags = projectEntry[CROSSCHECK_METRICS_FLAG];
        if(flags !== null && flags !== undefined){
            project[PROJECT_FLAGS] = {
                [type]: flags
            };
        }
        return project;
    });
    
    return updatedProjects;
};

// HotTable component uses 'columns to hide' feature instead of 'columns to show' so we have to do this weird backwards logic to hide columns based on recipe
export const mapColumnsToHideByRecipe = (recipe, tableHeaders) => {
    const columnHeaders = tableHeaders;

    const examinedReadsColumn = columnHeaders.indexOf('Examined Reads');
    const unmappedReadsColumn = columnHeaders.indexOf('Unmapped Reads');
    const unpairedReadsColumn = columnHeaders.indexOf('Unpaired Reads');
    const sumReadsColumn = columnHeaders.indexOf('Sum Reads');
    const requestedReadsColumn = columnHeaders.indexOf('Requested Reads (Millions)');
    const tumorNormalColumn = columnHeaders.indexOf('Tumor/Normal');
    const percentAdaptersColumn = columnHeaders.indexOf('% Adapters');
    const percentDuplicationColumn = columnHeaders.indexOf('% Duplication');
    const baitSetColumn = columnHeaders.indexOf('Bait Set');
    const percentTarget100Column = columnHeaders.indexOf('% Target 100x');
    const percentTarget30Column = columnHeaders.indexOf('% Target 30x');
    const meanTargetCoverageColumn = columnHeaders.indexOf('Mean Target Coverage');
    const medianCoverageColumn = columnHeaders.indexOf('Median Coverage');
    const percentOffBaitColumn = columnHeaders.indexOf('% Off Bait');
    const meanCoverageColumn = columnHeaders.indexOf('Sum Mean Target Coverage');
    const coverageTargetColumn = columnHeaders.indexOf('Coverage Target');
    const percentMRNAColumn = columnHeaders.indexOf('% mRNA');
    const percentRibosomalColumn = columnHeaders.indexOf('% Ribosomal');
    const statsVersionColumn = columnHeaders.indexOf('Stats Version');
    const recordIdColumn = columnHeaders.indexOf('QC Record Id');
    const initialPoolColumn = columnHeaders.indexOf('Initial Pool');
    const genomeColumn = columnHeaders.indexOf('Genome');

    switch(recipe) {
        case Constants.PED_PEG:
            return [initialPoolColumn, recordIdColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, medianCoverageColumn, coverageTargetColumn, percentOffBaitColumn, tumorNormalColumn, genomeColumn];

        case Constants.INVESTIGATOR_PREP_LIB:
            return [percentMRNAColumn, meanCoverageColumn, percentAdaptersColumn, percentDuplicationColumn, percentRibosomalColumn, examinedReadsColumn, unmappedReadsColumn, unpairedReadsColumn,  initialPoolColumn, recordIdColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, medianCoverageColumn, coverageTargetColumn, percentOffBaitColumn, tumorNormalColumn, statsVersionColumn, genomeColumn];

        case Constants.CUSTOM_CAPTURE:
        case Constants.WES_HUMN:
        case Constants.WES_MOUSE:
        case Constants.ENH_WHOLE_EXOME:
        case Constants.WHOLE_EXOME:
        case Constants.WHOLE_EXOME_SEQ_KAPA:
            return [initialPoolColumn, recordIdColumn, percentAdaptersColumn, coverageTargetColumn, percentMRNAColumn, percentRibosomalColumn, genomeColumn, medianCoverageColumn];

        case Constants.HEMEPACT:
        case Constants.IMPACT505:
        case Constants.IMPACT410:
        case Constants.IMPACT468:
        case Constants.M_IMPACT_1:
        case Constants.M_IMPACT_2:
        case Constants.IMPACT_HEME:
            return [recordIdColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn, medianCoverageColumn];

        case Constants.MSK_ACCESS:
            return [recordIdColumn, percentTarget100Column, percentTarget30Column, coverageTargetColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn, medianCoverageColumn];

        case Constants.HUMAN_WHOLE_GENOME:
        case Constants.MOUSE_WHOLE_GENOME:
            return [recordIdColumn, initialPoolColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, coverageTargetColumn, percentOffBaitColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.S_WGS:
            return [recordIdColumn, initialPoolColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, coverageTargetColumn, percentOffBaitColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.WHOLE_GENOME:
        case Constants.WHOLE_GENOME_B:
        case Constants.WHOLEGENOME:
            return [initialPoolColumn, recordIdColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.RNA_SEQ:
        case Constants.RNA_SEQ_POLYA:
        case Constants.RNA_SEQ_RIBO:
        case Constants.RNA_SEQ_SMARTER_AMP:
        case Constants.RNA_SEQ_TRU_SEQ_POLYA:
        case Constants.RNA_SEQ_TRU_SEQ_RIBO:
        case Constants.RNA_SMARTER:
        case Constants.RNA_SMARTER_CELLS:
        case Constants.SINGLE_CELL_RNA:
            return [initialPoolColumn, recordIdColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, coverageTargetColumn, meanTargetCoverageColumn, medianCoverageColumn, percentOffBaitColumn, tumorNormalColumn, genomeColumn];

        case Constants.DNA_AMPLICON:
        case Constants.USER_AMPLICON:
        case Constants.ATAC:
        case Constants.USER_ATAC:
        case Constants.DNA_CHIP:
        case Constants.DNA_CUTRUN:
        case Constants.USER_CHIP:
        case Constants.USER_CUTRUN:
        case Constants.CRISPR:
        case Constants.TCR_SEQ:
        case Constants.INVESTIGATOR_PREP_POOL:
        case Constants.SINGLE_CELL_CNV_DNA:
        case Constants.SINGLE_CELL_CNV_USER:
            return [initialPoolColumn, recordIdColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, medianCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.METHYL_SEQ:
        case Constants.METHYL_CAPTURE_SEQ:
            return [recordIdColumn, examinedReadsColumn, unmappedReadsColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, medianCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.ARCHER_HEME:
        case Constants.ARCHER_IMMUNO:
        case Constants.ARCHER_TUMOR:
        case Constants.MISSION_BIO_CUSTOM:
        case Constants.MISSION_BIO_HEME:
        case Constants.MISSION_BIO_MYELOID:
        case Constants.MISSION_BIO_THS:
            return [initialPoolColumn, recordIdColumn, unmappedReadsColumn, percentAdaptersColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, medianCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, genomeColumn];

        case Constants.TENX_GENOMICS:
        case Constants.TENX_GENOMICS_ATAC:
        case Constants.TENX_GENOMICS_BCR:
        case Constants.TENX_GENOMICS_TCR:
        case Constants.TENX_GENOMICS_WGS:
        case Constants.TENX_GENOMICS_CNV:
        case Constants.TENX_GENOMICS_GENE_EXP:
        case Constants.TENX_GENOMICS_GENE_EXP_3:
        case Constants.TENX_GENOMICS_GENE_EXP_5:
        case Constants.TENX_GENOMICS_GENE_EXP_VDJ:
        case Constants.SC_CHROMIUM_ATAC:
        case Constants.SC_CHROMIUM_GEX:
        case Constants.SC_CHROMIUM_MULTIOME:
        case Constants.TENX_GENOMICS_MULTIOME_ATAC:
        case Constants.TENX_GENOMICS_MULTIOME_EXP:
        case Constants.TENX_GENOMICS_VISIUM:
            return [initialPoolColumn, recordIdColumn, sumReadsColumn, examinedReadsColumn, unpairedReadsColumn, unmappedReadsColumn, requestedReadsColumn, percentAdaptersColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, medianCoverageColumn, percentMRNAColumn, percentRibosomalColumn, tumorNormalColumn, statsVersionColumn, genomeColumn];

        case Constants.TENX_GENOMICS_BARCODING:
        case Constants.TENX_GENOMICS_BARCODING_3:
        case Constants.TENX_GENOMICS_BARCODING_5:
            return [initialPoolColumn, recordIdColumn, tumorNormalColumn, unmappedReadsColumn, unpairedReadsColumn, percentAdaptersColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, coverageTargetColumn, percentOffBaitColumn, meanCoverageColumn, medianCoverageColumn, percentMRNAColumn, percentRibosomalColumn, statsVersionColumn, genomeColumn];

        case Constants.R_AND_D:
            return [initialPoolColumn, recordIdColumn, genomeColumn];

        case Constants.CMO_CH:
            return [recordIdColumn, percentAdaptersColumn, coverageTargetColumn, percentTarget100Column, percentTarget30Column, meanCoverageColumn, medianCoverageColumn, percentMRNAColumn, percentRibosomalColumn, genomeColumn];

        case Constants.RAPID_RCC:
            return [recordIdColumn, initialPoolColumn, tumorNormalColumn, percentAdaptersColumn, percentDuplicationColumn, baitSetColumn, coverageTargetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, meanCoverageColumn, medianCoverageColumn, percentOffBaitColumn, genomeColumn];

        case Constants.DLP:
            return [recordIdColumn, initialPoolColumn, tumorNormalColumn, sumReadsColumn, percentAdaptersColumn, baitSetColumn, coverageTargetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, meanCoverageColumn, medianCoverageColumn, percentOffBaitColumn, percentMRNAColumn, percentRibosomalColumn, genomeColumn];
        
        default:
            return [];
    }
};

export const orderSampleQcData = (qcSamples) => {
    let tableData = [];

    // data ordering based on order of TABLE_HEADERS
    qcSamples.forEach(sample => {
        let sampleData = [];
        sampleData.push(sample.qc[Constants.QC_STATUS]);
        sampleData.push(sample[Constants.IGO_ID]);
        sampleData.push(sample.qc[Constants.SAMPLE_NAME]);
        sampleData.push(sample[Constants.SUM_READS]);
        sampleData.push(sample[Constants.REQUESTED_READS]);
        const coverageTarget = sample[Constants.COVERAGE_TARGET] || '';
        sampleData.push(coverageTarget);
        const sumMtc = sample[Constants.SUM_MTC] ? sample[Constants.SUM_MTC] : 0;
        sampleData.push(sumMtc.toFixed(2));
        const percentmRNA = Number(sample.qc[Constants.PERCENT_MRNA] * 100).toFixed(2);
        sampleData.push(percentmRNA);
        const percentRibosomal = Number(sample.qc[Constants.PERCENT_RIBOS] * 100).toFixed(2);
        sampleData.push(percentRibosomal);
        sampleData.push(sample.qc[Constants.RECORD_ID]);
        sampleData.push(sample[Constants.INITIAL_POOL]);
        sampleData.push(sample.qc[Constants.RUN]);
        sampleData.push(sample[Constants.RECIPE]);
        sampleData.push(sample.qc[Constants.READS_EXAMINED]);
        sampleData.push(sample.qc[Constants.UNPAIRED_READS]);
        sampleData.push(sample.qc[Constants.UNMAPPED]);
        sampleData.push(sample[Constants.TUMOR_OR_NORMAL]);
        const percentAdapters = Number((sample.qc[Constants.PERCENT_ADAPTERS] * 100).toFixed(6));
        sampleData.push(percentAdapters);
        const percentDuplication = Number(sample.qc[Constants.PERCENT_DUPLICATION] * 100).toFixed(2);
        sampleData.push(percentDuplication);
        sampleData.push(sample.qc[Constants.BAIT_SET]);
        const percentOffBait = Number(sample.qc[Constants.PERCENT_OFF_BAIT] * 100).toFixed(2);
        sampleData.push(percentOffBait);
        const percentTarget100x = Number(sample.qc[Constants.PERCENT_100X] * 100).toFixed(2);
        sampleData.push(percentTarget100x);
        const percentTarget30x = Number(sample.qc[Constants.PERCENT_30X] * 100).toFixed(2);
        sampleData.push(percentTarget30x);
        let meanTargetCoverage = 0;
        if (sample.qc[Constants.MEAN_TARGET_COVERAGE_HS] !== 0) {
            meanTargetCoverage = sample.qc[Constants.MEAN_TARGET_COVERAGE_HS];
        } else if (sample.qc[Constants.MEAN_TARGET_COVERAGE_WGS] !== 0) {
            meanTargetCoverage = sample.qc[Constants.MEAN_TARGET_COVERAGE_WGS];
        }
        sampleData.push(meanTargetCoverage.toFixed(2));
        sampleData.push(sample.qc[Constants.MEDIAN_TARGET_COVERAGE].toFixed(2));
        sampleData.push(sample[Constants.GENOME]);
        const statsVersion = sample.qc[Constants.STATS_VERSION] || '';
        sampleData.push(statsVersion);

        tableData.push(sampleData);
    });

    return tableData;
};

//TODO maybe reshape how we fill the grid with data because this nested loop is poop
export const orderDataWith10XColumns = (originalSampleData, tenXData) => {
    let tableData = [];

    originalSampleData.forEach((originalSample) => {
        let sampleData = originalSample;

        // always shown second in the grid data
        const sampleId = originalSample[1];

        // ensure we're pushing data to corresponding sample
        tenXData.forEach((sample) => {
            if (sample.id.includes(sampleId)) {
                sampleData.push(sample[Constants.EST_NUMBER_OF_CELLS]);
                sampleData.push(sample[Constants.MEAN_READS_PER_CELL]);
                sampleData.push(sample[Constants.FRACTION_READS_IN_CELLS]);
                sampleData.push(sample[Constants.MEDIAN_GENES_PER_CELL]);
                sampleData.push(sample[Constants.MEDIAN_UMI_COUNTS_PER_CELL]);
                sampleData.push(sample[Constants.NUMBER_OF_READS]);
                sampleData.push(sample[Constants.Q30_BARCODE]);
                sampleData.push(sample[Constants.Q30_SAMPLE_INDEX]);
                sampleData.push(sample[Constants.Q30_UMI]);
                sampleData.push(sample[Constants.Q30_RNA_READ]);
                sampleData.push(sample[Constants.READS_MAPPED_ANTISENSE]);
                sampleData.push(sample[Constants.READS_MAPPED_CONFIDENTLY]);
                sampleData.push(sample[Constants.READS_MAPPED_TO_EXONIC_REGIONS]);
                sampleData.push(sample[Constants.READS_MAPPED_TO_GENOME]);
                sampleData.push(sample[Constants.READS_MAPPED_TO_INTERGENIC_REGIONS]);
                sampleData.push(sample[Constants.READS_MAPPED_TO_INTRONIC_REGIONS]);
                sampleData.push(sample[Constants.READS_MAPPED_TO_TRANSCRIPTOME]);
                sampleData.push(sample[Constants.SEQUENCING_SATURATION]);
                sampleData.push(sample[Constants.TOTAL_GENES_DETECTED]);
                sampleData.push(sample[Constants.VALID_BARCODES]);
            }
        });
        tableData.push(sampleData);
    });
    
    return tableData;
};

export const getColumnDataTypes = (currentHiddenColumns) => {
    let types = [];
    Constants.TABLE_HEADERS.forEach((header, index) => {
        if (!currentHiddenColumns.includes(index)) {
            if (Constants.NUMERIC_COLUMNS.includes(header)) {
                types.push({type: 'numeric'});
            } else {
                types.push({});
            }
        }
    });
    return types;
};

export const getColumnNamesFromIndices = (indices, allColumns) => {
    let columnNames = [];
    indices.forEach(index => {
        columnNames.push(allColumns[index]);
    });
    return columnNames;
};

// TODO refactor - this is old logic 
export const filterDuplicatePairs = (entryList) => {
    const orderedEntries = entryList
        // Remove any same-sample lines
        .filter((entry) => {
            return entry['igoIdA'] !== entry['igoIdB'];
        })
        // Order alphabetically by igoIdA & igoIdB
        .sort((e1, e2) => {
            const id1 = e1['igoIdA'].toUpperCase() + e1['igoIdB'].toUpperCase();
            const id2 = e2['igoIdA'].toUpperCase() + e2['igoIdB'].toUpperCase();

            return (id1 < id2) ? -1 : (id1 > id2) ? 1 : 0;
        });

    const filteredEntries = [];
    const pairs = new Set();
    for(let entry of orderedEntries){
        // Get unique key for every pair (must sort)
        const key_list = [entry['igoIdA'], entry['igoIdB']].sort();
        key_list.push(entry['result']);
        const key = key_list.join(',');

        if(!pairs.has(key)){
            pairs.add(key);
            filteredEntries.push(entry);
        }
    }
    return filteredEntries;
};

export const getProjectType = (samples) => {
    const project_recipes = [];
    const all_recipes = samples.map(sample => sample.recipe);
    all_recipes.forEach(recipe => {
        if (!project_recipes.includes(recipe)) {
            project_recipes.push(recipe);
        }
    });
    const recipesAsString = project_recipes.join(',');

    return recipesAsString;
};
