import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

function CostItemsReport() {
  const [startDate, setStartDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, handle the form submission, using startDate
    console.log(startDate); // Example of using the selected date
  };

  return (
    <div className="container mt-5">
      <h2>Cost Item Report</h2>
      <form onSubmit={handleSubmit}>
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
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CostItemsReport;
