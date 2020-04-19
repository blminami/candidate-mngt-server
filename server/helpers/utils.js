const removeLastWord = (text) => {
  let newText = text.split(' ');
  newText.pop();
  return newText.join(' ');
};

export { removeLastWord };
