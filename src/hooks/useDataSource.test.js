import { withFilter } from "./useDatasource";
import { createDataSource, fieldTypes } from "../datasources/dataSource";

describe("withFilters", () => {
  let dataSource;

  beforeEach(() => {
    dataSource = createDataSource({
      date: fieldTypes.timestamp(),
      name: fieldTypes.text(),
    });
  });

  test("'.where' generates '$WHERE=() statement with selector lambda", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder.where((fields) => fields.name).equals("test")
    );
    expect(filter.getParams()).toEqual(["$WHERE=(name='test')"]);
  });

  test("'.where' generates '$WHERE=() statement with field name", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder.where("name").equals("test")
    );
    expect(filter.getParams()).toEqual(["$WHERE=(name='test')"]);
  });

  test("Multiple '.where' clauses generates '$WHERE=( ' AND ' ) statement", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder
        .where((fields) => fields.name)
        .equals("test")
        .where((fields) => fields.date)
        .equals("2020-01-01")
    );
    expect(filter.getParams()).toEqual([
      "$WHERE=(name='test' AND date='2020-01-01')",
    ]);
  });

  test("Can '.select' multiple fields with selector or field name in a single select statement", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder.select((fields) => fields.name, "date")
    );
    expect(filter.getParams()).toEqual(["$SELECT=name,date"]);
  });

  test("Can '.select' multiple fields with selector or field name in a multiple select statements", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder.select((fields) => fields.name).select("date")
    );
    expect(filter.getParams()).toEqual(["$SELECT=name,date"]);
  });

  test("Can '.select' and '.where' with same builder", () => {
    const filter = withFilter(dataSource, (builder) =>
      builder
        .select((fields) => fields.name)
        .select("date")
        .where((fields) => fields.name)
        .equals("test")
    );
    const params = filter.getParams();
    expect(params).toHaveLength(2);
    expect(params).toEqual(
      expect.arrayContaining(["$SELECT=name,date", "$WHERE=(name='test')"])
    );
  });
});
