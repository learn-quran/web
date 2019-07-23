const objectToArray = object => {
  let array = [];
  for (let values of Object.values(object)) {
    if (values.id || values.uid) array.push(values);
    else continue;
  }
  return array;
};

const getRandomInt = (max, min = 0) =>
  Math.floor(Math.random() * (max - min - 1) + min);

export { objectToArray, getRandomInt };
