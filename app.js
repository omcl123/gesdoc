const winston = require('./config/winston');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const testsRouter = require('./routes/tests');
const docenteRouter = require('./routes/perfilDocente');
const cargaRouter = require('./routes/cargaDatos');
const generalRouter = require('./routes/general');
const convocatoriaRouter=require('./routes/convocatoria');
const asignacionRouter = require('./routes/manejoHorariosRoutes');
const authController = require('./auth/AuthController');
const ayudasEconomicasRouter = require('./routes/ayudasEconomicas');
const dashboardRouter = require('./routes/visionGeneralRoutes');
const app = express();

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, x-access-token,Nombre-Archivo');
    res.header('Access-Control-Expose-Headers', 'Authorization, File-Name');
    next();
};

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);

app.use('/', indexRouter);
app.use('/tests', testsRouter);
app.use('/docente',docenteRouter);
app.use('/convocatoria',convocatoriaRouter);
app.use('/asignacionHorarios',asignacionRouter);
app.use('/ayudasEconomicas',ayudasEconomicasRouter);
app.use('/carga',cargaRouter);
app.use('/general',generalRouter);
app.use('/auth',authController);
app.use('/dashboard',dashboardRouter);
app.use('*',(req,res,next)=>{
    res.end('The link you followed may be broken, or the page may have been removed.');
    next();
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.end('error');
});



module.exports = app;
