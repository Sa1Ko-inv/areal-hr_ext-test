const Router = require('express');
const router = new Router();
const organizationRouter = require('./organizationRouter');
const departmentRouter = require('./departmentRouter');
const positionRouter = require('./positionRouter');

router.use('/organization', organizationRouter);
router.use('/department', departmentRouter);
router.use('/position', positionRouter );

module.exports = router;