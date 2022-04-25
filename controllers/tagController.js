import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';

const getTags = async (req, res) => {
  const { user_id } = req.user;
  const getAllTagsQuery =
    'SELECT * FROM tags WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5;';
  try {
    const { rows } = await dbQuery.query(getAllTagsQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const addTag = async (req, res) => {
  const { title, color } = req.body;
  const { user_id } = req.user;
  const addTag =
    'INSERT INTO tags(id, user_id, title, color) VALUES (default, $1, $2, $3) RETURNING *;';
  try {
    const { rows } = await dbQuery.query(addTag, [user_id, title, color]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to add interview';
    return res.status(status.error).send(errorMessage);
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.params;
  const deleteTag = 'DELETE FROM tags WHERE id=$1;';
  try {
    const { rows } = await dbQuery.query(deleteTag, [id]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to delete interview';
    return res.status(status.error).send(errorMessage);
  }
};

export { getTags, addTag, deleteTag };
