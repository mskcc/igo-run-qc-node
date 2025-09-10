const jwtInCookie = require('jwt-in-cookie');
const winston = require('./winston');

const apiResponse = require('./apiResponse');
exports.authenticate = function (req, res, next) {
    try {
        let user = jwtInCookie.validateJwtToken(req);
        
        // Log the user object for debugging
        winston.logger.info('Authentication attempt for user:', {
            username: user.username,
            isLabMember: user.isLabMember,
            isUser: user.isUser,
            isAdmin: user.isAdmin,
            isPM: user.isPM,
            title: user.title
        });
        
        // Only allow users with isLabMember to access the app
        if (!user.isLabMember) {
            winston.logger.warn('Access denied for user - not a lab member:', {
                username: user.username,
                isLabMember: user.isLabMember,
                title: user.title
            });
            return apiResponse.unauthorizedResponse(res, 'Access denied: Lab member access required');
        }
        
        user.role = determineRole(user);
        res.user = user;
        
        winston.logger.info('Authentication successful for user:', {
            username: user.username,
            role: user.role
        });
    } catch (err) {
        winston.logger.error('Authentication failed - invalid session:', err.message);
        return apiResponse.unauthorizedResponse(res, 'Invalid session');
    }
    next();
};

const determineRole = (user) => {
    if (user.isLabMember) {
        return 'lab_member';
    } 
};