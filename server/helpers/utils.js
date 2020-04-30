import fs from 'fs';

const removeLastWord = (text) => {
  let newText = text.split(' ');
  newText.pop();
  return newText.join(' ');
};

const getFileSize = (filename) => {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
};

export { removeLastWord, getFileSize };
