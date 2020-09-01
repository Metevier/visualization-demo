import React from "react";
import { Box, Heading } from "@chakra-ui/core";
import Chart from "./components/Chart";
import useDataSource, { withFilter } from "./hooks/useDataSource";
import useAreaChart from "./hooks/useAreaChart";
import dataSource from "./dataSources/cdcCovid";

const App = () => {
  const { isLoading, data } = useDataSource(
    withFilter(dataSource, (builder) =>
      builder.select(
        (fields) => fields.age,
        (fields) => fields.reportDate,
        (fields) => fields.sex
      )
    )
  );

  const chartData = useAreaChart(data, "reportDate", "age");
  console.log(chartData);

  if (!isLoading && chartData) {
    return <Chart chartData={chartData} />;
  }

  return (
    <Box>
      <Heading>Visualization Demo</Heading>
    </Box>
  );
};

export default App;
