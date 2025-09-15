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
        
        // Check if user is BOTH a lab member AND in the MohibullahLab group (using database data)
        const isInLabGroup = fullUser.groups.includes('CN=GRP_SKI_MohibullahLab');
        const hasLabAccess = fullUser.isLabMember && isInLabGroup;
        
        // Only allow users with BOTH lab member status AND lab group membership
        if (!hasLabAccess) {
            winston.logger.warn(`Access denied for user ${user.username} - missing lab requirements`);
            return apiResponse.unauthorizedResponse(res, 'Access denied: Lab member and group membership required');
        }
        
        user.role = determineRole(fullUser); // Pass database user data
        res.user = user;
        
        winston.logger.info(`Authentication successful for user: ${user.username}`);
    } catch (err) {
        winston.logger.error(`Authentication failed - invalid session: ${err.message}`);
        return apiResponse.unauthorizedResponse(res, 'Invalid session');
    }
    next();
};

const determineRole = (user) => {
    if (!user.groups) {
        throw new Error('User groups data missing');
    }
    
    const isInLabGroup = user.groups.includes('CN=GRP_SKI_MohibullahLab');
    
    if (user.isLabMember && isInLabGroup) {
        return 'lab_member';
    }
    
    throw new Error('User does not meet lab member requirements');
};