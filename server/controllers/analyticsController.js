import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';

const getCandidatesStatistic = async (req, res) => {
  const { user_id } = req.user;
  const query = `SELECT date_part('year', created_at) as year, date_part('month', created_at)-1 AS month, count(*)
  FROM candidates
  WHERE candidate_status='HIRED' and user_id=$1
  GROUP BY year, month ORDER by year, month;`;
  try {
    const { rows } = await dbQuery.query(query, [user_id]);
    const dbResponse = rows;
    const years = [];
    const monthValues = {};
    let currentYear = 0;
    if (dbResponse.length) {
      dbResponse.forEach((element) => {
        if (!years.includes(element.year)) {
          currentYear = element.year;
          monthValues[currentYear] = [
            {
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              label: 'Candidates',
              fill: 'start',
            },
          ];
          years.push(currentYear);
        }
        monthValues[currentYear][0].data[element.month] = +element.count;
      });
    }
    successMessage.data = { years: years, datasets: monthValues };
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get candidates data';
    return res.status(status.error).send(errorMessage);
  }
};

const getCountOfInterviews = async (req, res) => {
  const { user_id } = req.user;
  const { month } = req.query;
  const query = `select count(*) from interviews where date_part('month', created_at)=$1 and user_id=$2;`;
  try {
    const { rows } = await dbQuery.query(query, [month, user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get interviews data';
    return res.status(status.error).send(errorMessage);
  }
};

const getCountOfCanceledInterviews = async (req, res) => {
  const { user_id } = req.user;
  const { month } = req.query;
  const query = `select count(*) from interviews where 'deleted'=ANY(status)
  and date_part('month', created_at)=$1 and user_id=$2;`;
  try {
    const { rows } = await dbQuery.query(query, [month, user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get interviews data';
    return res.status(status.error).send(errorMessage);
  }
};

const getCountOfHiredCandidates = async (req, res) => {
  const { user_id } = req.user;
  const { month } = req.query;
  const query = `select count(*) from candidates where candidate_status = 'HIRED'
    and date_part('month', created_at)=$1 and user_id=$2;`;
  try {
    const { rows } = await dbQuery.query(query, [month, user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get candidates data';
    return res.status(status.error).send(errorMessage);
  }
};

const getCandidatesByStatus = async (req, res) => {
  const { user_id } = req.user;
  const query = `select candidate_status, count(*) from candidates where user_id=$1 group by candidate_status;`;
  try {
    const { rows } = await dbQuery.query(query, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get candidates data';
    return res.status(status.error).send(errorMessage);
  }
};

const getJobs = async (req, res) => {
  const { user_id } = req.user;
  const { month } = req.query;
  const query = `select title, required_resources, hired_resources from jobs date_part('month', created_at)=$1 and user_id=$2;;`;
  try {
    const { rows } = await dbQuery.query(query, [month, user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get jobs data';
    return res.status(status.error).send(errorMessage);
  }
};

const getJobsByStatus = async (req, res) => {
  const { user_id } = req.user;
  const query = `select status, count(*) from jobs where user_id=$1 group by status;`;
  try {
    const { rows } = await dbQuery.query(query, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get jobs data';
    return res.status(status.error).send(errorMessage);
  }
};

const getInterviewsPeriods = async (req, res) => {
  const { user_id } = req.user;
  const query = `select concat(start_time, '-', end_time) as event_period, count(*) from interviews
  where user_id=$1
  and start_time is not null
  and end_time is not null
  group by event_period
  order by event_period
  limit 5;`;
  try {
    const { rows } = await dbQuery.query(query, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to get interviews data';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  getCandidatesStatistic,
  getCountOfInterviews,
  getCountOfCanceledInterviews,
  getCountOfHiredCandidates,
  getCandidatesByStatus,
  getJobs,
  getJobsByStatus,
  getInterviewsPeriods,
};
