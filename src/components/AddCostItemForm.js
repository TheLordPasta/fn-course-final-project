import React from "react";

function AddCostItemForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you might handle the submission
  };

  return (
    <div className="container mt-5">
      <h2>Add Cost Item</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="inputSum" className="form-label">
            Sum
          </label>
          <input type="number" min="0" className="form-control" id="inputSum" />
        </div>
        <div className="mb-3">
          <label htmlFor="selectCategory" className="form-label">
            Category
          </label>
          <select
            id="selectCategory"
            name="selectCategory"
            className="form-control"
          >
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
          <input type="text" className="form-control" id="inputDescription" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddCostItemForm;
