const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const utils = require('../util/helpers');
const { loggers } = require('winston');
const logger = loggers.get('logger');

/**
 * Returns the recent projects from the Seq Analysis LIMS table
    {
        'projectsToReview': [],
        'projectsToSequenceFurther': [],
        'requestsPending':  []
    }
 */
// Helper function to check if a project is Nanopore
const isNanoporeProject = (project) => {
    if (project.requestType === 'Nanopore') return true;
    if (project.recipe && project.recipe.toLowerCase().includes('nanopore')) return true;
    if (!project.samples || project.samples.length === 0) return false;
    return project.samples.some(sample =>
        sample.recipe && sample.recipe.toLowerCase().includes('nanopore')
    );
};

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
                let projectsToReview = [];
                let projectsToSequenceFurther = [];
                let requestsPending = [];

                // Identify Nanopore projects and fetch their samplesONT data
                const nanoporeProjects = recentDeliveriesResult ? recentDeliveriesResult.filter(isNanoporeProject) : [];
                const nanoporeProjectIds = nanoporeProjects.map(p => p.requestId);
                
                // Fetch samplesONT for each Nanopore project, then process all projects
                const ontDataPromises = nanoporeProjectIds.map(projectId =>
                    apiServices.getProjectQc(projectId).catch(err => {
                        logger.error(`Error fetching ONT data for project ${projectId}: ${err}`);
                        return null;
                    })
                );
                
                return Promise.all(ontDataPromises).then((ontDataResults) => {
                    // Build map of projectId -> samplesONT
                    const ontDataMap = {};
                    ontDataResults.forEach((result, index) => {
                        const projectId = nanoporeProjectIds[index];
                        const projectData = result && result[0] ? result[0] : null;
                        if (projectData && projectData.samplesONT && projectData.samplesONT.length > 0) {
                            ontDataMap[projectId] = projectData.samplesONT;
                        }
                    });

                    // recent deliveries = reviewed requests
                    if (recentDeliveriesResult && recentDeliveriesResult.length) {
                        recentDeliveriesResult.forEach((project) => {
                            reviewedRequestIdList.push(project.requestId);
                            
                            // Merge samplesONT data if available for this Nanopore project
                            if (ontDataMap[project.requestId]) {
                                project.samplesONT = ontDataMap[project.requestId];
                            }
        
                            const projectObj = utils.addProjectProperties(project);
                            if (projectObj.needsReview) {
                                projectsToReview.push(projectObj);
                            } else {
                                projectsToSequenceFurther.push(projectObj);
                            }
                        });
                    }
                    
                    // sequencing requests = incomplete requests
                    if (!seqRequestsResults || !seqRequestsResults.requests) {
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
                });
            })
            .catch((reasons) => {
                logger.error(`Could not retrieve data from LIMS: ${reasons}`);
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
        let recentRunsDataPromise = apiServices.getRecentRunsData(days);
        Promise.all([recentRunsDataPromise])
            .then((results) => {
                let [recentRunResult] = results;

                const responseObject = {
                    recentRuns: recentRunResult
                };
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve recent run data: ${reasons}`);
            });
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
                return apiResponse.errorResponse(res, `Could not retrieve data from NGS: ${reasons}`);
            });
    }
];

exports.getInterOpsData = [
    function(req, res) {
        const runId = req.query.runId;
        if (!runId || runId.length === 0) {
            return apiResponse.errorResponse(res, 'Missing runId for interops data');
        }
        // remove '_laneBarcode.html' to just use runName
        const runName = runId.slice(0, -18);
        let interOpsDataPromise = apiServices.getInterOpsData(runName);
        Promise.all([interOpsDataPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, `Could not get interops data.`);
                }
                let [interOpsDataResult] = results;
                const interOpsData = interOpsDataResult ? interOpsDataResult : {};
                if (interOpsData.length === 0) {
                    return apiResponse.errorResponse(res, `No interops data received.`);
                }

                let responseObject = {
                    interOpsData
                };

                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];

exports.ngsStatsDownload = [
    function(req, res) {
        const type = req.query.type;
        const sample = req.query.sample;
        const projectId = req.query.project;
        const run = req.query.run;

        let ngsStatsDownloadPromise = apiServices.ngsStatsDownload(type, sample, projectId, run);
        Promise.all([ngsStatsDownloadPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, `Could not get NGS stats download data.`);
                }
                let [ngsStatsDownloadResult] = results;
                const ngsDownloadData = ngsStatsDownloadResult || {};
                
                let responseObject = {
                    ngsDownloadData
                };

                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);

            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from NGS: ${reasons}`);
            });
    }
];

