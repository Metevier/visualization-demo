import React from "react";
import { Box, SimpleGrid, Heading } from "@chakra-ui/core";
import { Group } from "@vx/group";
import { GridRows, GridColumns } from "@vx/grid";
import { curveNatural } from "@vx/curve";
import { AreaStack } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GradientOrangeRed } from "@vx/gradient";
import { useTooltip, TooltipWithBounds } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { bisector } from "d3-array";

import "./Chart.css";

const date = (d) => new Date(d).valueOf();
const defaultMargin = { top: 40, right: 30, bottom: 50, left: 60 };
const areaColors = [
  "#FC8181",
  "#F6AD55",
  "#48BB78",
  "#4FD1C5",
  "#63B3ED",
  "#76E4F7",
  "#B794F4",
  "#F687B3",
  "#FAF089",
];

const Chart = ({ chartData, width, height, margin = defaultMargin }) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  if (chartData === null) return <div>Please specify chartData</div>;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const timeScale = chartData.timeScale.range([0, xMax]);
  const valueScale = chartData.valueScale.range([yMax, 0]);

  const bisectDate = bisector((d) => new Date(d.date)).left;
  const getKeyColor = (key) =>
    areaColors[chartData.areaFieldValues.indexOf(key)] ||
    "url(#stacked-area-orangered)";

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <GradientOrangeRed id="stacked-area-orangered" />
        <rect x={0} y={0} width={width} height={height} fill="rgba(0,0,0,0)" />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={valueScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={timeScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <AxisBottom
            top={yMax}
            scale={timeScale}
            numTicks={width > 520 ? 10 : 5}
          />
          <AxisLeft scale={valueScale} />
          <AreaStack
            data={chartData.data}
            curve={curveNatural}
            keys={chartData.areaFieldValues}
            x={(d) => timeScale(date(d.data.date))}
            y0={(d) => valueScale(isNaN(d[0]) ? 0 : d[0])}
            y1={(d) => valueScale(isNaN(d[1]) ? d[0] : d[1])}
          >
            {({ stacks, path }) =>
              stacks.map((stack) => (
                <path
                  key={`stack-${stack.key}`}
                  d={path(stack) || ""}
                  stroke="#222"
                  fill={getKeyColor(stack.key)}
                  strokeWidth={1}
                  strokeOpacity={0.8}
                  strokeDasharray="3,2"
                  onMouseMove={(event) => {
                    const coords = localPoint(
                      event.target.ownerSVGElement,
                      event
                    );
                    // Adds a bit of padding so the end date isnt exactly on the edge
                    const x = timeScale.invert(coords.x - margin.left + 5);
                    const index = bisectDate(chartData.data, x, 1);
                    showTooltip({
                      tooltipLeft: coords.x,
                      tooltipTop: coords.y,
                      tooltipData: chartData.data[index - 1],
                    });
                  }}
                  onMouseOut={hideTooltip}
                />
              ))
            }
          </AreaStack>
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <Heading size="sm" mb={1} textAlign="center">
            {tooltipData.date.split("T")[0]}
          </Heading>
          <SimpleGrid columns={2} spacing={2}>
            {chartData.areaFieldValues.map((value) =>
              tooltipData[value] !== undefined ? (
                <React.Fragment key={value}>
                  <Box>
                    <span
                      className="key-square"
                      style={{ backgroundColor: getKeyColor(value) }}
                    />
                    {value}
                  </Box>
                  <Box>
                    <strong>{tooltipData[value]}</strong>
                  </Box>
                </React.Fragment>
              ) : (
                ""
              )
            )}
          </SimpleGrid>
        </TooltipWithBounds>
      )}
    </div>
  );
};

export default Chart;
