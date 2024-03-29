import express from 'express';
import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';

//Routes
import usersRoute from './routes/usersRoute';
import seedRoute from './routes/seedRoute';
import candidatesRoute from './routes/candidatesRoute';
import interviewsRoute from './routes/interviewsRoute';
import jobsRoute from './routes/jobsRoute';
import tagsRoute from './routes/tagsRoute';
import eventsRoute from './routes/eventsRoute';
import subscriptionsRoute from './routes/subscriptionsRoute';
import uploadsRoute from './routes/uploadsRoute';
import emailsRoute from './routes/emailsRoute';
import analyticsRoute from './routes/analyticsRoute';

import { watch } from './controllers/uploadsController';

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT, DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization '
  );
  next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', seedRoute);
app.use('/api/users', usersRoute);
app.use('/api/candidates', candidatesRoute);
app.use('/api/interviews', interviewsRoute);
app.use('/api/jobs', jobsRoute);
app.use('/api/tags', tagsRoute);
app.use('/api/events', eventsRoute);
app.use('/api/subscriptions', subscriptionsRoute);
app.use('/api/uploads', uploadsRoute);
app.use('/api/emails', emailsRoute);
app.use('/api/analytics', analyticsRoute);

app.use((err, req, res, next) => {
  console.warn(err);
  res.status(500).send('some error...');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

watch();
