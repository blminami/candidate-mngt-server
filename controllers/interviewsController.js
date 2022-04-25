import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import { removeLastWord } from '../helpers/utils';

const addInterview = async (req, res) => {
  const {
    candidate_id,
    title,
    notes,
    interview_status,
    tags,
    start_date,
    start_time,
    due_date,
    end_time,
    job_id
  } = req.body;
  const { user_id } = req.user;

  let statusData = '{}';
  let tagsData = '{}';
  if (interview_status) {
    statusData = '{' + interview_status + '}';
  }
  if (tags) {
    tagsData = '{' + tags + '}';
  }

  const insertInterviewQuery = `INSERT INTO
      interviews(id, user_id, candidate_id, title, notes, status, tags, start_date, start_time, due_date, end_time, job_id)
      VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *`;
  const values = [
    user_id,
    candidate_id,
    title,
    notes,
    statusData,
    tagsData,
    start_date,
    start_time,
    due_date,
    end_time,
    job_id
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
  const { limit, offset, title, interview_status, tags } = req.query;
  const { user_id } = req.user;
  let today = false;
  let getAllQuery = `SELECT * FROM interviews WHERE user_id = $1 AND`;
  if (title) {
    getAllQuery += " title LIKE '%" + title + "%' AND";
  }
  if (interview_status) {
    let newStatus = interview_status
      .split(',')
      .map((el) => {
        if (el === 'today') {
          today = true;
          return;
        }
        return "'" + el.toLowerCase() + "'";
      })
      .join(',');
    if (newStatus != '') {
      getAllQuery += ' status @> ARRAY[' + newStatus + '::text] AND';
    }
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
  if (today) {
    getAllQuery += ' DATE(start_date) = CURRENT_DATE AND';
  }
  getAllQuery =
    removeLastWord(getAllQuery) +
    ' ORDER BY updated_at DESC LIMIT $2 OFFSET $3;';

  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id, limit, offset]);
    const dbResponse = rows;
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
    start_time,
    due_date,
    end_time
  } = req.body;

  let statusData = '{}';
  let tagsData = '{}';
  if (interview_status) {
    statusData = '{' + interview_status + '}';
  }
  if (tags) {
    tagsData = '{' + tags + '}';
  }

  const updateInterviewQuery = `UPDATE interviews
    SET title=$2, notes=$3, status=$4, tags=$5, start_date=$6, due_date=$7, start_time=$8, end_time=$9
    WHERE id=$1 returning *`;
  const values = [
    id,
    title,
    notes,
    statusData,
    tagsData,
    start_date,
    due_date,
    start_time,
    end_time
  ];
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

const getInterviewsByCandidate = async (req, res) => {
  const { candidateId } = req.query;
  const { user_id } = req.user;
  const query = `SELECT start_date, start_time FROM interviews WHERE user_id = $1 AND candidate_id = $2;`;
  try {
    const { rows } = await dbQuery.query(query, [user_id, candidateId]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

export { addInterview, getAll, updateInterview, getInterviewsByCandidate };
