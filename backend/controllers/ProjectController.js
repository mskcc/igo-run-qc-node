const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { enrichSampleInfo } = require('../util/helpers');

/**
 * returns 
 * {
 *  projectQc: {}
 * }
 */
exports.projectQc = [
    function(req, res) {
        const projectId = req.params.projectId;
        let projectQcPromise = apiServices.getProjectQc(projectId);
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

                const enrichedSamples = enrichSampleInfo(projectQc.samples);
                const enrichedProjectQc = {
                    ...projectQc,
                    samples: enrichedSamples
                };

                const responseObject = {
                    projectQc: enrichedProjectQc
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

exports.getCellRangerSample = [
    function(req, res) {
        const projectId = req.query.projectId;
        const ngsType = req.query.type;
        let cellRangerSamplePromise = apiServices.getCellRangerSample(projectId, ngsType);
        Promise.all([cellRangerSamplePromise])
            .then((results) => {
                if(!results) {
                    return apiResponse.errorResponse(res, `Could not find Cell Ranger data for project ${projectId}.`);
                }

                let [cellRangerSampleResults] = results;
                const responseObject = {
                    cellRangerSampleResults
                }
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
    }
];
