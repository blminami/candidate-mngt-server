import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER,
  secure: false,
  port: 587,
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

const addEmail = async (req, res) => {
  let { type, subject, message } = req.body;
  const { user_id, email } = req.user;
  const insertEventQuery = `INSERT INTO
          emails(id, user_id, email, type, subject, message)
          VALUES(default, $1, $2, $3, $4, $5)
          returning *`;
  const values = [user_id, email, type, subject, message];
  try {
    const { rows } = await dbQuery.query(insertEventQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to add email template';
    return res.status(status.error).send(errorMessage);
  }
};

const getEmails = async (req, res) => {
  const { user_id } = req.user;
  const getAllQuery = `SELECT * from emails where user_id = $1;`;
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to get email templates';
    return res.status(status.error).send(errorMessage);
  }
};

const getEmailByID = async (req, res) => {
  const { id } = req.params;
  const getByIdQuery = `SELECT * from emails where id = $1;`;
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

const updateEmail = async (req, res) => {
  const { id, type, subject, message } = req.body;

  const updateEmailQuery = `UPDATE emails
      SET type=$2, subject=$3, message=$4
      WHERE id=$1 returning *`;
  const values = [id, type, subject, message];
  try {
    const { rows } = await dbQuery.query(updateEmailQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to update email';
    return res.status(status.error).send(errorMessage);
  }
};

const sendEmail = async (req, res) => {
  const { candidate_id, email_type, project_id } = req.query;
  const { user_id } = req.user;

  const getCandidateQuery = `SELECT * FROM candidates WHERE id=$1;`;
  const getEmailQuery = `SELECT * FROM emails WHERE user_id=$1 and type=$2;`;
  const getProjectQuery = `SELECT * FROM jobs WHERE id=$1;`;

  try {
    const candidateRows = await dbQuery.query(getCandidateQuery, [
      candidate_id,
    ]);
    const emailRows = await dbQuery.query(getEmailQuery, [user_id, email_type]);
    const candidate = candidateRows.rows[0];
    const email = emailRows.rows[0];

    //TODO: Replace {{username}} in message body
    var data = {
      to: candidate.email,
      from: email.email,
      subject: email.subject,
      html: email.message,
    };

    smtpTransport.sendMail(data, function (err) {
      if (!err) {
        successMessage.data = 'Email send successfully';
        return res.status(status.created).send(successMessage);
      } else {
        console.log(err);
        errorMessage.error = 'Unable to send email';
        return res.status(status.error).send(errorMessage);
      }
    });
  } catch (error) {
    console.log(error);
    errorMessage.error = 'Unable to send email';
    return res.status(status.error).send(errorMessage);
  }
};

export { addEmail, getEmails, getEmailByID, updateEmail, sendEmail };
