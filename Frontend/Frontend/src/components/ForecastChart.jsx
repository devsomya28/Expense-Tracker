import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ForecastChart = ({ data }) => {
  const formattedData = (data || []).map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
      }
    ),
  }));

  if (formattedData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-sm text-zinc-500">
        No projection data available.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {/* =====================================
              GRADIENT
          ====================================== */}

          <defs>
            <linearGradient
              id="finoraForecastGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#8b5cf6"
                stopOpacity={0.3}
              />

              <stop
                offset="95%"
                stopColor="#8b5cf6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* =====================================
              GRID
          ====================================== */}

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#27272a"
          />

          {/* =====================================
              X AXIS
          ====================================== */}

          <XAxis
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#71717a",
            }}
            minTickGap={30}
          />

          {/* =====================================
              Y AXIS
          ====================================== */}

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#71717a",
            }}
            tickFormatter={(value) =>
              `$${Number(value).toLocaleString()}`
            }
          />

          {/* =====================================
              TOOLTIP
          ====================================== */}

          <Tooltip
            cursor={{
              stroke: "#3f3f46",
              strokeWidth: 1,
            }}
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#f4f4f5",
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
            labelStyle={{
              color: "#a1a1aa",
              marginBottom: "4px",
            }}
            itemStyle={{
              color: "#a78bfa",
            }}
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Projected Balance",
            ]}
          />

          {/* =====================================
              AREA
          ====================================== */}

          <Area
            type="monotone"
            dataKey="balance"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#finoraForecastGradient)"
            activeDot={{
              r: 5,
              fill: "#8b5cf6",
              stroke: "#09090b",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
