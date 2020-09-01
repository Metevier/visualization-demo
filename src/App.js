import React, { useState } from "react";
import { Box, Heading } from "@chakra-ui/core";
import Chart from "./components/Chart";
import FieldSelector from "./components/FieldSelector";
import Filters from "./components/Filters";
import useDataSource, { withFilter } from "./hooks/useDataSource";
import useAreaChart from "./hooks/useAreaChart";
import dataSource from "./dataSources/cdcCovid";

const App = () => {
  const [areaField, setAreaField] = useState(dataSource.sex.name);
  const [filter, setFilter] = useState();

  const { isLoading, data } = useDataSource(
    withFilter(dataSource, (filterBuilder) => {
      let builder = filterBuilder
        .select(
          (fields) => fields.reportDate,
          (fields) => fields[areaField]
        )
        .where((fields) => fields.reportDate)
        .between("2020-07-01", "2020-08-01");

      if (filter) {
        const filterPredicate = builder.where(filter.field)[filter.operator];
        if (typeof filterPredicate === "function")
          builder = filterPredicate(filter.value);
      }

      return builder;
    })
  );

  const chartData = useAreaChart(data, "reportDate", areaField);
  const textFields = Object.values(dataSource).filter(
    (d) => d.__fieldType === "text"
  );

  return (
    <Box>
      <Heading>Visualization Demo</Heading>
      <Filters fields={textFields} setFilter={setFilter} />
      <FieldSelector fields={textFields} setField={setAreaField} />
      {!isLoading && chartData ? <Chart chartData={chartData} /> : ""}
    </Box>
  );
};

export default App;
