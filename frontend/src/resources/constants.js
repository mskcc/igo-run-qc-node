export const CELL_RANGER_APPLICATION_COUNT = 'GEX'; // CASES: '10X_Genomics-Expression+VDJ', '10X_Genomics_GeneExpression-5'
export const CELL_RANGER_APPLICATION_VDJ = 'CR'; //CASES: 'SC_Chromium-TCR', 'SC_Chromium-BCR'
export const CELL_RANGER_APPLICATION_MULTI = 'Multiome';
export const CELL_RANGER_APPLICATION_FEATURE_BARCODE = 'FeatureBarcoding';
export const CELL_RANGER_APPLICATION_VISIUM = 'Visium';

// MODAL STATUS MESSAGES
export const MODAL_ERROR = 'MODAL_ERROR';
export const MODAL_UPDATE = 'MODAL_UPDATE';
export const MODAL_SUCCESS = 'MODAL_SUCCESS';

// REDUX
export const PROJECT_FLAGS = 'project_flags';

// HEADERS
export const NGS_HEADERS_TO_REMOVE = [
  'Chemistry',
  'CellRangerVersion',
  'CompressedGraphData',
  'graphs',
  'Transcriptome'
];

// SERVICE ERRORS
export const NGS_STATS = 'ngs-stats';
export const PROJECT_INFO = 'project-info';

// API fields - Fields of the service response objects
// LIMS
export const LIMS_REQUEST_ID = 'requestId';

// NGS-Stats
export const CROSSCHECK_METRICS_ENTRIES = 'entries';
export const CROSSCHECK_METRICS_PASS = 'pass';
export const CROSSCHECK_METRICS_FLAG = 'flag';
export const CROSSCHECK_METRICS_FLAG_PASS = 'PASS';
export const CROSSCHECK_METRICS_FLAG_WARNING = 'WARNING';
export const CROSSCHECK_METRICS_FLAG_ERROR = 'FAIL';
export const CELL_RANGER_SAMPLE_NAME = 'id';

// HANDSONTABLE
// Columns not shown as selectors, i.e. shouldn't be toggled off so are not shown
export const TABLE_MANDATORY_COLUMNS = new Set([
  'Sample',
  'QC Status',
  'QC Record Id'
]);
// PROJECT COLUMNS
export const TABLE_HEADERS = ['QC Status', 'IGO ID', 'Sample', 'Sum Reads', 'Requested Reads (Millions)', 'Coverage Target', 'Sum Mean Target Coverage', '% mRNA', '% Ribosomal', 'QC Record Id', 'Initial Pool', 'Run', 'Recipe',  'Examined Reads', 'Unpaired Reads', 'Unmapped Reads', 'Tumor/Normal', '% Adapters', '% Duplication', 'Bait Set', '% Off Bait', '% Target 100x', '% Target 30x', 'Mean Target Coverage', 'Median Coverage', 'Genome', 'Stats Version'];
export const ADDITIONAL_10X_TABLE_HEADERS = ['Estimated # of Cells', 'Mean Reads Per Cell', 'Fraction Reads in Cells', 'Median Genes Per Cell', 'Median UMI Counts Per Cell', '# of Reads', 'Q30 Bases in Barcode', 'Q30 Bases in Sample Index', 'Q30 Bases in UMI', 'Q30 Bases in RNA Read', 'Reads Mapped Antisense to Gene', 'Reads Mapped Confidently to Genome', 'Reads Mapped to Exonic Regions', 'Reads Mapped to Genome', 'Reads Mapped to Intergenic Regions', 'Reads Mapped to Intronic Regions', 'Reads Mapped to Transcriptome', 'Sequencing Saturation', 'Total Genes Detected', 'Valid Barcodes'];
export const NANOPORE_HEADERS =['QC Status', 'IGO ID', 'Sample','Reads','Bases','N50','Median Read Length','Flowcell','Estimated Coverage'];
export const NUMERIC_COLUMNS = ['Sum Reads', 'Examined Reads', 'Unmapped Reads', 'Requested Reads (Millions)'];

// PAGE STATE
export const HOME_PAGE = 'HOME';
export const PROJECT_PAGE = 'PROJECT';

// REDUX STORE IDs
export const NEEDS_REVIEW_STATE_ID = 'projectsToReview';
export const FURTHER_SEQ_STATE_ID = 'projectsToSequenceFurther';
export const PENDING_REQUESTS_STATE_ID = 'requestsPending';
export const RECENT_DELIVERIES_STATE_ID = 'recentDeliveries';
export const RECENT_RUNS_STATE_ID = 'recentRuns';
export const PROJECT_QC_STATE_ID = 'projectQc';
export const METRICS_PROJECT_LIST_STATE_ID = 'cmProjectList';
export const QC_STATUS_PICKLIST = 'qcStatusPicklist';
export const PROJECT_CROSSCHECK_METRICS = 'projectCrosscheckMetrics';

// RECIPES
export const CUSTOM_CAPTURE = 'HC_Custom';
export const HEMEPACT = 'HemePACT_v4';
export const HEMEBRAINPACT = 'HemeBrainPACT_v1';
export const IMPACT410 = 'IMPACT410';
export const IMPACT468 = 'IMPACT468';
export const IMPACT505 = 'HC_IMPACT';
export const M_IMPACT_1 = 'M-IMPACT_V1';
export const M_IMPACT_2 = 'HC_IMPACT-Mouse';
export const WES_HUMN = 'WES_Human';
export const WES_MOUSE = 'WES_Mouse';
export const ENH_WHOLE_EXOME = 'EnhancedWholeExomeSeq';
export const WHOLE_EXOME ='WholeExome'; // Request name
export const WHOLE_EXOME_SEQ_KAPA ='WholeExomeSequencing-KAPALib';
export const MSK_ACCESS = 'HC_ACCESS';
export const HUMAN_WHOLE_GENOME = 'WGS_Deep';
export const MOUSE_WHOLE_GENOME = 'WGS_Deep';
export const S_WGS = 'WGS_Shallow';
export const WHOLE_GENOME = 'WGS_Metagenomic';
export const WHOLEGENOME = 'WholeGenome';
export const WHOLE_GENOME_B = 'User_WGBS';
export const RNA_SEQ = 'User-RNA';
export const RNA_SEQ_POLYA = 'RNA_PolyA';
export const RNA_SEQ_RIBO = 'RNA_Ribodeplete';
export const RNA_SEQ_SMARTER_AMP = 'RNALibraryPrep'; // Request name
export const RNA_SEQ_TRU_SEQ_POLYA = 'RNASeq-TruSeqPolyA';
export const RNA_SEQ_TRU_SEQ_RIBO = 'RNASeq-TruSeqRiboDeplete';
export const RNA_SMARTER_CELLS = 'RNA_SMARTer-Cells';
export const RNA_SMARTER = 'RNA_SMARTer-RNA';
export const DNA_AMPLICON = 'DNA_Amplicon';
export const USER_AMPLICON = 'User_Amplicon';
export const ATAC = 'ATAC';
export const USER_ATAC = 'User_ATAC';
export const DNA_CHIP = 'DNA_ChIP';
export const DNA_CUTRUN = 'DNA_CUT&RUN';
export const USER_CHIP = 'User_ChIP';
export const USER_CUTRUN = 'User_CUT&RUN';
export const CRISPR = 'CRISPRSeq';
export const INVESTIGATOR_PREP_LIB = 'UserLibrary';
export const INVESTIGATOR_PREP_POOL = 'UserLibrary';
export const SINGLE_CELL_CNV_DNA = 'DNA_SingleCellCNV';
export const SINGLE_CELL_CNV_USER = 'User_SingleCellCNV';
export const SINGLE_CELL_RNA = 'SingleCellRNASeq';
export const PED_PEG = 'PEDPEG';
export const METHYL_CAPTURE_SEQ = 'Methyl_Capture';
export const METHYL_SEQ = 'MethylSeq';
export const ARCHER_HEME = 'Archer-HemePanel';
export const ARCHER_TUMOR = 'Archer-SolidTumorPanel';
export const ARCHER_IMMUNO = 'Archer-Immunoverse';
export const MISSION_BIO_HEME = 'User_MissionBio';
export const MISSION_BIO_THS = 'MissionBio-THS';
export const MISSION_BIO_MYELOID = 'MissionBio-Myeloid';
export const MISSION_BIO_CUSTOM = 'User_MissionBio';
export const TENX_GENOMICS = 'User_Chromium';
export const TENX_GENOMICS_BCR = 'SC_Chromium-BCR';
export const TENX_GENOMICS_TCR = 'SC_Chromium-TCR';
export const TENX_GENOMICS_CNV = '10X_Genomics_CNV';
export const TENX_GENOMICS_WGS = '10X_Genomics_WGS';
export const TENX_GENOMICS_ATAC = 'User_Chromium-ATAC';
export const TENX_GENOMICS_BARCODING = '10X_Genomics_FeatureBarcoding';
export const TENX_GENOMICS_BARCODING_3 = 'SC_Chromium-FB-3';
export const TENX_GENOMICS_BARCODING_5 = 'SC_Chromium-FB-5';
export const TENX_GENOMICS_GENE_EXP = '10X_Genomics_GeneExpression';
export const TENX_GENOMICS_GENE_EXP_VDJ = '10X_Genomics_GeneExpression-VDJ';
export const TENX_GENOMICS_GENE_EXP_5 = 'SC_Chromium-GEX-5';
export const TENX_GENOMICS_GENE_EXP_3 = 'SC_Chromium-GEX-3';
export const TENX_GENOMICS_VISIUM = 'ST_Visium';
export const SC_CHROMIUM_ATAC = 'SC_Chromium-ATAC';
export const NANOPORE='Nanopore'; // Adding Nanopore recipe 

//export const SC_CHROMIUM_GEX = 'SC_Chromium-GEX-3';
export const SC_CHROMIUM_MULTIOME = 'SC_Chromium-Multiome';
export const TENX_GENOMICS_MULTIOME_ATAC = 'SC_Chromium-Multiome-ATAC';
export const TENX_GENOMICS_MULTIOME_EXP = 'SC_Chromium-Multiome-GEX';
export const R_AND_D = 'R&D_Other';
export const CMO_CH = 'HC_CMOCH';
export const IMPACT_HEME = 'HybridCapture'; // Request name
export const RAPID_RCC = 'Rapid-RCC';
export const TCR_SEQ = 'TCR_IGO';
export const DLP = 'SC_DLP';

// PROJECT DATA KEYS
export const IGO_ID = 'baseId';
export const CMO_ID = 'cmoId';
export const QC_STATUS = 'qcStatus';
export const RECORD_ID = 'recordId';
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
export const MEDIAN_TARGET_COVERAGE = 'median_COVERAGE';
export const MEAN_TARGET_COVERAGE_WGS = 'mean_COVERAGE';
export const MEAN_TARGET_COVERAGE_HS = 'meanTargetCoverage';
export const PERCENT_30X = 'percentTarget30x';
export const PERCENT_100X = 'percentTarget100x';
export const PERCENT_OFF_BAIT = 'percentOffBait';
export const BAIT_SET = 'baitSet';
export const SUM_MTC = 'sumMTC';
export const STATS_VERSION = 'statsVersion';

// 10X DATA KEYS
export const EST_NUMBER_OF_CELLS = 'EstimatedNumberOfCells';
export const FRACTION_READS_IN_CELLS = 'FractionReadsInCells';
export const MEAN_READS_PER_CELL = 'MeanReadsPerCell';
export const MEDIAN_GENES_PER_CELL = 'MedianGenesPerCell';
export const MEDIAN_UMI_COUNTS_PER_CELL = 'MedianUMICountsPerCell';
export const NUMBER_OF_READS = 'NumberOfReads';
export const Q30_BARCODE = 'Q30BasesInBarcode';
export const Q30_SAMPLE_INDEX = 'Q30BasesInSampleIndex';
export const Q30_UMI = 'Q30BasesInUMI';
export const Q30_RNA_READ = 'Q30BasesinRNARead';
export const READS_MAPPED_ANTISENSE = 'ReadsMappedAntisenseToGene';
export const READS_MAPPED_CONFIDENTLY = 'ReadsMappedConfidentlyToGenome';
export const READS_MAPPED_TO_EXONIC_REGIONS = 'ReadsMappedToExonicRegions';
export const READS_MAPPED_TO_GENOME = 'ReadsMappedToGenome';
export const READS_MAPPED_TO_INTERGENIC_REGIONS = 'ReadsMappedToIntergenicRegions';
export const READS_MAPPED_TO_INTRONIC_REGIONS = 'ReadsMappedToIntronicRegions';
export const READS_MAPPED_TO_TRANSCRIPTOME = 'ReadsMappedToTranscriptome';
export const SEQUENCING_SATURATION = 'SequencingSaturation';
export const TOTAL_GENES_DETECTED = 'TotalGenesDetected';
export const VALID_BARCODES = 'ValidBarcodes';




//Nanopore Data Sets 
export const  READS_NANOPORE= 'Reads';
export const  BASES= 'Bases';
export const  N50 = 'N50';
export const  MEDIAN_READ_LENGTH= 'Meadian Read Length';
export const FLOWCELL='Flowcell';
export const  POSITION= 'Position';
export const  ESTIMATED_COVERAGE= ' Estimated_Cov';