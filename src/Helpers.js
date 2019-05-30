export const objectToArray = object => {
  let array = [];
  for (let values of Object.values(object)) {
    if (values.id || values.uid) array.push(values);
    else continue;
  }
  return array;
};
