export const replaceMongoIdInArray = (array) => {
  return array.map(item => {
    const id = item && item._id && item._id.$oid ? item._id.$oid.toString() : item._id ? item._id.toString() : null;
    if (id) {
      const { _id, ...rest } = item;
      return { id, ...rest };
    } else {
      return item;
    }
  });
}

export const replaceMongoIdInObject = (obj) => {
  if (obj && obj._id) {
    const id = obj._id.$oid ? obj._id.$oid.toString() : obj._id.toString();
    const { _id, ...updatedObj } = { ...obj, id };
    return updatedObj;
  } else {
    return obj;
  }
}


export const isDateInbetween = (date, from, to) => {
  return (new Date(date).getTime() >= new Date(from).getTime() && new Date(date).getTime() <= new Date(to).getTime());
}

export const getDayDifference = (from, to) => {
  return ((new Date(to).getTime() - new Date(from).getTime())/(24*60*60*1000)) + 1;
}



