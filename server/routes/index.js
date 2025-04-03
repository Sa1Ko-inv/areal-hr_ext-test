const Router = require('express');
const router = new Router();
const organizationRouter = require('./organizationRouter');
const departmentRouter = require('./departmentRouter');
const positionRouter = require('./positionRouter');
const employeeRouter = require('./employeeRouter');
const hr_operationRouter = require('./hr_operationRouter');


router.use('/organization', organizationRouter);
router.use('/department', departmentRouter);
router.use('/position', positionRouter );
router.use('/employee', employeeRouter);
router.use('/hr_operation', hr_operationRouter);

module.exports = router;