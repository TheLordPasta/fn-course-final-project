import React from "react";
import "../App.css";
import "../idb/idb.js";
import "../idb/idb.js";

function AddCostItemForm() {
  async function handleSubmit(e) {
    e.preventDefault();
    const userSum = parseFloat(document.getElementById("inputSum").value);
    const userCategory = document.getElementById("selectCategory").value;
    const userDescription = document.getElementById("inputDescription").value;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
    const currentYear = currentDate.getFullYear();
    document.getElementById("inputSum").value = "";
    document.getElementById("selectCategory").value = "OTHER";
    document.getElementById("inputDescription").value = "";

    const db = await window.idb.openCostsDB("costsdb", 1);
    try {
      const result = await db.addCost({
        sum: userSum,
        category: userCategory,
        description: userDescription,
        month: currentMonth,
        year: currentYear,
      });
      if (db) {
        console.log("opening db succeeded");
      }
      if (result) {
        console.log("adding cost succeeded");
      }
    } catch {
      console.log("Invalid input entered");
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Cost Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="inputSum" className="form-label">
                Sum
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                id="inputSum"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="selectCategory" className="form-label">
                Category
              </label>
              <select
                id="selectCategory"
                name="selectCategory"
                className="form-control"
                required
              >
                <option invalid value="">
                  Choose...
                </option>
                <option value="FOOD">FOOD</option>
                <option value="HEALTH">HEALTH</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="TRAVEL">TRAVEL</option>
                <option value="HOUSING">HOUSING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="inputDescription" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="inputDescription"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCostItemForm;
