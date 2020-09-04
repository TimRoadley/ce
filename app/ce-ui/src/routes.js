import React from "react";
import {
    Switch,
    Route,
    Redirect,
    BrowserRouter as Router
} from "react-router-dom";

import Standings from "./pages/standings";
import Player from "./pages/player";
import Home from "./pages/home";
import Loot from "./pages/loot";

const Routes = props => {
    return (
        <Router>
            <Switch>                
                <Route exact path="/loot/standings/:name" component={Player} />
                <Route exact path="/loot/standings" component={Standings} />
                <Route exact path="/loot" component={Loot} />
                <Route exact path="/" component={Home} />
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};

export default Routes;
