import { useState, useEffect } from "react";

import groupBy from "lodash.groupby";
import unique from "lodash.uniq";
import { scaleTime, scaleLinear } from "@vx/scale";

const computeChart = (data, dateField, areaField = null) => {
  if (data === null || data === undefined) return null;

  const useAreaField = areaField !== null;
  const areaFieldValues = getAreaFieldValues(data, areaField);

  // Could be done in O(n) with a single reduce if there are perf issues
  const groupedData = getGroupedEntries(data, dateField)
    .map(([date, d]) => {
      const areaGroup = useAreaField ? getGroupedEntries(d, areaField) : [];
      return {
        date,
        total: d.length,
        ...areaGroup.reduce((acc, [key, value]) => {
          acc[key] = value.length;
          return acc;
        }, {}),
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const dates = groupedData.map((d) => new Date(d.date).valueOf());

  const timeScale = scaleTime({
    domain: [Math.min(...dates), Math.max(...dates)],
  });

  const totals = groupedData.map((d) => d.total);

  const valueScale = scaleLinear({
    domain: [0, Math.max(...totals)],
    nice: true,
  });

  return {
    data: groupedData,
    areaFieldValues,
    useAreaField,
    timeScale,
    valueScale,
  };
};

const useAreaChart = (data, dateField, areaField = null) => {
  const [chartData, setChartData] = useState(() =>
    computeChart(data, dateField, areaField)
  );

  useEffect(() => {
    setChartData(computeChart(data, dateField, areaField));
  }, [data, dateField, areaField]);

  return chartData;
};

export { computeChart };
export default useAreaChart;

function removeUndefinedOrNull(arr) {
  return arr.filter((value) => value !== null && value !== undefined);
}

function getAreaFieldValues(data, areaField) {
  if (areaField === null) return [];

  return removeUndefinedOrNull(unique(data.map((d) => d[areaField])));
}

function getGroupedEntries(data, selectField) {
  return Object.entries(groupBy(data, (d) => d[selectField]));
}
