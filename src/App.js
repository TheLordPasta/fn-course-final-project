import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import AddCostItemForm from "./components/AddCostItemForm";
import CostItemsReport from "./components/CostItemsReport";
import YearlyCostsChart from "./components/dashboard/YearlyCostsChart";

function App() {
  return (
    <Container fluid className="p-5" style={{ backgroundColor: "#121212" }}>
      {" "}
      {/* Dark background for the site */}
      <Row className="mb-5">
        <Col md={6} className="d-flex">
          <Card
            className="flex-grow-1 text-white"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            {" "}
            {/* Dark Card with light text */}
            <Card.Body>
              <AddCostItemForm />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex">
          <Card
            className="flex-grow-1 text-white"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            {" "}
            {/* Dark Card with light text */}
            <Card.Body>
              <CostItemsReport />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="text-white" style={{ backgroundColor: "#1e1e1e" }}>
            {" "}
            {/* Dark Card with light text */}
            <Card.Body>
              <YearlyCostsChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
