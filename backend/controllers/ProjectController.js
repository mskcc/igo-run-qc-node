const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');

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
        // TODO - do we need to do this every look up? Or just once on project page load :)
        let getStatusLabel = apiServices.getStatusPickListValues();
        Promise.all([projectQcPromise])
            .then((results) => {
                if(!results) {
                    return apiResponse.errorResponse(res, 'Could not find project QC data.');
                }

                let [projectQcResults] = results;
                const projectQc = projectQcResults[0];

                if (!projectQc || projectQc.length === 0 || projectQc.samples === []) {
                    return apiResponse.errorResponse(res, `No project data for project ${projectId}`);
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

exports.qcStatusLabels = [
    function(req, res) {
        let qcStatusLabelsPromise = apiServices.getStatusPickListValues();
        Promise.all([qcStatusLabelsPromise])
            .then((results) => {
                if(!results) {
                    return apiResponse.errorResponse(res, 'Could not find picklist data.');
                }

                let [qcStatusLabelsResults] = results;
                const responseObject = {
                    qcStatusLabelsResults
                }
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                return apiResponse.errorResponse(res, `Could not retrieve data from LIMS: ${reasons}`);
            });
    }
];
