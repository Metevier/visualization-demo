import { computeChart } from "./useAreaChart";

describe("computeChart", () => {
  let chartData;

  beforeEach(() => {
    chartData = [
      { date: "2020-01-01T00:00:00", sex: "Male" },
      { date: "2020-01-01T00:00:00", sex: "Male" },
      { date: "2020-01-01T00:00:00", sex: "Female" },
      { date: "2020-01-02T00:00:00", sex: "Male" },
      { date: "2020-01-02T00:00:00", sex: "Female" },
      { date: "2020-01-03T00:00:00", sex: "Other" },
    ];
  });

  test("has data with sorted date field", () => {
    const { data } = computeChart(chartData, "date");
    expect(data.map((d) => d.date)).toEqual([
      "2020-01-01T00:00:00",
      "2020-01-02T00:00:00",
      "2020-01-03T00:00:00",
    ]);
  });

  test("aggregates areaField", () => {
    const { data } = computeChart(chartData, "date", "sex");
    expect(data).toEqual([
      { date: "2020-01-01T00:00:00", total: 3, Male: 2, Female: 1 },
      { date: "2020-01-02T00:00:00", total: 2, Male: 1, Female: 1 },
      { date: "2020-01-03T00:00:00", total: 1, Other: 1 },
    ]);
  });

  test("computeChart without areaField returns empty aray for areaFieldValues and useAreaField=false", () => {
    const { areaFieldValues, useAreaField } = computeChart(chartData, "date");
    expect(areaFieldValues).toEqual([]);
    expect(useAreaField).toBe(false);
  });

  test("computeChart without areaField returns data with date and total only", () => {
    const { data } = computeChart(chartData, "date");
    expect(data).toEqual([
      { date: "2020-01-01T00:00:00", total: 3 },
      { date: "2020-01-02T00:00:00", total: 2 },
      { date: "2020-01-03T00:00:00", total: 1 },
    ]);
  });
});
