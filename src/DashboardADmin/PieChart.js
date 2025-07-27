import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {

const [series, setSeries] = useState([]);
const [labels, setLabels] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("https://naturalbuti.onrender.com/fetchCutomerOrder");
      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid data format");
      }

      const monthlyEarnings = {};
      data.products.forEach(item => {
        const dateObj = new Date(item.date);
        const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        monthlyEarnings[key] = (monthlyEarnings[key] || 0) + (item.amount || 0);
      });

      const sortedKeys = Object.keys(monthlyEarnings).sort();

      const calculatedSeries = sortedKeys.map(key => monthlyEarnings[key]);
      const calculatedLabels = sortedKeys.map(key => {
        const [year, month] = key.split("-");
        const date = new Date(`${year}-${month}-01`);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' }) +
          ` (₹${monthlyEarnings[key].toLocaleString()})`;
      });

      setSeries(calculatedSeries);
      setLabels(calculatedLabels);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  fetchData();
}, []);


const options = {
chart: {
type: 'pie',
},
labels: labels,
tooltip: {
y: {
formatter: function(value) {
return `₹ ${value.toLocaleString()}`;
}
}
},
legend: {
position: 'right',
formatter: function(seriesName, opts) {
return `${seriesName}: ₹ ${opts.w.globals.series[opts.seriesIndex].toLocaleString()}`;
}
},
responsive: [{
breakpoint: 480,
options: {
chart: {
width: 300
},
legend: {
position: 'bottom'
}
}
}]
};

if (loading) {
return <div>Loading chart data...</div>;
}

if (series.length === 0) {
return <div>No data available for the chart.</div>;
}


return (


<div className="PieChart-container">

<h3 className="ChartsTg" >Monthly Earnings by PieChart</h3>
<label>Sales/Revenue</label>

<ReactApexChart 
options={options}
series={series}
type="pie"
className='PieChart'
id='PieChrt'
height={320}
/>

</div>

);

};

export default PieChart;
