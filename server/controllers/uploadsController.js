import fs from 'fs';
import { parseFile } from '../helpers/pdf-parser';

const watch = () => {
  fs.watch('profiles', async (eventType, filename) => {
    console.log(eventType);
    if (eventType === 'change') {
      const candidate = await parseFile(filename);
      //TODO: insert candidate in DB
      console.log(candidate);
      fs.unlink(`profiles/${filename}`, (err) => {
        if (err) throw err;
        console.log(`successfully deleted /profiles/${filename}`);
      });
    }
  });
};

export { watch };
