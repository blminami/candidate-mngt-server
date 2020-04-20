import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import { removeLastWord } from '../helpers/utils';

const addJob = async (req, res) => {
  const {
    user_id,
    title,
    description,
    job_status,
    required_resources,
    hired_resources,
  } = req.body;

  const insertJobQuery = `INSERT INTO
        jobs(id, user_id, title, description, status, required_resources, hired_resources)
        VALUES(default, $1, $2, $3, $4, $5, $6)
        returning *`;
  const values = [
    user_id,
    title,
    description,
    job_status,
    required_resources,
    hired_resources,
  ];
  try {
    const { rows } = await dbQuery.query(insertJobQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to add job';
    return res.status(status.error).send(errorMessage);
  }
};

const getAll = async (req, res) => {
  const { user_id, project_name, project_status } = req.query;
  let getAllQuery = `SELECT * FROM jobs WHERE user_id = $1 AND`;
  if (project_name) {
    getAllQuery += " title like '%" + project_name.toLowerCase() + "%' AND";
  }
  if (project_status) {
    getAllQuery += ' (';
    const statuses = project_status.split(',').map((el) => el.toUpperCase());
    statuses.forEach((element) => {
      getAllQuery += " status='" + element + "' OR";
    });
    getAllQuery = removeLastWord(getAllQuery) + ') AND';
  }
  getAllQuery = removeLastWord(getAllQuery) + ';';

  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'No jobs found!';
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

const getByID = async (req, res) => {
  const { id } = req.params;
  const getByIdQuery = 'SELECT * FROM jobs WHERE id = $1;';
  try {
    const { rows } = await dbQuery.query(getByIdQuery, [id]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'No job found!';
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const updateJob = async (req, res) => {
  const {
    id,
    title,
    description,
    job_status,
    required_resources,
    hired_resources,
  } = req.body;

  const updateJobQuery = `UPDATE jobs
      SET title=$2, description=$3, status=$4, required_resources=$5, hired_resources=$6
      WHERE id=$1 returning *`;
  const values = [
    id,
    title,
    description,
    job_status,
    required_resources,
    hired_resources,
  ];
  try {
    const { rows } = await dbQuery.query(updateJobQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to update job';
    return res.status(status.error).send(errorMessage);
  }
};

export { addJob, getAll, getByID, updateJob };
