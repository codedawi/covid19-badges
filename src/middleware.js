const createError = require('http-errors');

const httpErrorMiddleware = (err, _req, res, _next) => {
    // if err message is safe to expose to client or we are in development mode
    if (err.expose === true || process.env.NODE_ENV === 'development') {
        res.status(err.status || 500).send(err);
    } else {
        res.status(500).send(createError.InternalServerError());
    }
};

const svgMiddleware = (_req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=120, s-maxage=300, stale-while-revalidate=86400`)
    res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8')
    next()
};

module.exports = { httpErrorMiddleware, svgMiddleware };