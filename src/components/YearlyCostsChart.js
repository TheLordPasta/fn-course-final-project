// Chen Moasis 318912805
// Ariel Shirkani 207267824
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
} from "reactstrap";
import Chart from "react-apexcharts";
import "../idb/idb";

const YearlyCostsChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State to keep track of the selected year
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "area",
        foreColor: "#ffffff",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#ffffff", // Brighter text for y-axis labels
          },
        },
      },
      tooltip: {
        theme: "dark", // Use the 'dark' theme for the tooltip
        x: {
          format: "MM",
        },
        y: {
          formatter: function (val) {
            return "$" + val;
          },
        },
      },
      title: {
        style: {
          color: "#ffffff", // Brighter text for chart title
        },
      },
    },
  });

  useEffect(() => {
    const fetchCostSummary = async (year) => {
      try {
        // Open IndexedDB costs database
        const db = await window.idb.openCostsDB("costsdb", 1);
        if (db) {
          const monthlySummaries = await db.yearlyCostSummaryByCategory(year);
          const seriesData = Object.keys(monthlySummaries[0]).map(
            (category) => ({
              name: category,
              data: monthlySummaries.map((month) => month[category]),
            })
          );
          // Update chartData state with fetched data
          setChartData((prevChartData) => ({
            ...prevChartData,
            series: seriesData,
          }));
        }
      } catch (error) {
        console.error("Problem with fetching yearly report:", error);
      }
    };

    fetchCostSummary(selectedYear); // Pass the selected year to the function
  }, [selectedYear]); // Depend on selectedYear to refetch data when it changes

  // Handler for year input change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  return (
    <Card className="bg-dark text-white">
      <CardBody>
        <CardTitle tag="h5">Cost Summary</CardTitle>
        {/* Year selection input */}
        <div className="mb-3">
          <Input
            className="input-container"
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            placeholder="Enter year"
            style={{ width: "auto" }}
          />
        </div>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartData.options}
          series={chartData.series}
        />
      </CardBody>
    </Card>
  );
};

export default YearlyCostsChart;
