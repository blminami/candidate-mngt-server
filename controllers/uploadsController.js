import fs from 'fs';
import { parseFile } from '../helpers/pdf-parser';
import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './profiles');
  },
  filename: function (req, file, callback) {
    const { user_id } = req.user;
    const originalName = file.originalname.split('.')[0];
    const format = file.originalname.split('.')[1];
    callback(null, `${originalName}$${user_id}.${format}`);
  }
});
const upload = multer({ storage: storage }).single('fileKey');

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
        candidate.user_id
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
  const { filename } = req.query;
  const { user_id } = req.user;
  let getAllQuery = `SELECT * FROM uploads WHERE user_id=$1`;
  if (filename) {
    getAllQuery += " AND name LIKE '%" + filename + "%';";
  }
  try {
    const { rows } = await dbQuery.query(getAllQuery, [user_id]);
    const dbResponse = rows;
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to get uploads';
    return res.status(status.error).send(errorMessage);
  }
};

const downloadUpload = async (req, res) => {
  const { filename } = req.params;
  const { user_id } = req.user;
  const name = filename.split('.')[0];
  const format = filename.split('.')[1];
  const file = path.resolve(
    __dirname,
    `../processed/${name}$${user_id}.${format}`
  );
  res.download(file);
};

const uploadFile = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(status.error).send('Error uploading file');
    }
    let addUpload = `INSERT INTO uploads(id, user_id, type, name, size)
    VALUES (default, $1, 'document', $2, $3)`;
    const { user_id } = req.user;
    const name = req.file.originalname;
    const size = req.file.size / 1000 + 'kB';
    try {
      const { rows } = await dbQuery.query(addUpload, [user_id, name, size]);
      const dbResponse = rows;
      successMessage.data = dbResponse;
      return res.status(status.created).send(successMessage);
    } catch (error) {
      errorMessage.error = 'Unable to add uploads';
      return res.status(status.error).send(errorMessage);
    }
  });
};

export { watch, getAllUploads, downloadUpload, uploadFile };
