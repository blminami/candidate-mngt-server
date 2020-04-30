import fs from 'fs';
import { parseFile } from '../helpers/pdf-parser';
import dbQuery from '../db/dev/dbQuery';

const watch = () => {
  fs.watch('profiles', async (eventType, filename) => {
    if (eventType === 'change') {
      const candidate = await parseFile(filename);
      //TODO: add conditions
      candidate.name = filename.split('$')[0];
      candidate.user_id = filename.split('$')[1].split('.')[0];
      const insertCandidateQuery = `INSERT INTO candidates(id, email, name, about, about_tokens, experience, experience_tokens,
        years_of_experience, skills, education, education_tokens, certifications, certifications_tokens, user_id)
        VALUES(default, $1, $2, $3, to_tsvector($3), $4, to_tsvector($4), $5, $6, $7, to_tsvector($7), $8, to_tsvector($8), $9)
        returning *`;
      const values = [
        candidate.email,
        candidate.name,
        candidate.about,
        candidate.experience,
        candidate.yearsOfExperience,
        candidate.skills,
        candidate.education,
        candidate.certifications,
        candidate.user_id,
      ];
      try {
        const { rows } = await dbQuery.query(insertCandidateQuery, values);
        fs.rename(`profiles/${filename}`, `processed/${filename}`, (err) => {
          if (err) throw err;
          else console.log('Successfully moved');
        });
      } catch (error) {
        console.log('Error adding candidate: ', error);
      }
    }
  });
};

const getAllUploads = async (req, res) => {
  const { user_id } = req.user;
  const getAllQuery = `SELECT * FROM uploads WHERE user_id=$1;`;
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log('error', error);
    errorMessage.error = 'Unable to get uploads';
    return res.status(status.error).send(errorMessage);
  }
};

export { watch, getAllUploads };
