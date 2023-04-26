function rollVerify(req, res, next) {
    if (req.session?.admin) {
        return next()
    }
    return res.status(401).send('Usted no es admin')
}