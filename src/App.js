import React, { useState } from "react";
import { Center, Spinner, Heading } from "@chakra-ui/core";
import ParentSize from "@vx/responsive/lib/components/ParentSize";

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
        .between("2021-07-01", "2021-07-31");

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
    <>
      <Heading textAlign="center" my={5} size="lg">
        COVID-19 Positive Tests, July - Visualization Demo
      </Heading>
      <Filters fields={textFields} setFilter={setFilter} />
      <FieldSelector
        fields={textFields}
        setField={setAreaField}
        selectedField={areaField}
      />
      <Center width="100vw" height="75vh">
        {!isLoading && chartData ? (
          <ParentSize>
            {({ width, height }) => (
              <Chart chartData={chartData} width={width} height={height} />
            )}
          </ParentSize>
        ) : (
          <Spinner
            thickness="6px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
      </Center>
    </>
  );
};

export default App;
