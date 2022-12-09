const glob = require('glob');
const fs = require('fs');
const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const utils = require('../util/helpers');
const { loggers } = require('winston');
const logger = loggers.get('logger');
const DIR_PATH = process.env.FASTQC_PATH;

/**
 * Returns the recent projects from the Seq Analysis LIMS table
    {
        'projectsToReview': [],
        'projectsToSequenceFurther': [],
        'requestsPending':  []
    }
 */
exports.getSeqAnalysisProjects = [
    function (req, res) {
        let recentDeliveriesPromise = apiServices.getRecentDeliveries();
        let seqRequestsPromise = apiServices.getSequencingRequests();
        Promise.all([recentDeliveriesPromise, seqRequestsPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, `Could not find recent deliveries or sequencing requests.`);
                }
                let [recentDeliveriesResult, seqRequestsResults] = results;

                const reviewedRequestIdList = [];
                let incompleteRequests = [];
                const projectsToReview = [];
                const projectsToSequenceFurther = [];
                let requestsPending = [];

                // recent deliveries = reviewed requests
                recentDeliveriesResult.forEach((project)=> {
                    reviewedRequestIdList.push(project.requestId);

                    const projectObj = utils.addProjectProperties(project);
                    if (projectObj.needsReview) {
                        projectsToReview.push(projectObj);
                    } else {
                        projectsToSequenceFurther.push(projectObj);
                    }
                });
                
                // sequencing requests = incomplete requests
                if (!seqRequestsResults.requests) {
                    logger.log('warning', 'No incomplete sequencing requests found');
                } else {
                    incompleteRequests = seqRequestsResults.requests;
                }

                // Remove any incomplete requests that are not in the review queue / recently delivered.
                requestsPending = incompleteRequests.filter((request) => {
                    return !reviewedRequestIdList.includes(request.requestId);
                });

                let responseObject = {
                    projectsToReview,
                    projectsToSequenceFurther,
                    requestsPending
                };

                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];

/**
 * returns 
 * {
 *  recentDeliveries: []
 * }
 */
exports.getRecentDeliveries = [
    function (req, res) {
        let recentDeliveriesPromise = apiServices.getRequestProjects();
        Promise.all([recentDeliveriesPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, `Could not find recent deliveries.`);
                }
                let [recentDeliveriesResult] = results;

                const recentDeliveries = [];
                recentDeliveriesResult.forEach((project) => {
                    const projectObj = utils.addProjectProperties(project);
                    recentDeliveries.push(projectObj);
                });

                let responseObject = {
                    recentDeliveries
                };

                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];

/**
 * returns 
 * {
 *  recentRuns: []
 * }
 */
exports.getRecentRuns = [
    function(req, res) {
        const days = req.query.days ? req.query.days : 7;
        const fastQcFiles = `${DIR_PATH}*.html`;
        const today = new Date();
        let recentRuns = [];
        glob(fastQcFiles, (error, files) => {
            if (error) {
                return apiResponse.errorResponse(res, `Error retrieving files: ${error}`);
            }
            files.forEach((file) => {
                let projectData = {};
                let mtime;
                let modifiedTimestamp = '';
                fs.stat(file, (err, stats) => {
                    if (err) {
                        return apiResponse.errorResponse(res, `Error retrieving file stats: ${err}`);
                    }
                    mtime = new Date(stats.mtime);
                    const modifiedDate = mtime.toISOString();
                    //slice date and time out of modifiedDate string: 2022-10-21T14:05:30.074Z
                    const tempDateString = modifiedDate.replace('T', ' ');
                    modifiedTimestamp = tempDateString.substring(0, tempDateString.length - 8);
                });
                const timeDiff = today.getTime() - mtime.getTime();
                const dayDiff = timeDiff / (1000*3600*24);
                if (dayDiff < days) {
                    projectData.date = modifiedTimestamp;
                    const fileName = file.split('.')[0];
                    projectData.runName = fileName;
                    projectData.path = `static/html/FASTQ/${file}`;
                    projectData.runStats = `getInterOpsData?runId=${fileName}`;
                    recentRuns.push(projectData);
                }
            });
        });
        // TODO REMOVE MOCK DATA FOR LAUNCH
        recentRuns = [
            {
                'date':'2019-12-22 12:13',
                'path':'static/html/FASTQ/VIC_2475_000000000-CP949_laneBarcode.html',
                'runName':'VIC_2475_000000000-CP949_laneBarcode.html',
                'runStats':'getInterOpsData?runId=VIC_2475_000000000-CP949_laneBarcode.html'
            },
            {
                'date':'2019-12-22 11:15',
                'path':'static/html/FASTQ/AYYAN_0015_000000000-CPK5W_laneBarcode.html',
                'runName':'AYYAN_0015_000000000-CPK5W_laneBarcode.html',
                'runStats':'getInterOpsData?runId=AYYAN_0015_000000000-CPK5W_laneBarcode.html'
            },
            {
                'date':'2019-12-21 16:30',
                'path':'static/html/FASTQ/MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html',
                'runName':'MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html',
                'runStats':'getInterOpsData?runId=MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html'
            },
            {
                'date':'2019-12-21 15:24',
                'path':'static/html/FASTQ/MICHELLE_0189_BHMVTTDMXX_laneBarcode.html',
                'runName':'MICHELLE_0189_BHMVTTDMXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=MICHELLE_0189_BHMVTTDMXX_laneBarcode.html'
            },
            {
                'date':'2019-12-21 13:04',
                'path':'static/html/FASTQ/SCOTT_0167_AHTNKVBGXC_laneBarcode.html',
                'runName':'SCOTT_0167_AHTNKVBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0167_AHTNKVBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-21 06:50',
                'path':'static/html/FASTQ/JAX_0399_BHCYWCBBXY_laneBarcode.html',
                'runName':'JAX_0399_BHCYWCBBXY_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JAX_0399_BHCYWCBBXY_laneBarcode.html'
            },
            {
                'date':'2019-12-21 03:58',
                'path':'static/html/FASTQ/JAX_0398_AHCYYGBBXY_laneBarcode.html',
                'runName':'JAX_0398_AHCYYGBBXY_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JAX_0398_AHCYYGBBXY_laneBarcode.html'
            },
            {
                'date':'2019-12-21 01:06',
                'path':'static/html/FASTQ/JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html',
                'runName':'JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html'
            },
            {
                'date':'2019-12-20 12:08',
                'path':'static/html/FASTQ/TOMS_5380_000000000-CP35V_laneBarcode.html',
                'runName':'TOMS_5380_000000000-CP35V_laneBarcode.html',
                'runStats':'getInterOpsData?runId=TOMS_5380_000000000-CP35V_laneBarcode.html'
            },
            {
                'date':'2019-12-20 05:30',
                'path':'static/html/FASTQ/KIM_0761_AHC2GMBCX3_laneBarcode.html',
                'runName':'KIM_0761_AHC2GMBCX3_laneBarcode.html',
                'runStats':'getInterOpsData?runId=KIM_0761_AHC2GMBCX3_laneBarcode.html'
            },
            {
                'date':'2019-12-20 01:42',
                'path':'static/html/FASTQ/DIANA_0153_AHYG33DSXX_laneBarcode.html',
                'runName':'DIANA_0153_AHYG33DSXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=DIANA_0153_AHYG33DSXX_laneBarcode.html'
            },
            {
                'date':'2019-12-19 19:17',
                'path':'static/html/FASTQ/PITT_0439_BHFTCNBBXY_laneBarcode.html',
                'runName':'PITT_0439_BHFTCNBBXY_laneBarcode.html',
                'runStats':'getInterOpsData?runId=PITT_0439_BHFTCNBBXY_laneBarcode.html'
            },
            {
                'date':'2019-12-19 06:28',
                'path':'static/html/FASTQ/SCOTT_0166_AHKNNFBGXC_laneBarcode.html',
                'runName':'SCOTT_0166_AHKNNFBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0166_AHKNNFBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-18 00:28',
                'path':'static/html/FASTQ/SCOTT_0165_AHKLMWBGXC_laneBarcode.html',
                'runName':'SCOTT_0165_AHKLMWBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0165_AHKLMWBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-17 04:09',
                'path':'static/html/FASTQ/DIANA_0152_AHYF3JDSXX_laneBarcode.html',
                'runName':'DIANA_0152_AHYF3JDSXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=DIANA_0152_AHYF3JDSXX_laneBarcode.html'
            }
        ];
        const responseObject = {
            recentRuns
        };
        return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
    }
];

exports.getCrosscheckMetrics = [
    function(req, res) {
        const projects = req.query.projects;
        if (!projects || projects.length === 0) {
            return apiResponse.errorResponse(res, 'No projects available to get cross metrics');
        }
        let crosscheckMetricsPromise = apiServices.getCrossCheckMetrics(projects);
        Promise.all([crosscheckMetricsPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, `Could not find crosscheck metrics.`);
                }
                let [crosscheckMetricsResult] = results;
                const metricsData = crosscheckMetricsResult ? crosscheckMetricsResult.data : {};
                if (!metricsData || metricsData === {}) {
                    return apiResponse.errorResponse(res, `No data from crosscheck metrics.`);
                }

                let responseObject = {
                    metricsData
                };
                
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);                
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];
