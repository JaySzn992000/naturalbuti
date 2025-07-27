import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "monthly-earnings-line",
        toolbar: { show: false },
      },
      xaxis: {
        categories: [],
        labels: { rotate: -45 },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#00BFFF"],
      tooltip: {
        y: {
          formatter: (val) => `₹ ${val.toFixed(2)}`,  // ✅ formatted here
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => `₹ ${val.toFixed(2)}`,  // ✅ formatted here
        },
      },
    },
    series: [
      {
        name: "Earnings",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const customerFetch = async () => {
      try {
        const response = await fetch("https://naturalbuti.onrender.com/fetchCutomerOrder");
        const data = await response.json();

        const earningsByMonth = data.products.reduce((acc, item) => {
          const dateObj = new Date(item.date);
          const month = dateObj.toLocaleString("default", { month: "short" });
          const year = dateObj.getFullYear();
          const monthYear = `${month} ${year}`;
          acc[monthYear] = (acc[monthYear] || 0) + (item.amount || 0);
          return acc;
        }, {});

        const formattedData = Object.entries(earningsByMonth).map(([monthYear, total]) => ({
  monthYear,
  total: Number(total.toFixed(0)),  // 👈 No decimal
}));

setChartData((prevState) => ({
  ...prevState,
  options: {
    ...prevState.options,
    xaxis: {
      ...prevState.options.xaxis,
      categories: formattedData.map((item) => item.monthYear),
    },
    tooltip: {
      y: {
        formatter: (val) => `₹ ${val.toFixed(0)}`,  // 👈 No decimal
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹ ${val.toFixed(0)}`,  // 👈 No decimal
      },
    },
  },
  series: [
    {
      name: "Earnings",
      data: formattedData.map((item) => item.total),
    },
  ],
}));
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    customerFetch();
  }, []);

  return (
    <div className="linechart-container">
      <h3 className="ChartsTg">Monthly Earnings by LineChart</h3>
      <label>Sales/Revenue</label>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
        className="PieChart"
      />
    </div>
  );
};

export default LineChart;
