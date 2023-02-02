export const CELL_RANGER_APPLICATION_COUNT = "Expression"; // CASES: "10X_Genomics-Expression+VDJ", "10X_Genomics_GeneExpression-5"
export const CELL_RANGER_APPLICATION_VDJ = "VDJ"; // TODO

// MODAL STATUS MESSAGES
export const MODAL_ERROR = "MODAL_ERROR";
export const MODAL_UPDATE = "MODAL_UPDATE";
export const MODAL_SUCCESS = "MODAL_SUCCESS";

// REDUX
export const PROJECT_FLAGS = "project_flags";

// HEADERS
export const NGS_HEADERS_TO_REMOVE = [
  "Chemistry",
  "CellRangerVersion",
  "CompressedGraphData",
  "graphs",
  "Transcriptome"
];

// SERVICE ERRORS
export const NGS_STATS = "ngs-stats";
export const PROJECT_INFO = "project-info";

// API fields - Fields of the service response objects
// LIMS
export const LIMS_REQUEST_ID = "requestId";

// NGS-Stats
export const CROSSCHECK_METRICS_ENTRIES = "entries";
export const CROSSCHECK_METRICS_PASS = "pass";
export const CROSSCHECK_METRICS_FLAG = "flag";
export const CROSSCHECK_METRICS_FLAG_PASS = "PASS";
export const CROSSCHECK_METRICS_FLAG_WARNING = "WARNING";
export const CROSSCHECK_METRICS_FLAG_ERROR = "FAIL";
export const CELL_RANGER_SAMPLE_NAME = "id";

// HANDSONTABLE
// Columns not shown as selectors, i.e. shouldn't be toggled off so are not shown
export const TABLE_MANDATORY_COLUMNS = new Set([
  "Sample",
  "QC Status",
  "QC Record Id"
]);
// PROJECT COLUMNS
export const TABLE_HEADERS = ['QC Status', 'IGO ID', 'Sample', 'Initial Pool', 'Run', 'Recipe', 'Sum Reads', 'Examined Reads', 'Unmapped Reads', 'Requested Reads (Millions)', 'Tumor/Normal', '% Adapters', '% Duplication', 'Bait Set', '% Off Bait', '% Target 100x', '% Target 30x', 'Mean Target Coverage', 'Sum Mean Target Coverage', 'Requested Coverage', '% mRNA', '% Ribosomal', 'Stats Version'];
export const ADDITIONAL_10X_TABLE_HEADERS = ['Estimated # of Cells', 'Fraction Read in Cells', 'Mean Reads Per Cell', '# of Reads', 'Reads Mapped to Genome', 'Reads Mapped to Transcriptome', 'Sequencing Saturation', 'Total Genes Detected'];

export const NUMERIC_COLUMNS = ['Sum Reads', 'Examined Reads', 'Unmapped Reads', 'Requested Reads (Millions)'];

// PAGE STATE
export const HOME_PAGE = "HOME";
export const PROJECT_PAGE = "PROJECT";

// REDUX STORE IDs
export const NEEDS_REVIEW_STATE_ID = "projectsToReview";
export const FURTHER_SEQ_STATE_ID = "projectsToSequenceFurther";
export const PENDING_REQUESTS_STATE_ID = "requestsPending";
export const RECENT_DELIVERIES_STATE_ID = "recentDeliveries";
export const RECENT_RUNS_STATE_ID = "recentRuns";
export const PROJECT_QC_STATE_ID = "projectQc";
export const METRICS_PROJECT_LIST_STATE_ID = "cmProjectList";
export const QC_STATUS_PICKLIST = 'qcStatusPicklist';

// RECIPES
export const CUSTOM_CAPTURE = 'CustomCapture';
export const HEMEPACT = 'HemePACT_v4';
export const HEMEBRAINPACT = 'HemeBrainPACT_v1';
export const IMPACT410 = 'IMPACT410';
export const IMPACT468 = 'IMPACT468';
export const IMPACT505 = 'IMPACT505';
export const M_IMPACT_1 = 'M-IMPACT_V1';
export const M_IMPACT_2 = 'M-IMPACT_V2';
export const WHOLE_EXOME = 'WholeExomeSequencing';
export const ENH_WHOLE_EXOME = 'EnhancedWholeExomeSeq';
export const MSK_ACCESS = 'MSK-ACCESS_v1';
export const HUMAN_WHOLE_GENOME = 'HumanWholeGenome';
export const MOUSE_WHOLE_GENOME = 'MouseWholeGenome';
export const S_WGS = 'ShallowWGS';
export const WHOLE_GENOME = 'WholeGenomeSequencing';
export const WHOLE_GENOME_B = 'WholeGenomeBisulfiteSequencing';
export const RNA_SEQ = 'RNASeq';
export const RNA_SEQ_POLYA = 'RNASeq_PolyA';
export const RNA_SEQ_RIBO = 'RNASeq_RiboDeplete';
export const SMARTER_AMP_SEQ = 'SMARTerAmpSeq';
export const AMPLICON = 'AmpliconSeq';
export const ATAC_SEQ = 'ATACSeq';
export const CHIP_SEQ = 'ChIPSeq';
export const CRISPR = 'CRISPRSeq';
export const INVESTIGATOR_PREP_LIB = 'Investigator Prepared Libraries';
export const INVESTIGATOR_PREP_POOL = 'Investigator Prepared Pools';
export const SINGLE_CELL_CNV = 'SingleCellCNV';
export const SINGLE_CELL_RNA = 'SingleCellRNASeq';
export const PED_PEG = 'PED-PEG';
export const METHYL_SEQ = 'MethylCaptureSeq';
export const ARCHER_HEME = 'Archer-HemePanel';
export const ARCHER_TUMOR = 'Archer-SolidTumorPanel';
export const ARCHER_IMMUNO = 'Archer-Immunoverse';
export const MISSION_BIO_HEME = 'MissionBio-Heme';
export const MISSION_BIO_THS = 'MissionBio-THS';
export const MISSION_BIO_MYELOID = 'MissionBio-Myeloid';
export const MISSION_BIO_CUSTOM = 'MissionBio-Custom';
export const TENX_GENOMICS = '10X_Genomics';
export const TENX_GENOMICS_VDJ = '10X_Genomics_VDJ';
export const TENX_GENOMICS_CNV = '10X_Genomics_CNV';
export const TENX_GENOMICS_WGS = '10X_Genomics_WGS';
export const TENX_GENOMICS_ATAC = '10X_Genomics_ATAC';
export const TENX_GENOMICS_BARCODING = '10X_Genomics_FeatureBarcoding';
export const TENX_GENOMICS_BARCODING_3 = '10X_Genomics_FeatureBarcoding-3';
export const TENX_GENOMICS_BARCODING_5 = '10X_Genomics_FeatureBarcoding-5';
export const TENX_GENOMICS_GENE_EXP = '10X_Genomics_GeneExpression';
export const TENX_GENOMICS_GENE_EXP_VDJ = '10X_Genomics_GeneExpression-VDJ';
export const TENX_GENOMICS_GENE_EXP_5 = '10X_Genomics_GeneExpression-5';
export const TENX_GENOMICS_GENE_EXP_3 = '10X_Genomics_GeneExpression-3';
export const TENX_GENOMICS_VISIUM = '10X_Genomics_Visium';
export const TENX_GENOMICS_MULTIOME = '10X_Genomics_Multiome';
export const TENX_GENOMICS_MULTIOME_ATAC = '10X_Genomics_Multiome_ATAC';
export const TENX_GENOMICS_MULTIOME_EXP = '10X_Genomics_Multiome_GeneExpression';

// PROJECT DATA KEYS
export const IGO_ID = 'baseId';
export const CMO_ID = 'cmoId';
export const QC_STATUS = 'qcStatus';
export const SAMPLE_NAME = 'sampleName';
export const RUN = 'run';
export const QC_RECORD_ID = 'recordId';
export const RECIPE = 'recipe';
export const GENOME = 'species';
export const TUMOR_OR_NORMAL = 'tumorOrNormal';
export const CONCENTRATION = 'concentration';
export const FINAL_LIBRARY_YIELD = 'yield';
export const COVERAGE_TARGET = 'coverageTarget';
export const REQUESTED_READS = 'requestedNumberOfReads';
export const PERCENT_ADAPTERS = 'percentAdapters';
export const READS_EXAMINED = 'readsExamined';
export const UNPAIRED_READS = 'unpairedReadsExamined';
export const INITIAL_POOL = 'initialPool';
export const SUM_READS = 'sumReads';
export const UNMAPPED = 'unmapped';
export const PERCENT_DUPLICATION = 'percentDuplication';
export const STARTING_AMOUNT = 'startingAmount';
export const QC_CONTROL = 'qcControl';
export const QC_UNITS = 'qcUnits';
export const QUANT_IT = 'quantIt';
export const QUANT_UNITS = 'quantUnits';
export const PERCENT_RIBOS = 'percentRibosomalBases';
export const PERCENT_MRNA = 'percentMrnaBases';
export const MEAN_TARGET_COVERAGE_WGS = 'mean_COVERAGE';
export const MEAN_TARGET_COVERAGE_HS = 'meanTargetCoverage';
export const PERCENT_30X = 'percentTarget30x';
export const PERCENT_100X = 'percentTarget100x';
export const PERCENT_OFF_BAIT = 'percentOffBait';
export const BAIT_SET = 'baitSet';
export const SUM_MTC = 'sumMTC';
export const STATS_VERSION = 'statsVersion';
