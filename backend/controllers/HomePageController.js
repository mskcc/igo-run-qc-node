const apiResponse = require('../util/apiResponse');
const { body, param, query, validationResult } = require('express-validator');
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
                    return apiResponse.errorResponse(res, `Could not find recent deliveries.`);
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
