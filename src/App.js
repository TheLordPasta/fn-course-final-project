// App.js
import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCostItemForm from "./components/AddCostItemForm";
import CostItemsReport from "./components/CostItemsReport";
import "./idb/idb";

function App() {
  return (
    <div>
      <AddCostItemForm />
      <br></br>
      <CostItemsReport />
    </div>
  );
}

export default App;
