export default (req, res, next) => {
    console.log('Request Method:', req.method);
    next();
}