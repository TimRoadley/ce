import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import { ceBench } from "../data/db-cebench";
import Loading from "../components/loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { organise, player_type } from "../helper/player-organiser";
import moment from "moment";
import "moment/min/locales";
import "moment-timezone";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles/bench.css";

export default class Bench extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // AVAILABLE RAIDERS
      prior_benches: [],
      roster:[],
      tanks: [],
      heals: [],
      dps: [],

      loading: true,

      bench_start_date: moment().subtract(21, "days").unix(),
      bench_end_date: moment().unix(),

      // ESTIMATE
      estimate: { raid_tanks: [], raid_heals: [], raid_dps: [], bench_tanks: [], bench_heals: [], bench_dps: [] },
    };
  }

  componentDidMount() {
    cePlayers().then((result) => {
      //console.info("PLAYERS TO BE ORGANISED", result);
      const x = organise(result);
      this.setState(
        {
          roster: x["roster"],
          tanks: x["tanks"],
          heals: x["heals"],
          dps: x["dps"],
        },
        () => {
          const bench_name = "raider";
          const start = this.state.bench_start_date;
          const end = this.state.bench_end_date;

          console.info(start, end);

          ceBench(bench_name, start, end).then((bench_history) => {
            this.setState({
              loading: false,
              prior_benches: bench_history,
              estimate: this.estimateRaid(bench_history),
            });
          });

          console.info("ORGANISING...");
        }
      );
    });
  }

  estimateRaid(bench_history) {

    // FILL RAID WITH HIGH PRIO RAIDERS
    var roster = Array.from(this.state.roster);
    console.info("ROSTER", roster);

    var raid_tanks = [];
    var raid_heals = [];
    var raid_dps = [];
    var bench_tanks = [];
    var bench_heals = [];
    var bench_dps = [];
    var benched_players = [];

    // PREPARE BENCH HISTORY
    for (var x in bench_history) {
        var h = bench_history[x];
        var players = h['players'];
        if (players!== undefined && players !== null) 
        for (var p in players ) {
            var player_name = players[p];
            // console.info("BENCHED PLAYER", player_name);
            benched_players.push(player_name)
        }
    }
    benched_players = Array.from(new Set(benched_players));
    
    // FILL RAID WITH BENCH HISTORY
    for (var z in roster) {
        var player = roster[z];
        if (benched_players.includes(player['name'])) {
            console.info("Putting",player['name'],"into the raid!");

            if (player_type(player) === "tank") {
                raid_tanks.push(player);
                roster.pop(player)
            }

            else if (player_type(player) === "heal") {
                raid_heals.push(player);
                roster.pop(player)
            }

            else if (player_type(player) === "dps") {
                raid_dps.push(player);
                roster.pop(player)
            }
        }
    }
    
    // MINIMUMS: 4 MT, 4 OT
    const min_maintanks = 4;
    const min_offtanks = 4

    // MINIMUMS: 10 Healers
    const min_resto_druids = 1;
    const min_pallys = 3;
    const min_priests = 3;
    const remaining_heal_spots = 3;

    // MINIMUMS: 22 DPS
    const min_warlocks = 4;
    const min_mages = 6;
    const min_hunters = 2;
    const min_rogues = 4;
    const remaining_dps_spots = 6;

    // FILL RAID MINIMUMS
    for (var w in roster) {
        var pl = roster[w];
        console.info("assessing",pl["name"], pl["latest_priority"]) 


        // TODO: FILL RAID MINIMUMS

    }

    // FILL RAID WITH HIGH PRIO REMAINDERS
    
    // TODO: FILL REMAINING SLOTS


    var estimate = {
      raid_tanks: raid_tanks,
      raid_heals: raid_heals,
      raid_dps: raid_dps,
      bench_tanks: bench_tanks,
      bench_heals: bench_heals,
      bench_dps: bench_dps,
      bench: roster.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ), // { latest_priority: 6.34, class: "Mage", name: "Frosty" }
    };

    return estimate;
  }

  render() {
    var benchmaster_9000_view;
    var bench_history_view;
    if (this.state.loading) {
      benchmaster_9000_view = <Loading />;
      bench_history_view = <div></div>;
    } else {
      var bench_history_view_columns = [
        {
          Header: () => <div style={{ textAlign: "left" }}>Date</div>,
          accessor: "bench_date",
          Cell: (props) => <div>{props.original.bench_date}</div>,
        },
        {
          Header: () => (
            <div style={{ textAlign: "left" }}>Benched Players</div>
          ),
          accessor: "bench_date",
          Cell: (props) => <div>{JSON.stringify(props.original.players)}</div>,
        },
      ];

      const raid_columns = [
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
      benchmaster_9000_view = (
        <div>
          <h1 className="legendary">PROJECTED BENCH</h1>
          Assuming everyone turns up next raid, here's what the bench would look
          like taking Raid Balance and Recently Benched Raiders into account.
          <div className="bench_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.estimate.bench_tanks.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.estimate.bench_tanks}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tanks)}
                  defaultPageSize={this.state.estimate.bench_tanks.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.estimate.bench_heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.estimate.bench_heals}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={this.state.estimate.bench_heals.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.estimate.bench_dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.estimate.bench_dps}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={this.state.estimate.bench_dps.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
            </ul>
          </div>
          <h1 className="legendary">PROJECTED RAID</h1>
          Assuming everyone turns up next raid, here's what the raid would look
          like taking Raid Balance and Recently Benched Raiders into account.
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/tanks.png`}
                    alt=""
                  ></img>
                  {this.state.estimate.raid_tanks.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.estimate.raid_tanks}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tanks)}
                  defaultPageSize={this.state.estimate.raid_tanks.length}
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
                  {this.state.estimate.raid_heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.estimate.raid_heals}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={this.state.estimate.raid_heals.length}
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
                  {this.state.estimate.raid_dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.estimate.raid_dps}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={this.state.estimate.raid_dps.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
            </ul>
          </div>
        </div>
      );
      bench_history_view = (
        <div>
          <ReactTable
            data={this.state.prior_benches}
            columns={bench_history_view_columns}
            showPagination={false}
            //pageSizeOptions={pageSizeOptions(this.state.dps)}
            defaultPageSize={this.state.prior_benches.length}
            minRows={0}
            className={"roles_table"}
          />
        </div>
      );
    }
    return (
      <div>
        <h1>Bench</h1>
        <p>This page guides us on who to bench, if required.</p>
        <p>
          No one wants to be benched (especially when they have high{" "}
          <strong className="artifact">Loot Priority</strong>) and no one wants
          to be in a poorly balanced and underperforming raid either.
        </p>
        <p className="common">
          To be considered a raider in the first place, we expect you to turn up
          regularly, enchant your gear and bring basic consumables.
        </p>
        <h2>Bench Priority</h2>
        <div
          style={{
            margin: "1% 15% 1% 15%",
            backgroundColor: "#111111",
            borderRadius: "10px",
            padding: "0px 10px 1px 10px",
            textAlign: "center",
          }}
        >
          <br />
          <h3>Assuming no impact to Raid Balance...</h3>
          <h3>
            <strong className="epic">Low Loot Priority Raiders</strong> &gt;{" "}
            <strong className="rare">Recently Benched Raiders</strong>
          </h3>
          <h4>... however volunteers are appreciated!</h4>
        </div>
        <Tabs>
          <TabList>
            <Tab>Benchmaster 9000&trade;</Tab>
            <Tab>Bench History</Tab>
            <Tab>Raid Balance + Bench Rules</Tab>
          </TabList>

          <TabPanel>
            <div>{benchmaster_9000_view}</div>
          </TabPanel>
          <TabPanel>
            <div>{bench_history_view}</div>
          </TabPanel>
          <TabPanel>
            <div>
              Our AQ strategies require the following tank, heal and dps roles.
              When overlaid with our current roster it looks like this:
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
                  src="./images/raid_slots.png"
                  alt="Raid Slots"
                ></img>
              </div>
              <h2>Assuming no one volunteers to be benched:</h2>
              We'll use the Benchmaster 9000&trade;, which:
              <ul>
                <li>Maintains Raid Balance.</li>
                <li>
                  Prioritises a spot for{" "}
                  <span className="rare">Recently Benched Raiders</span>.
                </li>
                <li>
                  Prioritises{" "}
                  <span className="epic">Low Loot Priority Raiders</span> to
                  role specific bench.
                </li>
              </ul>
              The output is just a guide, so volunteers could sit instead.
              <h2>If you are Benched</h2>
              <ul>
                <li>Thanks for ensuring we continue to have full raids!</li>
                <li>Rest assured you'll get a spot next clear.</li>
                <li>
                  If we're doing progression, the original raiders will take
                  precedence this lockout HOWEVER note that they might not turn
                  up, so please be available just in case. This issue will
                  dissapear when AQ is clear in 1 night (soon&trade;).
                </li>
                <li>
                  Post in <a href="https://discord.gg/rbM4Gwg">#raid-bench</a>{" "}
                  discord channel so we don't forget.
                </li>
              </ul>
              <h2>
                If you're not sure if you're benched (Raid Auto-Invite Fails)
              </h2>
              <ul>
                <li>Check that you aren't already in a group.</li>
                <li>
                  Ask on Discord who the raid leader is, in case it's changed,
                  then whisper "inv" to the leader.
                </li>
                <li>
                  If the raid is full post in the{" "}
                  <a href="https://discord.gg/rbM4Gwg">#raid-bench</a> discord
                  channel so we can organise the bench. Please be patient as
                  there's usually a lot happening at invite time!
                </li>
              </ul>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
