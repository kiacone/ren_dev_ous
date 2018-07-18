import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={SignIn} />
        <Route path = "/dashboard/:id" component={Dashboard} />
      </Switch>
    </div>
  </Router>
);

export default App;