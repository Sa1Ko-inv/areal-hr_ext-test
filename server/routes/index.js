const Router = require('express');
const router = new Router();
const organizationRouter = require('./organizationRouter');


router.use('/organization', organizationRouter);

module.exports = router;