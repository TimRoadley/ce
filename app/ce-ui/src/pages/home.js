import React from "react";
import "./styles/home.css";
// import Loading from "../components/loading";

export default class Home extends React.Component {
  componentDidMount() {}

  render() {
    return <div>
              <h1>
                Welcome to Catalyst Elite
              </h1>
              <p>Founded in 2006 and originally from Frostmourne, we are an 18+ alliance raiding guild on Felstriker.</p>
              <p>We raid the latest Classic WoW content on Monday and Wednesday nights from 7:30pm - 10:30pm each week</p>
              <p>Here's a picture of us, doing a thing:</p>
              <img className="image_box" src="./images/tf.jpg"></img>
              <p>We are currently recruiting a few more raiders for AQ, so we'd love to hear from you!</p>
          </div>

  }
}
