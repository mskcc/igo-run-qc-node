const jwtInCookie = require('jwt-in-cookie');
const winston = require('./winston');
const apiResponse = require('./apiResponse');
const UserModel = require('../models/UserModel');

exports.authenticate = async function (req, res, next) {
    try {
        let user = jwtInCookie.validateJwtToken(req);
        
        const fullUser = await UserModel.findOne({ username: user.username });
        
        if (!fullUser) {
            winston.logger.error(`User ${user.username} not found in database`);
            return apiResponse.unauthorizedResponse(res, 'User not found - please log in again');
        }
        
        // Check if groups field is missing from database
        if (!fullUser.groups) {
            winston.logger.error(`User ${user.username} has missing groups data in database`);
            return apiResponse.unauthorizedResponse(res, 'Session error: Missing group data - please log in again');
        }
        
        // Debug what we actually get from database
        winston.logger.info(`DEBUG: User data - isLabMember: ${fullUser.isLabMember}, groups exist: ${!!fullUser.groups}`);
        
        // Check if user is BOTH a lab member AND in the MohibullahLab group (using database data)
        const isInLabGroup = fullUser.groups.includes('CN=GRP_SKI_MohibullahLab');
        const hasLabAccess = fullUser.isLabMember && isInLabGroup;
        
        // Only allow users with BOTH lab member status AND lab group membership
        if (!hasLabAccess) {
            winston.logger.warn(`Access denied for user ${user.username} - isLabMember: ${fullUser.isLabMember}, inLabGroup: ${isInLabGroup}`);
            return apiResponse.unauthorizedResponse(res, 'Access denied: Lab member and group membership required');
        }
        
        user.role = 'lab_member';
        res.user = user;
        
        winston.logger.info(`Authentication successful for user: ${user.username}`);
    } catch (err) {
        winston.logger.error(`Authentication failed - invalid session: ${err.message}`);
        return apiResponse.unauthorizedResponse(res, 'Invalid session');
    }
    next();
};