import React from "react";
import Routes from "./routes";
import "./App.css";

function App(props) {
  return (
    <div>
      <div className="navbar">
        <ul>
          <li className="logo">
            <a href="/">
              <img src="/favicon-32x32.png" alt="CE" />
            </a>
          </li>
          <li>
            <a href="/loot">Loot Rules</a>
          </li>
          <li>
            <a href="/loot/standings">Loot Standings</a>
          </li>
          <li className="float_right">
            <a href="https://discord.gg/p77AYmb">Discord</a>
          </li>
          <li className="float_right">
            <a href="https://classicguildbank.com/#/guild/readonly/itkkB083HkClcuKgJiHADQ">
              Bank
            </a>
          </li>
          <li className="float_right">
            <a href="https://classic.warcraftlogs.com/guild/reports-list/487580/">
              Logs
            </a>
          </li>
        </ul>
      </div>
      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
