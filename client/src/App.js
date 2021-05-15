import { BrowserRouter, Route } from "react-router-dom";
import Devices from "./Devices";
import Metrics from "./Metrics";
import AddDevice from "./AddDevice";
import AddMetrics from "./AddMetrics";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter basename="/">
      <Route exact path="/register" component={ Register } />
      <Route exact path="/login" component={ Login } />
      <Route exact path="/devices/:id/metrics/addMetrics" component={ AddMetrics } />
      <Route exact path="/devices/add" component={ AddDevice } />
      <Route exact path="/devices" component={ Devices } />
      <Route exact path="/devices/:id/metrics" component={ Metrics } />
    </BrowserRouter>

  );
}

export default App;
