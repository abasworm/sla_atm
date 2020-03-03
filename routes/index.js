var route = require('express').Router();

route.use('/dashboard', require('../modules/dashboard'));
route.use('/api/dashboard', require('../modules/dashboard/api'));

//USER MODULE
route.use('/users', require('../modules/users'));
route.use('/api/users', require('../modules/users/api'));

// route.use('/dm_view', require('../modules/dm_view'));
// route.use('/api/dm_view',require('../modules/dm_view/api'));

// route.use('/dm_atm', require('../modules/dm_atm'));
// route.use('/api/dm_atm',require('../modules/dm_atm/api'));

// route.use('/export', require('../modules/export'));

route.use('/import', require('../modules/import'));
route.use('/api/import',require('../modules/import/api'));

route.use('/test', require('../modules/test'));

module.exports = route;
