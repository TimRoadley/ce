import React from "react";
import "./styles/home.css";
// import Loading from "../components/loading";

export default class Player extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
        player: this.props.match.params.name,
        isLoaded: false,
    }
}
  
  componentDidMount() {}

  render() {
    return <div className="header"> 
    {this.state.player}
    </div>;
  }
}
