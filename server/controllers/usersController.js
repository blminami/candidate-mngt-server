import dbQuery from "../db/dev/dbQuery";

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from "../helpers/validations";

import { errorMessage, successMessage, status } from "../helpers/status";

const searchFirstnameOrLastname = async (req, res) => {
  const { first_name, last_name } = req.query;
  const searchQuery =
    "SELECT * from users WHERE first_name =$1 OR last_name =$2 ORDER BY id DESC";
  try {
    const { rows } = await dbQuery.query(searchQuery, [first_name, last_name]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = "No user with such names";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

export { searchFirstnameOrLastname };
