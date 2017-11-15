module.exports = (str) => {
  let name = str.split('/');

  name = name[name.length - 1].split('.')[0];

  return name;
}
