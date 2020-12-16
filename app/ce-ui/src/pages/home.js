import React from "react";
import "./styles/home.css";
// import Loading from "../components/loading";

export default class Home extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Welcome to Catalyst Elite</h1>
        <p>
          Founded in 2006 and originally from Frostmourne, we are an 18+
          alliance raiding guild on Felstriker.
        </p>
        <p>
          We raid the latest Classic WoW content on{" "}
          <strong className="common">Monday and Wednesday</strong> between{" "}
          <strong className="common">7:30pm and 10:30pm</strong> each week.
        </p>
        <p>Congrats <strong className="artifact">Simulacrum</strong> on server first Scarab Lord!</p>
        <img className="image_box" src="./images/scablord.png" alt="Scablord"></img>
        <h1>Guild Values</h1>
        <ul>
          <li>Our raids are actually fun!</li>
          <li>We help each other</li>
          <li>We are not assholes</li>
          <li>We keep cool</li>
          <li>We put in the effort</li>
          <li>We enchant our “best in slot” gear</li>
          <li>We are prepared!</li>
        </ul>
        <h1>Guild Issues</h1>
        <ul>
          <li>If something’s bugging you, get it off your chest!</li>
          <li>
            Never make it personal. Personal attacks will not be tolerated :(
          </li>
        </ul>
        <h1>Guild Ranks</h1>
        <ul>
          <li>GM</li>
          <li>Officer</li>
          <li>Class Leader</li>
          <li>Veteran Raider</li>
          <li>Main Tank</li>
          <li>Raider</li>
          <li>Veteran Member</li>
          <li>Member</li>
          <li>Alt</li>
          <li>Trial</li>
        </ul>
        <h1>Rank Expectations</h1>
        <ul>
          <li>
          GM / Officers handle issues, lead raids and
        (hopefully) remember to enable master looter!
          </li>
          <li>Class Leaders handle
        class issues, class recruitment, class performance, class buffs and
        other class organisation for raids</li>
          <li>Main Tanks are at pretty much
        every raid. If they can't make it then must let us know so we can plan
        around it.</li>
          <li>Raiders (and above) are reliable and at most raids.</li>
          <li>Members (and below) are casual and are at some raids.</li>
          <li>Veteran Raiders
        are just Raiders that have been in CE for many years</li>
        <li>Veteran Members
        are just Members that have been in CE for many years</li>
        </ul>
      </div>
    );
  }
}
