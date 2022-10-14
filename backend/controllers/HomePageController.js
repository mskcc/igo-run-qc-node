const apiResponse = require('../util/apiResponse');
const { body, param, query, validationResult } = require('express-validator');
const { logger } = require('../util/winston');
const apiServices = require('../services/services');

exports.getSeqAnalysisProjects = [
    function (req, res) {
        let recentDeliveriesPromise = apiServices.getRecentDeliveries();
        Promise.all([recentDeliveriesPromise]).then((results => {
            // TODO SAVE IN REDUX
            if (!results || results.some((x) => x.length === 0)) {
                return apiResponse.errorResponse(res, `Could not find recent deliveries.`);
            }
            let responseObject = {
                results,
            };

            return apiResponse.successResponseWithData(res, 'Operation success', responseObject);
        
        })).catch((error) => {
            return apiResponse.errorResponse(error, 'Could not retrieve data from LIMS');
        });
    }
];
