import dbQuery from "../db/dev/dbQuery";
import { errorMessage, successMessage, status } from "../helpers/status";

const removeLastWord = (text) => {
  let newText = text.split(" ");
  newText.pop();
  return newText.join(" ");
};

const getAll = async (req, res) => {
  const { limit, offset } = req.query;
  const getAllQuery = `SELECT id, email, name, about, experience, years_of_experience, skills, education, certifications, profile_image FROM candidates
     LIMIT $1 OFFSET $2;`;
  try {
    const { rows } = await dbQuery.query(getAllQuery, [limit, offset]);
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

const getByID = async (req, res) => {
  console.log("ajunge aici");
  const { id } = req.params;
  const getByIdQuery =
    "SELECT id, email, name, about, experience, years_of_experience, skills, education, certifications, profile_image FROM candidates WHERE id = $1;";
  try {
    const { rows } = await dbQuery.query(getByIdQuery, [id]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = "No candidate found!";
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

  const skillData = "{" + skills.toLowerCase() + "}";

  const insertCandidateQuery = `INSERT INTO
    candidates(id, email, name, about, about_tokens, experience, experience_tokens,
        years_of_experience, skills, education, education_tokens, certifications, certifications_tokens)
    VALUES(default, $1, $2, $3, to_tsvector($3), $4, to_tsvector($4), $5, $6, $7, to_tsvector($7), $8, to_tsvector($8))
    returning *`;
  const values = [
    email,
    name,
    about,
    experience,
    years_of_experience,
    skillData,
    education,
    certifications,
  ];
  try {
    const { rows } = await dbQuery.query(insertCandidateQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Unable to add candidate";
    return res.status(status.error).send(errorMessage);
  }
};

const searchCandidates = async (req, res) => {
  const { name, skills, yearsOfExperience, keyWords, sections } = req.query;
  let newSkills = skills
    .split(",")
    .map((el) => {
      return "'" + el.toLowerCase() + "'";
    })
    .join(",");
  let searchQuery =
    "SELECT id, email, name, about, experience, years_of_experience, skills, education, certifications, profile_image FROM candidates WHERE";
  if (name) {
    searchQuery += " name LIKE '%" + name + "%' AND";
  }
  if (skills) {
    searchQuery += " skills @> ARRAY[" + newSkills + "::text] AND";
  }
  if (yearsOfExperience) {
    searchQuery += " years_of_experience = " + yearsOfExperience + " AND";
  }
  if (keyWords) {
    searchQuery += " (";
    const keyWordsArray = keyWords.split(",").map((el) => el.replace(" ", "&"));
    const sectionsArray = sections.split(",").map((el) => el.toLowerCase());
    keyWordsArray.forEach((keyWord) => {
      sectionsArray.forEach((section) => {
        searchQuery +=
          " to_tsvector(" + section + ") @@ to_tsquery('" + keyWord + "') OR";
      });
    });
    searchQuery = removeLastWord(searchQuery) + ") AND";
  }
  searchQuery = removeLastWord(searchQuery) + ";";
  try {
    const { rows } = await dbQuery.query(searchQuery);
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

export { getAll, getByID, searchCandidates, addCandidate };
