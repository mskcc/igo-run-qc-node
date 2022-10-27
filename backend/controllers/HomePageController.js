const { body, param, query, validationResult } = require('express-validator');
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
        const responseObject = {
            recentRuns
        };
        return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
    }
];
