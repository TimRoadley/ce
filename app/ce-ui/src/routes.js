import React from "react";
import {
    Switch,
    Route,
    Redirect,
    BrowserRouter as Router
} from "react-router-dom";

import Players from "./pages/players";
import Player from "./pages/player";
import Home from "./pages/home";
import Loot from "./pages/loot";

const Routes = props => {
    return (
        <Router>
            <Switch>                
                <Route exact path="/players/:name" component={Player} />
                <Route exact path="/players" component={Players} />
                <Route exact path="/loot" component={Loot} />
                <Route exact path="/" component={Home} />
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};

export default Routes;
