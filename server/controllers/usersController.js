import dbQuery from '../db/dev/dbQuery';
import multer from 'multer';
import cloudinary from 'cloudinary';

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from '../helpers/validations';

import { errorMessage, successMessage, status } from '../helpers/status';
import { forgotPasswordBody } from '../helpers/forgot-password-body';
import { sendAppEmail } from './emailsController';
import { resetPasswordBody } from '../helpers/reset-password.body';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './user_images');
  },
  filename: function (req, file, callback) {
    const { user_id } = req.user;
    const originalName = file.originalname.split('.')[0];
    const format = file.originalname.split('.')[1];
    callback(null, `${originalName}$${user_id}.${format}`);
  },
});
const upload = multer({ storage: storage }).single('fileKey');

cloudinary.v2.config({
  cloud_name: `daptcduwi`,
  api_key: '453818915463151',
  api_secret: 'MriaXTOhmfKPY4eL4YCM55VcyW0',
});

const createUser = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  const created_on = new Date();
  if (
    isEmpty(email) ||
    isEmpty(first_name) ||
    isEmpty(last_name) ||
    isEmpty(password)
  ) {
    errorMessage.error =
      'Email, password, first name and last name field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, created_on)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
  const values = [email, first_name, last_name, hashedPassword, created_on];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.first_name,
      dbResponse.last_name
    );
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = 'Email or Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = 'Please enter a valid Email or Password';
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = 'User with this email does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect';
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.first_name,
      dbResponse.last_name
    );
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const searchFirstnameOrLastname = async (req, res) => {
  const { first_name, last_name } = req.query;
  const searchQuery =
    'SELECT * from users WHERE first_name =$1 OR last_name =$2 ORDER BY id DESC';
  try {
    const { rows } = await dbQuery.query(searchQuery, [first_name, last_name]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'No user with such names';
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (isEmpty(email)) {
    errorMessage.error = 'Email sdetail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }
  const userQuery = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await dbQuery.query(userQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = 'User with this email does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    let emailBody = forgotPasswordBody;
    emailBody = emailBody
      .replace('{{firstName}}', dbResponse.first_name)
      .replace('{{lastName}}', dbResponse.last_name)
      .replace(/{{url}}/g, 'http://localhost:4200/auth/reset-password');
    const err = sendAppEmail(email, 'Forgot Password Email', emailBody);
    if (err) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    } else {
      successMessage.data = 'Email send successfully';
      return res.status(status.success).send(successMessage);
    }
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (isEmpty(newPassword) || isEmpty(confirmPassword)) {
    errorMessage.error = 'Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(newPassword) || !validatePassword(confirmPassword)) {
    errorMessage.error = 'Please enter a valid Password';
    return res.status(status.bad).send(errorMessage);
  }
  if (newPassword !== confirmPassword) {
    errorMessage.error = "The Passwords don't match";
    return res.status(status.bad).send(errorMessage);
  }
  const userQuery = 'SELECT * FROM users WHERE email = $1';
  const updateQuery = 'UPDATE users SET password=$1 WHERE email=$2 RETURNING *';
  try {
    const { rows } = await dbQuery.query(userQuery, [email]);
    if (!rows[0]) {
      errorMessage.error = 'User with this email does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    const hashedPassword = hashPassword(newPassword);
    const updateRows = await dbQuery.query(updateQuery, [
      hashedPassword,
      email,
    ]);
    const dbResponse = updateRows.rows[0];
    if (!dbResponse) {
      errorMessage.error = "Error updating user's password";
      return res.status(status.error).send(errorMessage);
    }

    let emailBody = resetPasswordBody;
    emailBody = emailBody
      .replace('{{firstName}}', dbResponse.first_name)
      .replace('{{lastName}}', dbResponse.last_name)
      .replace('{{email}}', dbResponse.email);
    const err = sendAppEmail(email, 'Reset Password Email', emailBody);
    if (err) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage);
    } else {
      successMessage.data = 'Email send successfully';
      return res.status(status.success).send(successMessage);
    }
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const updateUserInfo = async (req, res) => {
  const { email, first_name, last_name, notifications } = req.body;
  const { user_id } = req.user;
  const query = `UPDATE users SET email=$1, first_name=$2, last_name=$3, notifications=$4 WHERE id=$5 RETURNING *;`;
  try {
    const { rows } = await dbQuery.query(query, [
      email,
      first_name,
      last_name,
      notifications,
      user_id,
    ]);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.first_name,
      dbResponse.last_name
    );
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const uploadProfileImage = async (req, res) => {
  const { user_id } = req.user;
  upload(req, res, async function (err) {
    if (err) {
      return res.status(status.error).send('Error uploading file');
    }
    const originalName = req.file.originalname.split('.')[0];
    const format = req.file.originalname.split('.')[1];
    cloudinary.v2.uploader.upload(
      `user_images/${originalName}$${user_id}.${format}`,
      async function (error, result) {
        console.log(result, error);
        if (error) {
          errorMessage.error = 'Unable to add profile image';
          return res.status(status.error).send(errorMessage);
        }
        const query =
          'UPDATE users SET profile_image=$1 WHERE id=$2 RETURNING *;';
        try {
          const { rows } = await dbQuery.query(query, [
            result.secure_url,
            user_id,
          ]);
          const dbResponse = rows[0];
          delete dbResponse.password;
          const token = generateUserToken(
            dbResponse.email,
            dbResponse.id,
            dbResponse.first_name,
            dbResponse.last_name
          );
          successMessage.data = dbResponse;
          successMessage.data.token = token;
          return res.status(status.created).send(successMessage);
        } catch (error) {
          errorMessage.error = 'Unable to add profile image';
          return res.status(status.error).send(errorMessage);
        }
      }
    );
  });
};

export {
  searchFirstnameOrLastname,
  signinUser,
  createUser,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  uploadProfileImage,
};
