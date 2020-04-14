import pool from "../db/dev/pool";
import { hashPassword } from "../helpers/validations";
import { status } from "../helpers/status";

const seedUser = async (req, res) => {
  const seedUserQuery = `INSERT INTO
  users VALUES
  ( default, 'samuel@gmail.com', 'Samuel', 'Adekunle', '${hashPassword(
    "samade"
  )}', NOW()),
  ( default, 'eze@gmail.com', 'Eze', 'Kelly', '${hashPassword(
    "ezekelly"
  )}', NOW()),
  ( default, 'damilola@gmail.com', 'Damilola', 'Adedeji', '${hashPassword(
    "adedeji2"
  )}', NOW()),
  ( default, 'temilola@gmail.com', 'Temilola', 'Adedeji', '${hashPassword(
    "temitee1"
  )}', NOW()),
  ( default, 'kingsley@gmail.com', 'Kingsley', 'Clement', '${hashPassword(
    "clementking"
  )}', NOW())`;

  try {
    const { rows } = await pool.query(seedUserQuery);
    const dbResponse = rows;
    if (!dbResponse) {
      return res.status(status.bad).send("Seeding Was not Successful");
    }
    return res
      .status(status.created)
      .send("Seeding Users table Was Successful");
  } catch (error) {
    console.log(error)
    return res.status(status.error).send("An Error occured try later", error);
  }
};

export default seedUser;
