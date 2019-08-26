const { decodeToken } = require('../lib/token');

const isLoggedIn = (req, res, next) => {
    if (!req.token) {
        const error = new Error ('You are not logged in');
        error.status = 401;
        return next(error)
    }

    try {
        decodeToken(req.token);
        next();
    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem with your credentials');
        error.status = 401;
        next(error);
    }
};

module.exports = { isLoggedIn };