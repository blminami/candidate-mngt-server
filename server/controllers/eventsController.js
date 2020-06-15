import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';

const addEvent = async (req, res) => {
  let {
    title,
    color,
    start_date,
    start_time,
    due_date,
    end_time,
    location,
    notes,
    type,
  } = req.body;
  if (!type) {
    type = 'EVENT';
  }
  if (!color) {
    color = '#ea80fc';
  }
  const { user_id } = req.user;
  const insertEventQuery = `INSERT INTO
          events(id, user_id, title, color, start_date, start_time, due_date, end_time, location, notes, type)
          VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          returning *`;
  const values = [
    user_id,
    title,
    color,
    start_date,
    start_time,
    due_date,
    end_time,
    location,
    notes,
    type,
  ];
  try {
    const { rows } = await dbQuery.query(insertEventQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to add event';
    return res.status(status.error).send(errorMessage);
  }
};

const updateEvent = async (req, res) => {
  const {
    id,
    title,
    color,
    start_date,
    start_time,
    due_date,
    end_time,
    location,
    notes,
  } = req.body;
  const updateEventsQuery = `UPDATE events
      SET title=$2, color=$3, start_date=$4, start_time=$5, due_date=$6, end_time=$7, location=$8, notes=$9
      WHERE id=$1 returning *`;
  const values = [
    id,
    title,
    color,
    start_date,
    start_time,
    due_date,
    end_time,
    location,
    notes,
  ];
  try {
    const { rows } = await dbQuery.query(updateEventsQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to update event';
    return res.status(status.error).send(errorMessage);
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const deleteEventsQuery = `DELETE FROM events WHERE id=$1;`;
  try {
    const { rows } = await dbQuery.query(deleteEventsQuery, [id]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to delete event';
    return res.status(status.error).send(errorMessage);
  }
};

const getAllEvents = async (req, res) => {
  const { user_id } = req.user;
  const getAllQuery = `SELECT * FROM events WHERE user_id=$1;`;
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to get events';
    return res.status(status.error).send(errorMessage);
  }
};

const getEventsByCurrentDate = async (req, res) => {
  const { user_id } = req.user;
  const getAllQuery = `SELECT * FROM events WHERE user_id=$1 and DATE(start_date) = CURRENT_DATE;`;
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to get events';
    return res.status(status.error).send(errorMessage);
  }
};

export { addEvent, updateEvent, deleteEvent, getAllEvents, getEventsByCurrentDate};
