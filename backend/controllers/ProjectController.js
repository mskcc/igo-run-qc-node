const axios = require('axios'); 
const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { enrichSampleInfo, enrichProjectQC } = require('../util/helpers');


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
                const enrichedProjectQc = enrichProjectQC(projectQc);
                const completeProjectQc = {
                    ...enrichedProjectQc,
                    samples: enrichedSamples
                };

                const responseObject = {
                    projectQc: completeProjectQc
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

exports.changeRunStatus = [
    async function(req, res) {
        const sample = req.query.recordId;
        const projectId = req.query.project;
        const newStatus = req.query.status;
        const recipe = req.query.recipe;
	console.log("inside changeRunStatus| sample = ", sample);
	console.log("inside changeRunStatus| projectId = ", projectId);
	console.log("inside changeRunStatus| recipe = ", recipe);
	//setRecipeTypes(recipes);
        //const qcType = req.query.qcType;

        // Logic to decide qcType based on the recipe
        if (recipe && typeof recipe === 'string') {
            if (recipe.toLowerCase().includes('nanopore')) {
                qcType = 'Ont';
            } else {
                qcType = 'Seq';
            }
        } else {
            qcType = qcType || 'Seq';
        }
        console.log("qcType = ", qcType);
        // Call the API service to update the QC status with the fetched recipe
        let updateRunStatusPromise = apiServices.setQCStatus(sample, newStatus, projectId, recipe, qcType);

        Promise.all([updateRunStatusPromise])
            .then((results) => {
                if(!results) {
                    return apiResponse.errorResponse(res, 'Could not update status.');
                }

                let [statusResults] = results;
                
                const responseObject = {
                    statusResults
                };
                return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
            })
            .catch((reasons) => {
                let string = JSON.stringify(reasons);
                return apiResponse.errorResponse(res, `Error trying to update status: ${string}`);
        });
    }
];
