const Router = require('express');
const router = new Router();
const organizationRouter = require('./organizationRouter');
const departmentRouter = require('./departmentRouter');


router.use('/organization', organizationRouter);
router.use('/department', departmentRouter);

module.exports = router;