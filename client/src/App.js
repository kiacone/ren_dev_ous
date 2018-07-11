import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import YouTube from "./pages/YouTube";
import Books from "./pages/Books";
import Podcasts from "./pages/Podcasts";
// import NoMatch from "./pages/NoMatch";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dashboard/articles" component={Articles} />
        <Route exact path="/dashboard/youtube" component={YouTube} />
        <Route exact path="/dashboard/books" component={Books} />
        <Route exact path="/dashboard/podcasts" component={Podcasts} />
        {/* <Route component={NoMatch} /> */}
      </Switch>
    </div>
  </Router>
);

export default App;
