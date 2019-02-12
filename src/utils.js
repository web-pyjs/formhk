export const omit = (obj, prop) => {
  const { [prop]: ba, ...rest } = obj;
  return rest;
};

export const objEquals = (ob1, ob2) =>
  JSON.stringify(ob1) === JSON.stringify(ob2);
