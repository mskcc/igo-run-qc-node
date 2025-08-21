const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { loggers } = require('winston');
const logger = loggers.get('logger');

exports.searchQc = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        if (!searchTerm || searchTerm.trim().length === 0) {
            return apiResponse.errorResponse(res, 'Search term is required');
        }

        const validatedLimit = Math.min(Math.max(limit, 1), 800);
        const validatedOffset = Math.max(offset, 0);

        logger.info(`Search request: term="${searchTerm}", limit=${validatedLimit}, offset=${validatedOffset}`);

        const searchResults = await apiServices.searchQc(searchTerm.trim(), validatedLimit, validatedOffset);

        logger.info(`Search completed: ${searchResults.results ? searchResults.results.length : 0} results found`);

        const responseObject = {
            searchResults
        };

        return apiResponse.successResponseWithData(res, 'Search completed successfully', responseObject);
            
    } catch (error) {
        logger.error(`Search failed: ${error.message}`);
        return apiResponse.errorResponse(res, `Could not retrieve search data from LIMS: ${error.message}`);
    }
};