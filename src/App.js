import React, { useState } from "react";
import { Box, Heading } from "@chakra-ui/core";
import Chart from "./components/Chart";
import FieldSelector from "./components/FieldSelector";
import useDataSource, { withFilter } from "./hooks/useDataSource";
import useAreaChart from "./hooks/useAreaChart";
import dataSource from "./dataSources/cdcCovid";

const App = () => {
  const [areaField, setAreaField] = useState(dataSource.sex.name);
  const { isLoading, data } = useDataSource(
    withFilter(dataSource, (builder) =>
      builder.select(
        (fields) => fields.reportDate,
        (fields) => fields[areaField]
      )
    )
  );

  const chartData = useAreaChart(data, "reportDate", areaField);
  const textFields = Object.values(dataSource).filter(
    (d) => d.__fieldType === "text"
  );

  return (
    <Box>
      <Heading>Visualization Demo</Heading>
      <FieldSelector fields={textFields} setField={setAreaField} />
      {!isLoading && chartData ? <Chart chartData={chartData} /> : ""}
    </Box>
  );
};

export default App;
