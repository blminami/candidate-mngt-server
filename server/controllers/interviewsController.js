import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import { removeLastWord } from '../helpers/utils';

const addInterview = async (req, res) => {
  const {
    user_id,
    candidate_id,
    title,
    notes,
    interview_status,
    tags,
    start_date,
    due_date,
    job_id,
  } = req.body;

  let statusData = '{}';
  let tagsData = '{}';
  if (interview_status) {
    statusData = '{' + interview_status.toLowerCase() + '}';
  }
  if (tags) {
    tagsData = '{' + tags.toLowerCase() + '}';
  }

  const insertInterviewQuery = `INSERT INTO
      interviews(id, user_id, candidate_id, title, notes, status, tags, start_date, due_date, job_id)
      VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning *`;
  const values = [
    user_id,
    candidate_id,
    title,
    notes,
    statusData,
    tagsData,
    start_date,
    due_date,
    job_id,
  ];
  try {
    const { rows } = await dbQuery.query(insertInterviewQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to add interview';
    return res.status(status.error).send(errorMessage);
  }
};

const getAll = async (req, res) => {
  const {
    user_id,
    limit,
    offset,
    title,
    interview_status,
    tags,
    by_date,
  } = req.query;

  let getAllQuery = `SELECT * FROM interviews WHERE user_id = $1 AND`;
  if (title) {
    getAllQuery += " title LIKE '%" + title + "%' AND";
  }
  if (interview_status) {
    let newStatus = interview_status
      .split(',')
      .map((el) => {
        return "'" + el.toLowerCase() + "'";
      })
      .join(',');
    getAllQuery += ' status @> ARRAY[' + newStatus + '::text] AND';
  }
  if (tags) {
    let newTags = tags
      .split(',')
      .map((el) => {
        return "'" + el.toLowerCase() + "'";
      })
      .join(',');
    getAllQuery += ' tags @> ARRAY[' + newTags + '::text] AND';
  }
  if (by_date) {
    getAllQuery += ' DATE(start_date) = CURRENT_DATE AND';
  }
  getAllQuery = removeLastWord(getAllQuery) + ' LIMIT $2 OFFSET $3;';

  console.log('getALlQuery: ', getAllQuery);
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id, limit, offset]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'No interviews found!';
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const updateInterview = async (req, res) => {
  const {
    id,
    title,
    notes,
    interview_status,
    tags,
    start_date,
    due_date,
  } = req.body;

  let statusData = '{}';
  let tagsData = '{}';
  if (interview_status) {
    statusData = '{' + interview_status.toLowerCase() + '}';
  }
  if (tags) {
    tagsData = '{' + tags.toLowerCase() + '}';
  }

  const updateInterviewQuery = `UPDATE interviews
    SET title=$2, notes=$3, status=$4, tags=$5, start_date=$6, due_date=$7
    WHERE id=$1 returning *`;
  const values = [id, title, notes, statusData, tagsData, start_date, due_date];
  try {
    const { rows } = await dbQuery.query(updateInterviewQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to update interview';
    return res.status(status.error).send(errorMessage);
  }
};

export { addInterview, getAll, updateInterview };
