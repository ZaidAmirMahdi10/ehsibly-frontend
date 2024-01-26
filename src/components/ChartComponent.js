// ChartComponent.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ChartModal.scss';

const ChartComponent = ({ data, chartType }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy the previous chart instance when the component is mounted or data changes
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Calculate the total 'received' and 'left' values
    let totalReceived = 0; // Initialize to 0
    const totalLeft = data.reduce((sum, row) => sum + parseFloat(row.left), 0);

    // Add correct values to totalReceived
    data.forEach((row) => {
      // Remove spaces from 'received' values and then parse
      const receivedWithoutSpaces = row.received.replace(/\s/g, '');
      totalReceived += parseFloat(receivedWithoutSpaces);
    });

    // Create a new chart instance
    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: chartType, // Use the dynamic chart type
      data: {
        labels: ['Total Amount'], // Labels for the bars
        datasets: [
          {
            label: 'Received',
            data: [totalReceived],
            backgroundColor: 'rgba(222, 110, 18, 0.2)',
            borderColor: 'rgba(222, 110, 18, 1)',
            borderWidth: 1,
          },
          {
            label: 'Left',
            data: [totalLeft],
            backgroundColor: 'rgba(23, 147, 194, 0.2)',
            borderColor: 'rgba(23, 147, 194, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup when the component is unmounted
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, chartType]);

  return (
    <div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default ChartComponent;