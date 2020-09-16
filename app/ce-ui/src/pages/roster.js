import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles/roster.css";

export default class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanks: [],
      heals: [],
      dps: [],
      loading: true,
    };
  }

  componentDidMount() {
    cePlayers().then((result) => {
      console.info("ITEMS", result);
      this.organise(result);
    });
  }

  organise(result) {
    var tanks = [];
    var heals = [];
    var dps = [];

    for (var x in result) {
      const player = result[x];
      const player_name = player["name"];
      const player_class = player["class"];

      // TANKS
      if (
        ["Hakan", "Sblades", "Inflict", "Pearbear", "Weedwakka"].includes(
          player_name
        )
      ) {
        tanks.push(player);
      }

      // HEALERS
      else if (
        player_class === "Paladin" ||
        player_class === "Priest" ||
        ["Agiel"].includes(player_name)
      ) {
        heals.push(player);
      }

      // DPS
      else {
        dps.push(player);
      }
    }

    this.setState({
      loading: false,
      tanks: tanks.sort(
        (a, b) =>
          (b.latest_priority > a.latest_priority) -
            (b.latest_priority < a.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      heals: heals.sort(
        (a, b) =>
          (b.latest_priority > a.latest_priority) -
            (b.latest_priority < a.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      dps: dps.sort(
        (a, b) =>
          (b.latest_priority > a.latest_priority) -
            (b.latest_priority < a.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
    });
  }

  render() {
    var view;
    if (this.state.loading) {
      view = <Loading />;
    } else {
      const columns = [
        {
          Header: () => <div style={{ textAlign: "left" }}>Loot Priority</div>,
          accessor: "latest_priority",
          maxWidth: 100,
          Cell: (props) => (
            <span className="artifact">
              <strong>{props.original.latest_priority}</strong>{" "}
            </span>
          ),
        },
        {
          Header: () => <div style={{ textAlign: "left" }}>Character</div>,
          accessor: "name",
          Cell: (props) => (
            <span className={props.original.class}>
              <div>
                <Link
                  className={`${props.original.class}`}
                  to={`/loot/standings/${props.original.name}`}
                >
                  {props.original.name}
                </Link>
              </div>
            </span>
          ),
        },
      ];
      view = (
        <div>
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/tanks.png`}
                    alt=""
                  ></img>
                  Tanks
                </h2>

                <ReactTable
                  data={this.state.tanks}
                  columns={columns}
                  showPagination={false}
                  defaultPageSize={this.state.tanks.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/heals.png`}
                    alt=""
                  ></img>
                  Heals
                </h2>
                <ReactTable
                  data={this.state.heals}
                  columns={columns}
                  showPagination={false}
                  defaultPageSize={this.state.heals.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/dps.png`}
                    alt=""
                  ></img>
                  DPS
                </h2>
                <ReactTable
                  data={this.state.dps}
                  columns={columns}
                  showPagination={false}
                  defaultPageSize={this.state.dps.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
            </ul>
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>Roster</h1>
        <p>
          This page shows our current roster and is used to inform the decision
          around who to bench, in case 40+ raiders turn up.
        </p>
        <p>
          No one wants to be benched (especially when they have high{" "}
          <strong className="artifact">Loot Priority</strong>) and no one wants
          to be in a poorly balanced and underperforming raid.
        </p>
        <p className="common">
          To be considered a raider in the first place, we expect you to turn up
          regularly, enchant your gear and bring basic consumables.
        </p>
        <h2>Raid Balance</h2>
        Our AQ strategies require the following roles:
        <ul className="legendary">
          <li>Minimum 8 healers (Prefer exactly 10)</li>
          <li>Minimum 4 tanks (Duh)</li>
          <li>Minimum 4 off tanks (C'thun)</li>
          <li>Minimum 6 mages (Ignite uptime)</li>
          <li>Minimum 2 warlocks (Who can both tank twin emps)</li>
          <li>Minimum 2 hunters (Soaker NR, Prefer 3)</li>
          <li>Minimum 4 rogues (Prefer 8 for double stuns on Sartura)</li>
        </ul>
        <p>The bare minimum spots we need to reserve by name are:</p>
        <ul className="epic">
          <li>Damo (Raid Leader)</li>
          <li>Willikins (Loot Master)</li>
          <li>Agiel (Strats, imp MOTW, Backup Raid Leader + Loot Master)</li>
        </ul>
        <p>
          We also need someone to log the raid so any of Sivin, Spus, Journalist
          or Borettoo should be in the raid.
        </p>
        <h2>Recently Benched Raiders</h2>
        <p>Please see the <a href="https://discord.gg/rbM4Gwg">#raid-bench</a> channel in our discord.</p>
        <h2>Bench Priority</h2>
        <div
          style={{
            margin: "5% 10% 5% 10%",
            backgroundColor: "#111111",
            borderRadius: "5px",
            padding: "0px 10px 10px 10px",
            textAlign: "center",
          }}
        >
          <br />
          <h3>Assuming no impact to Raid Balance</h3>

          <strong className="legendary">Bench Volunteers</strong>
          <br />
          <strong>&gt;</strong>
          <br />
          <strong className="epic">Low Loot Priority Raiders</strong>
          <br />
          <strong>&gt;</strong>
          <br />
          <strong className="rare">Recently Benched Raiders</strong>
          <br />
          <br />
        </div>
        {view}
      </div>
    );
  }
}
