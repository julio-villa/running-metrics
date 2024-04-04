import React from 'react';
import './RunningStatsChart.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const RunningStatsChart = ({ data, stat }) => {
  return (
    <div className="running-stats-chart">
      <div className="chart-wrapper">
        <ResponsiveContainer height={400} width="100%" >
          <LineChart data={data} margin={{
            top: 5,
            right: 50, 
            left: 20,
            bottom: 5
          }}>
            <XAxis minTickGap={20} tick={{ fontSize: 13 }} interval='auto' dataKey="date" type="category" />
            <YAxis domain={[dataMin => ((dataMin * 0.9).toFixed(2)), dataMax => ((dataMax * 1.1).toFixed(2))]} dataKey={stat} type="number" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={stat} stroke="rgba(75, 192, 192, 1)" strokeWidth={2} name={stat} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RunningStatsChart;
