import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {
  
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      labels: [],
      legend: {
        position: 'bottom',
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "₹ " + val;
          },
        },
      },
      colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#3F51B5", "#546E7A"],
    },
  });

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const response = await fetch("https://naturalbuti.onrender.com/fetchCutomerOrder");
        const data = await response.json();

        const earningsByMonth = data.products.reduce((acc, item) => {
          const dateObj = new Date(item.date);
          const month = dateObj.toLocaleString('default', { month: 'short' });
          const year = dateObj.getFullYear();
          const monthYear = `${month} ${year}`;
          acc[monthYear] = (acc[monthYear] || 0) + (Number(item.amount) || 0);
          return acc;
        }, {});

        const monthLabels = Object.keys(earningsByMonth);
        const monthTotals = Object.values(earningsByMonth);

        console.log("Labels:", monthLabels);
        console.log("Series:", monthTotals);

        setChartData((prev) => ({
          ...prev,
          series: monthTotals,
          options: {
            ...prev.options,
            labels: monthLabels,
          },
        }));
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchCustomerOrders();
  }, []);

  return (
    <div className="chart-container">
      <h3 className="ChartsTg">Monthly Earnings by PieChart</h3>
      <label>Sales/Revenue</label>
      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          className="PieChart"
          height={350}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default PieChart;
