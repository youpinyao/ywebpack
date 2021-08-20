module.exports = (str) => {
  if (!str) {
    return undefined;
  }
  let name = str.split('/');

  // eslint-disable-next-line
  name = name[name.length - 1].split('.')[0];

  return name;
};
