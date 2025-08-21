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

                // recent deliveries = reviewed requests
                if (recentDeliveriesResult && recentDeliveriesResult.length) {
                    recentDeliveriesResult.forEach((project)=> {
                        reviewedRequestIdList.push(project.requestId);
    
                        const projectObj = utils.addProjectProperties(project);
                        if (projectObj.needsReview) {
                            projectsToReview.push(projectObj);
                        } else {
                            projectsToSequenceFurther.push(projectObj);
                        }
                    });
                }
                
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


// Optimized search functions for HomePageController.js
// Replace your existing search functions with these optimized versions

/**
 * Search projects by PI name (Optimized)
 * Returns projects matching the PI name search
 */
exports.searchProjectsByPI = [
    function (req, res) {
        const piName = req.query.piName;
        
        if (!piName || piName.trim().length === 0) {
            return apiResponse.errorResponse(res, 'PI name is required for search');
        }

        // Pre-compile regex for better performance
        const piSearchRegex = new RegExp(piName.toLowerCase(), 'i');

        // Search in the same data sources as the original implementation
        let recentDeliveriesPromise = apiServices.getRequestProjects();
        let seqAnalysisPromise = apiServices.getRecentDeliveries();
        
        Promise.all([recentDeliveriesPromise, seqAnalysisPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, 'Could not search projects');
                }
                
                let [recentDeliveriesResult, seqAnalysisResult] = results;
                
                // Combine all projects
                const allProjects = [
                    ...(recentDeliveriesResult || []),
                    ...(seqAnalysisResult || [])
                ];
                
                // Use Map for faster deduplication
                const projectMap = new Map();
                allProjects.forEach(project => {
                    if (project.requestId && !projectMap.has(project.requestId)) {
                        projectMap.set(project.requestId, project);
                    }
                });
                
                // Filter projects by PI name (optimized with regex)
                const matchingProjects = Array.from(projectMap.values()).filter(project => {
                    return project.pi && piSearchRegex.test(project.pi);
                });
                
                // Add project properties for display (only for matching projects)
                const enrichedProjects = matchingProjects.map(project => {
                    return utils.addProjectProperties(project);
                });
                
                // Sort by most recent date
                enrichedProjects.sort((a, b) => (b.recentDate || 0) - (a.recentDate || 0));
                
                const responseObject = {
                    projects: enrichedProjects,
                    searchQuery: piName,
                    totalFound: enrichedProjects.length
                };

                return apiResponse.successResponseWithData(res, 'Search completed successfully', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not search projects: ${reasons}`);
            });
    }
];

/**
 * Search projects by Recipe (Optimized)
 * Returns projects matching the Recipe search
 */
exports.searchProjectsByRecipe = [
    function (req, res) {
        const recipe = req.query.recipe;
        
        if (!recipe || recipe.trim().length === 0) {
            return apiResponse.errorResponse(res, 'Recipe is required for search');
        }

        // Pre-compile search terms for better performance
        const searchRecipe = recipe.toLowerCase();
        const normalizedSearch = searchRecipe.replace(/[_-]/g, '');

        // Search in the available data sources (same as PI search)
        let recentDeliveriesPromise = apiServices.getRequestProjects();
        let seqAnalysisPromise = apiServices.getRecentDeliveries();
        
        Promise.all([recentDeliveriesPromise, seqAnalysisPromise])
            .then((results) => {
                if (!results) {
                    return apiResponse.errorResponse(res, 'Could not search projects');
                }
                
                let [recentDeliveriesResult, seqAnalysisResult] = results;
                
                // Combine all projects from available sources
                const allProjects = [
                    ...(recentDeliveriesResult || []),
                    ...(seqAnalysisResult || [])
                ];
                
                // Use Map for faster deduplication
                const projectMap = new Map();
                allProjects.forEach(project => {
                    if (project.requestId && !projectMap.has(project.requestId)) {
                        projectMap.set(project.requestId, project);
                    }
                });
                
                // Optimized recipe matching function
                const matchesRecipe = (sampleRecipe) => {
                    const lowerRecipe = sampleRecipe.toLowerCase();
                    
                    // Quick exact match first
                    if (lowerRecipe === searchRecipe) return true;
                    
                    // Quick contains match
                    if (lowerRecipe.includes(searchRecipe) || searchRecipe.includes(lowerRecipe)) {
                        return true;
                    }
                    
                    // Normalized matching (more expensive, so last)
                    const normalizedSample = lowerRecipe.replace(/[_-]/g, '');
                    return normalizedSample.includes(normalizedSearch) || 
                           normalizedSearch.includes(normalizedSample);
                };
                
                // Filter projects by Recipe (optimized)
                const matchingProjects = Array.from(projectMap.values()).filter(project => {
                    // Check samples array
                    if (project.samples && project.samples.length > 0) {
                        return project.samples.some(sample => 
                            sample.recipe && matchesRecipe(sample.recipe)
                        );
                    }
                    
                    // Check direct recipe property
                    if (project.recipe) {
                        return matchesRecipe(project.recipe);
                    }
                    
                    return false;
                });
                
                // Add project properties for display (only for matching projects)
                const enrichedProjects = matchingProjects.map(project => {
                    return utils.addProjectProperties(project);
                });
                
                // Sort by most recent date
                enrichedProjects.sort((a, b) => (b.recentDate || 0) - (a.recentDate || 0));
                
                const responseObject = {
                    projects: enrichedProjects,
                    searchQuery: recipe,
                    totalFound: enrichedProjects.length
                };

                return apiResponse.successResponseWithData(res, 'Recipe search completed successfully', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not search projects by recipe: ${reasons}`);
            });
    }
];