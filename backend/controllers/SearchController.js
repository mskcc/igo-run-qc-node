const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { loggers } = require('winston');
const logger = loggers.get('logger');

exports.searchQc = async (req, res) => {
    try {
        // Input validation
        const searchTerm = req.query.search;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        if (!searchTerm || searchTerm.trim().length === 0) {
            return apiResponse.errorResponse(res, 'Search term is required');
        }

        // Validate limits
        const validatedLimit = Math.min(Math.max(limit, 1), 500);
        const validatedOffset = Math.max(offset, 0);

        console.log(`Search request: term="${searchTerm}", limit=${validatedLimit}, offset=${validatedOffset}`);
        logger.info(`Search request: term="${searchTerm}", limit=${validatedLimit}, offset=${validatedOffset}`);

        const searchResults = await apiServices.searchQc(searchTerm.trim(), validatedLimit, validatedOffset);

        console.log(`Search completed: ${searchResults.results ? searchResults.results.length : 0} results found`);
        logger.info(`Search completed: ${searchResults.results ? searchResults.results.length : 0} results found`);

        const responseObject = {
            searchResults
        };

        return apiResponse.successResponseWithData(res, 'Search completed successfully', responseObject);
        
    } catch (error) {
        console.error(`Search failed: ${error.message}`);
        logger.error(`Search failed: ${error.message}`);
        return apiResponse.errorResponse(res, `Could not retrieve search data from LIMS: ${error.message}`);
    }
};