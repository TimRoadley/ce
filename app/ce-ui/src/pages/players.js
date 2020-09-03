import React from "react";
import "./styles/home.css";
import { cePlayers } from '../data/db-ceplayer';
import Loading from "../components/loading";
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Players extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            players: [],
            loading: true,
        }
    }

    componentDidMount() {

        cePlayers().then(result => {

            console.info("ITEMS", result);
        });

        this.setState({
            loading: false
        })
    }

    render() {
        var view;
        if (this.state.loading) { view = <Loading /> }
        else {
            view = <div>
                Insert table
            </div>
        }



        return <div>{view}</div>
    }
}
