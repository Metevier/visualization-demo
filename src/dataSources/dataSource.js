const fieldTypes = {
  text({ fieldName = null, allowedValues = [] } = {}) {
    return {
      allowedValues,
      fieldName,
      __fieldType: "text",
    };
  },
  timestamp({ fieldName = null } = {}) {
    return {
      fieldName,
      __fieldType: "timestamp",
    };
  },
};

const createDataSource = (fields) => {
  return Object.keys(fields).reduce((acc, field) => {
    acc[field] = {
      ...fields[field],
      fieldName: fields[field].fieldName ?? field,
      name: field,
    };
    return acc;
  }, {});
};

export { createDataSource, fieldTypes };
