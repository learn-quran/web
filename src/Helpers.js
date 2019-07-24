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

const shuffleArray = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export { objectToArray, getRandomInt, shuffleArray };
