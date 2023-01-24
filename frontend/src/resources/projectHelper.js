import { PROJECT_FLAGS,  LIMS_REQUEST_ID, CROSSCHECK_METRICS_FLAG } from './constants';
import * as Constants from './constants';

export const setProjectFlags = (projectList, crosscheckMetrics) => {
    if(projectList === null || Object.keys(projectList).length === 0) return;
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

export const mapColumnsToHideByRecipe = (recipe) => {
    const columnHeaders = Constants.TABLE_HEADERS;

    const examinedReadsColumn = columnHeaders.indexOf('Examined Reads');
    const unmappedReadsColumn = columnHeaders.indexOf('Unmapped Reads');
    const percentAdaptersColumn = columnHeaders.indexOf('% Adapters');
    const percentDuplicationColumn = columnHeaders.indexOf('% Duplication');
    const baitSetColumn = columnHeaders.indexOf('Bait Set');
    const percentTarget100Column = columnHeaders.indexOf('% Target 100x');
    const percentTarget30Column = columnHeaders.indexOf('% Target 30x');
    const meanTargetCoverageColumn = columnHeaders.indexOf('Mean Target Coverage');
    const percentOffBaitColumn = columnHeaders.indexOf('% Off Bait');
    const meanCoverageColumn = columnHeaders.indexOf('Sum Mean Target Coverage');
    const percentMRNAColumn = columnHeaders.indexOf('% mRNA');
    const percentRibosomalColumn = columnHeaders.indexOf('% Ribosomal');

    switch(recipe) {
        case Constants.PED_PEG:
            return [baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn];
        case Constants.CUSTOM_CAPTURE:
        case Constants.HEMEPACT:
        case Constants.IMPACT505:
        case Constants.IMPACT410:
        case Constants.IMPACT468:
        case Constants.M_IMPACT_1:
        case Constants.M_IMPACT_2:
        case Constants.WHOLE_EXOME:
        case Constants.ENH_WHOLE_EXOME:
            return [meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.MSK_ACCESS:
            return [percentTarget100Column, percentTarget30Column, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.HUMAN_WHOLE_GENOME:
        case Constants.MOUSE_WHOLE_GENOME:
            return [baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.S_WGS:
            return [baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.WHOLE_GENOME:
        case Constants.WHOLE_GENOME_B:
            return [baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.RNA_SEQ:
        case Constants.RNA_SEQ_POLYA:
        case Constants.RNA_SEQ_RIBO:
        case Constants.SMARTER_AMP_SEQ:
        case Constants.SINGLE_CELL_RNA:
            return [percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn];

        case Constants.AMPLICON:
        case Constants.ATAC_SEQ:
        case Constants.CHIP_SEQ:
        case Constants.CRISPR:
        case Constants.INVESTIGATOR_PREP_LIB:
        case Constants.INVESTIGATOR_PREP_POOL:
        case Constants.SINGLE_CELL_CNV:
            return [percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.METHYL_SEQ:
            return [examinedReadsColumn, unmappedReadsColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.ARCHER_HEME:
        case Constants.ARCHER_IMMUNO:
        case Constants.ARCHER_TUMOR:
        case Constants.MISSION_BIO_CUSTOM:
        case Constants.MISSION_BIO_HEME:
        case Constants.MISSION_BIO_MYELOID:
        case Constants.MISSION_BIO_THS:
            return [unmappedReadsColumn, percentAdaptersColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

        case Constants.TENX_GENOMICS:
        case Constants.TENX_GENOMICS_ATAC:
        case Constants.TENX_GENOMICS_VDJ:
        case Constants.TENX_GENOMICS_WGS:
        case Constants.TENX_GENOMICS_CNV:
        case Constants.TENX_GENOMICS_BARCODING:
        case Constants.TENX_GENOMICS_BARCODING_3:
        case Constants.TENX_GENOMICS_BARCODING_5:
        case Constants.TENX_GENOMICS_GENE_EXP:
        case Constants.TENX_GENOMICS_GENE_EXP_3:
        case Constants.TENX_GENOMICS_GENE_EXP_5:
        case Constants.TENX_GENOMICS_GENE_EXP_VDJ:
        case Constants.TENX_GENOMICS_MULTIOME:
        case Constants.TENX_GENOMICS_MULTIOME_ATAC:
        case Constants.TENX_GENOMICS_MULTIOME_EXP:
        case Constants.TENX_GENOMICS_VISIUM:
            return [examinedReadsColumn, unmappedReadsColumn, percentDuplicationColumn, baitSetColumn, percentTarget100Column, percentTarget30Column, meanTargetCoverageColumn, percentOffBaitColumn, meanCoverageColumn, percentMRNAColumn, percentRibosomalColumn];

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
        sampleData.push(sample[Constants.INITIAL_POOL]);
        sampleData.push(sample.qc[Constants.RUN]);
        sampleData.push(sample[Constants.RECIPE]);
        sampleData.push(sample[Constants.SUM_READS]);
        sampleData.push(sample.qc[Constants.READS_EXAMINED]);
        sampleData.push(sample.qc[Constants.UNMAPPED]);
        const percentAdapters = Number((sample.qc[Constants.PERCENT_ADAPTERS] * 100).toFixed(6));
        sampleData.push(percentAdapters);
        const percentDuplication = Number(sample.qc[Constants.PERCENT_DUPLICATION] * 100).toFixed(2);
        sampleData.push(percentDuplication);
        sampleData.push(sample.qc[Constants.BAIT_SET]);
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
        const percentOffBait = Number(sample.qc[Constants.PERCENT_OFF_BAIT] * 100).toFixed(2);
        sampleData.push(percentOffBait);
        sampleData.push(sample[Constants.SUM_MTC].toFixed(2));
        const percentmRNA = Number(sample.qc[Constants.PERCENT_MRNA] * 100).toFixed(2);
        sampleData.push(percentmRNA);
        const percentRibosomal = Number(sample.qc[Constants.PERCENT_RIBOS] * 100).toFixed(2);
        sampleData.push(percentRibosomal);

        // fill in 10x table values
        if (sample[Constants.RECIPE].includes('10X')) {

        }

        tableData.push(sampleData);
    });

    return tableData;
};

export const getColumnNamesFromIndices = (indices) => {
    let columnNames = [];
    indices.forEach(index => {
        columnNames.push(Constants.TABLE_HEADERS[index]);
    });
    return columnNames;
};
