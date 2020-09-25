import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles/roster.css";
import { pageSizeOptions, defaultPageSize } from "../helper/pagination-helper";

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

      // SKIP
      if (
        ["Faceslicer", "Stepdadi", "Weechee", "Jeremypaxman"].includes(
          player_name
        )
      ) {
        console.info("skipped");
      }

      // TANKS
      else if (
        ["Hakan", "Sblades", "Inflict", "Pearbear", "Weedwakka"].includes(
          player_name
        )
      ) {
        tanks.push(player);
      }

      // SPECIFIC DPS
      else if (["Willikins"].includes(player_name)) {
        dps.push(player);
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
          Header: () => <div style={{ textAlign: "left" }}>Class</div>,
          accessor: "class",
          maxWidth: 60,
          Cell: (props) => (
            <span>
              <img
                src={`/images/IconSmall_${props.original.class}.gif`}
                alt=""
              ></img>
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
                  {this.state.tanks.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.tanks}
                  columns={columns}
                  showPagination={false}
                  pageSizeOptions={pageSizeOptions(this.state.tanks)}
                  defaultPageSize={defaultPageSize(this.state.tanks, 12)}
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
                  {this.state.heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.heals}
                  columns={columns}
                  showPagination={false}
                  pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={defaultPageSize(this.state.heals, 12)}
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
                  {this.state.dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.dps}
                  columns={columns}
                  showPagination={true}
                  pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={defaultPageSize(this.state.dps, 12)}
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
        {view}
        <h2>Raid Balance</h2>
        Our AQ strategies require the following roles, which when overlaid with
        our current roster looks something like this:
        <div
          style={{
            margin: "1%",
            borderRadius: "5px",
            padding: "0",
            textAlign: "center",
          }}
        >
          <img
            className="image_box"
            src="./images/slots.png"
            alt="Raid Slots"
          ></img>
        </div>
        <p>There is a tank, healer and dps bench.</p>
        <h2>Bench Priority</h2>
        <p>To work out who to bench we use this system:</p>
        <div
          style={{
            margin: "1% 10% 1% 10%",
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
        <h2>If you are Benched</h2>
        <ul>
          <li>Thanks for ensuring we continue to have full raids!</li>
          <li>Rest assured you'll get a spot next clear</li>
          <li>
            Be aware that if we're doing progression, the original raiders will
            take precedence this lockout HOWEVER note that they might not turn
            up, so please be available just in case. This issue will dissapear
            when AQ is clear in 1 night.
          </li>
          <li>
            Post in <a href="https://discord.gg/rbM4Gwg">#raid-bench</a> discord
            channel so we don't forget.
          </li>
        </ul>
        <h2>If you're not sure if you're benched (Raid Auto-Invite Fails)</h2>
        <ul>
          <li>Check that you aren't already in a group.</li>
          <li>
            Ask on Discord who the raid leader is, in case it's changed, then
            whisper "inv" to the leader.
          </li>
          <li>
            If the raid is full post in the{" "}
            <a href="https://discord.gg/rbM4Gwg">#raid-bench</a> discord channel
            so we can organise the bench. Please be patient as there's usually a
            lot happening at invite time!
          </li>
        </ul>
      </div>
    );
  }
}
