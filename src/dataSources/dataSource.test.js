import { createDataSource, fieldTypes } from "../datasources/dataSource";

describe("dataSource", () => {
  test("createDataSource uses passed fieldName first then key name", () => {
    const { date, name } = createDataSource({
      date: fieldTypes.timestamp({ fieldName: "createDate" }),
      name: fieldTypes.text(),
    });

    expect(date.fieldName).toBe("createDate");
    expect(name.fieldName).toBe("name");
  });

  test("createDataSource reflects key name as 'name'", () => {
    const { date, name } = createDataSource({
      date: fieldTypes.timestamp({ fieldName: "createDate" }),
      name: fieldTypes.text(),
    });

    expect(date.name).toBe("date");
    expect(name.name).toBe("name");
  });
});
