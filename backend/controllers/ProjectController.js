const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { loggers } = require('winston');

const logger = loggers.get('logger');

/**
 * returns 
 * {
 *  projectQc: {}
 * }
 */
exports.projectQc = [
    function(req, res) {
        const projectId = req.params.projectId
        let projectQcPromise = apiServices.getProjectQc(projectId);
        Promise.all([projectQcPromise])
            .then((results) => {
                if(!results) {
                    return apiResponse.errorResponse(res, 'Could not find project QC data.');
                }

                let [projectQcResults] = results;
                const projectQc = projectQcResults[0];

                if (projectQc.length === 0) {
                    return apiResponse.errorResponse(res, 'No project QC data.');
                }

                const responseObject = {
                    projectQc
                };
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];
