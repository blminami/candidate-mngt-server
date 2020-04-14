import dbQuery from "../db/dev/dbQuery";
import { errorMessage, successMessage, status } from "../helpers/status";

const getAll = async (req, res) => {
  const getAllQuery = "SELECT * from candidates";
  try {
    const { rows } = await dbQuery.query(getAllQuery);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = "No candidates found!";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const addCandidate = async (req, res) => {
  const {
    email,
    name,
    about,
    experience,
    years_of_experience,
    skills,
    education,
    certifications,
  } = req.body;

  const insertCandidateQuery = `INSERT INTO
    candidates(id, email, name, about, about_tokens, experience, experience_tokens,
        years_of_experience, skills, education, education_tokens, certifications, certifications_tokens)
    VALUES(default, $1, $2, $3, to_tsvector($3), $4, to_tsvector($4), $5, ARRAY[$6], $7, to_tsvector($7), $8, to_tsvector($8))
    returning *`;
  const values = [
    email,
    name,
    about,
    experience,
    years_of_experience,
    skills.split(","),
    education,
    certifications,
  ];
  try {
    const { rows } = await dbQuery.query(insertCandidateQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log("error: ", error);
    errorMessage.error = "Unable to add candidate";
    return res.status(status.error).send(errorMessage);
  }
};

export { getAll, addCandidate };
