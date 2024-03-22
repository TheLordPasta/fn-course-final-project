// App.js
import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddCostItemForm from "./components/AddCostItemForm";
import CostItemsReport from "./components/CostItemsReport";
import Blog from "./components/dashboard/Blog";
import Feeds from "./components/dashboard/Feeds";
import ProjectTable from "./components/dashboard/ProjectTable";
import YearlyCostsChart from "./components/dashboard/YearlyCostsChart";
import TopCards from "./components/dashboard/TopCards";
import "./idb/idb";

function App() {
  return (
    <div>
      <AddCostItemForm />
      <br></br>
      <CostItemsReport />
      <br></br>
      <YearlyCostsChart />
      <br></br>
    </div>
  );
}

export default App;
