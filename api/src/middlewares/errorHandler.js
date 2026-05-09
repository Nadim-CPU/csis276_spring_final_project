const APIError = require('./APIError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (e, req, res, next) => {
    if (e instanceof APIError) {
        return res.status(e.statusCode).json({
            code: e.code,
            message: e.message,
            details: e.details,
        });
    }

    console.error(e);
    return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: {},
    });
};

module.exports = errorHandler;
