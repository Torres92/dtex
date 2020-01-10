const express = require('express');
const api_v1 = express.Router();


const authRoutes = require('./auth')
const adminRoutes = require('./admin')
const companyRoutes = require('./company')
const driverRoutes = require('./driver')


api_v1.use('/auth', authRoutes);
api_v1.use('/admin', adminRoutes);
api_v1.use('/driver', driverRoutes);
api_v1.use('/company', companyRoutes);


module.exports = api_v1