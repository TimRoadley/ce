import React from "react";
import "./styles/home.css";
import { cePlayers } from '../data/db-ceplayer';
// import Loading from "../components/loading";

export default class Players extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            players: [],
            isLoaded: false,
        }
    }

    componentDidMount() {
        
        cePlayers().then(result => {

            console.info("ITEMS", result);
        });

    }

    render() {
        return <div className="header">
            Test
    <br />

        </div>;
    }
}
