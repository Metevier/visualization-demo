import React from "react";
import { Group } from "@vx/group";
import { GridRows, GridColumns } from "@vx/grid";
import { curveNatural } from "@vx/curve";
import { AreaStack } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GradientOrangeRed } from "@vx/gradient";

const date = (d) => new Date(d).valueOf();
const defaultMargin = { top: 40, right: 30, bottom: 50, left: 60 };

const Chart = ({ chartData, margin = defaultMargin }) => {
  if (chartData === null) return <div>Please specify chartData</div>;

  const width = 1200;
  const height = 800;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const timeScale = chartData.timeScale.range([0, xMax]);
  const valueScale = chartData.valueScale.range([yMax, 0]);

  return (
    <div>
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
            stroke="#222"
            fill="url(#stacked-area-orangered)"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
        </Group>
      </svg>
    </div>
  );
};

export default Chart;
