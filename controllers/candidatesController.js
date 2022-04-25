import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import { removeLastWord } from '../helpers/utils';

const getByID = async (req, res) => {
  const { id } = req.params;
  const getByIdQuery = `
    SELECT *
    FROM candidates c
    LEFT JOIN interviews i ON c.id = i.candidate_id
    WHERE c.id = $1;`;
  try {
    const { rows } = await dbQuery.query(getByIdQuery, [id]);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'No candidate found!';
      return res.status(status.notfound).send(errorMessage);
    }
    const candidate = {
      id: id,
      email: dbResponse[0].email,
      name: dbResponse[0].name,
      about: dbResponse[0].about,
      experience: dbResponse[0].experience,
      years_of_experience: dbResponse[0].years_of_experience,
      skills: dbResponse[0].skills,
      education: dbResponse[0].education,
      certifications: dbResponse[0].certifications,
      candidate_status: dbResponse[0].candidate_status,
      interviews: []
    };
    dbResponse.forEach((el) => {
      if (el.title) {
        const interview = {
          title: el.title,
          notes: el.notes,
          id: el.id,
          start_date: el.start_date
        };
        candidate.interviews.push(interview);
      }
    });
    successMessage.data = candidate;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
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
    certifications
  } = req.body;

  const { user_id } = req.user;

  const skillData = '{' + skills.toLowerCase() + '}';

  const insertCandidateQuery = `INSERT INTO
    candidates(id, email, name, about, about_tokens, experience, experience_tokens,
        years_of_experience, skills, education, education_tokens, certifications, certifications_tokens, user_id)
    VALUES(default, $1, $2, $3, to_tsvector($3), $4, to_tsvector($4), $5, $6, $7, to_tsvector($7), $8, to_tsvector($8), $9)
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
    user_id
  ];
  try {
    const { rows } = await dbQuery.query(insertCandidateQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to add candidate';
    return res.status(status.error).send(errorMessage);
  }
};

const getAll = async (req, res) => {
  const {
    name,
    skills,
    candidate_status,
    yearsOfExperience,
    keyWords,
    sections,
    projectId,
    limit,
    offset
  } = req.query;
  const { user_id } = req.user;
  let searchQuery =
    'SELECT id, email, name, about, experience, years_of_experience, skills, education, certifications, profile_image, candidate_status FROM candidates WHERE user_id = $1 AND';
  if (name) {
    searchQuery += " lower(name) LIKE lower('%" + name + "%') AND";
  }
  if (projectId && projectId !== '0') {
    searchQuery += ' project_id = ' + projectId + ' AND';
  }
  if (skills) {
    let newSkills = skills
      .split(',')
      .map((el) => {
        return "'" + el.toLowerCase() + "'";
      })
      .join(',');
    searchQuery += ' skills @> ARRAY[' + newSkills + '::text] AND';
  }
  if (candidate_status && candidate_status !== 'ALL') {
    searchQuery += " candidate_status = '" + candidate_status + "' AND";
  }
  if (yearsOfExperience) {
    searchQuery += ' years_of_experience = ' + yearsOfExperience + ' AND';
  }
  if (keyWords) {
    searchQuery += ' (';
    const keyWordsArray = keyWords.split(',').map((el) => el.replace(' ', '&'));
    const sectionsArray = sections.split(',').map((el) => el.toLowerCase());
    keyWordsArray.forEach((keyWord) => {
      sectionsArray.forEach((section) => {
        searchQuery +=
          ' to_tsvector(' + section + ") @@ to_tsquery('" + keyWord + "') OR";
      });
    });
    searchQuery = removeLastWord(searchQuery) + ') AND';
  }
  searchQuery = removeLastWord(searchQuery) + ' LIMIT $2 OFFSET $3;';

  try {
    const { rows } = await dbQuery.query(searchQuery, [user_id, limit, offset]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const getCandidatesLength = async (req, res) => {
  const { user_id } = req.user;
  const query = 'SELECT COUNT(*) FROM candidates WHERE user_id=$1;';
  try {
    const { rows } = await dbQuery.query(query, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const updateCandidate = async (req, res) => {
  const {
    id,
    email,
    name,
    about,
    experience,
    yearsOfExperience,
    skills,
    education,
    certifications,
    candidate_status
  } = req.body;
  const skillData = '{' + skills.toString().toLowerCase() + '}';
  const query = `UPDATE candidates
  SET email = $1, name = $2, about = $3, experience = $4, years_of_experience = $5, skills = $6, education = $7,
  certifications = $8, candidate_status = $9 WHERE id = $10 returning *;`;
  const values = [
    email,
    name,
    about,
    experience,
    yearsOfExperience,
    skillData,
    education,
    certifications,
    candidate_status,
    id
  ];
  try {
    const { rows } = await dbQuery.query(query, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to update candidate';
    return res.status(status.error).send(errorMessage);
  }
};

const updateCandidateStatus = async (req, res) => {
  const { candidateId, projectId } = req.body;
  console.log('Method updateCandidateStatus: ', candidateId, projectId);
  const query = `UPDATE candidates SET candidate_status=$1, project_id=$2 WHERE id=$3 returning *;`;
  try {
    const { rows } = await dbQuery.query(query, [
      'CONTACTED',
      projectId,
      candidateId
    ]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('\nerror: ', error);
    errorMessage.error = 'Unable to update candidate';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  getAll,
  getByID,
  addCandidate,
  getCandidatesLength,
  updateCandidate,
  updateCandidateStatus
};
