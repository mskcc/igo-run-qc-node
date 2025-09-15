const apiResponse = require('../util/apiResponse');
const apiServices = require('../services/services');
const { loggers } = require('winston');
const logger = loggers.get('logger');

exports.searchQc = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const searchField = req.query.searchField;
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        // Validate required parameters
        if (!searchTerm || searchTerm.trim().length === 0) {
            return apiResponse.errorResponse(res, 'Search term is required');
        }

        if (!searchField || searchField.trim().length === 0) {
            return apiResponse.errorResponse(res, 'SearchField is required');
        }

        // Validate searchField value
        const validSearchFields = ['Request Id','PI Name', 'Recipe', 'Type', 'Recent Run'];
        if (!validSearchFields.includes(searchField.trim())) {
            return apiResponse.errorResponse(res, `Invalid searchField. Supported values: ${validSearchFields.join(', ')}`);
        }

        const validatedLimit = Math.min(Math.max(limit, 1), 800);
        const validatedOffset = Math.max(offset, 0);

        logger.info(`Search request: field="${searchField}", term="${searchTerm}", limit=${validatedLimit}, offset=${validatedOffset}`);

        const searchResults = await apiServices.searchQc(
            searchTerm.trim(), 
            searchField.trim(), 
            validatedLimit, 
            validatedOffset
        );

        logger.info(`Search completed: ${searchResults.results ? searchResults.results.length : 0} results returned, ${searchResults.total || 0} total found`);

       
        const responseObject = {
            results: searchResults.results || [],
            total: searchResults.total || 0,
            limit: validatedLimit,
            offset: validatedOffset,
            searchTerm: searchTerm.trim(),
            searchField: searchField.trim(),
            hasMore: searchResults.hasMore || false
        };

        return apiResponse.successResponseWithData(res, 'Search completed successfully', responseObject);

    } catch (error) {
        logger.error(`Search failed: ${error.message}`);
        
        // Handle specific validation errors
        if (error.message.includes('Invalid searchField')) {
            return apiResponse.errorResponse(res, error.message);
        }
        
        return apiResponse.errorResponse(res, `Could not retrieve search data from LIMS: ${error.message}`);
    }
};