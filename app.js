var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Joi = require('joi');
const sequelize = require('sequelize');
const dotenv = require('dotenv');
const cors =require('cors')

const authRouter = require('./routes/auth');
const patientRouter = require('./routes/patient');
const doctorRouter = require('./routes/doctor');
const staffRouter = require('./routes/staff')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
dotenv.config({path:'./env'})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
//routers
app.use('/auth',authRouter);
app.use('/patient',patientRouter);
app.use('/doctor',doctorRouter);
app.use('/staff',staffRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req)
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
