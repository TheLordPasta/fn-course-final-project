// Chen Moasis 318912805
// Ariel Shirkani 207267824
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

function CostItemsReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch and update report data when startDate changes
    async function fetchReportData() {
      const date = startDate;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Open IndexedDB costs database
      const db = await window.idb.openCostsDB("costsdb", 1);
      try {
        // Fetch report data based on selected month and year
        const result = await db.CostItemsReport({ month: month, year: year });
        if (result) {
          console.log("report successfully fetched");
          setReportData(result);
        }
      } catch {
        console.log("Invalid input entered");
      }
    }

    fetchReportData();
  }, [startDate]);

  // Render the component's JSX content
  return (
    <div className="container mt-5">
      <h2>Cost Item Report</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="datePicker" className="form-label">
            Select Month and Year
          </label>
          <br></br>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="form-control"
            required
          />
        </div>
      </form>
      <div>
        <table
          className="table table-dark"
          variant="dark"
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.sum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CostItemsReport;
