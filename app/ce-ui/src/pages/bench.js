import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import { ceBench } from "../data/db-cebench";
import Loading from "../components/loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  organise,
  player_names,
  recently_benched_players,
  add_player_to_raid,
} from "../helper/player-organiser";
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
      roster: [],
      tanks: [],
      heals: [],
      dps: [],

      loading: true,

      bench_start_date: moment().subtract(21, "days").unix(),
      bench_end_date: moment().unix(),

      raid_balance_settings: {
        // MINIMUMS: 4 MT, 4 OT
        min_maintanks: 4,
        min_offtanks: 4,
        max_tanks: 8,
        // MINIMUMS: 10 Healers
        min_resto_druids: 1,
        min_paladins: 3,
        min_priests: 3,
        max_heals: 10,
        // MINIMUMS: 22 DPS
        min_warlocks: 4,
        min_mages: 6,
        min_hunters: 2,
        min_rogues: 4,
        min_shadow: 1,
        min_feral: 1,
        max_dps: 22,
      },

      // ESTIMATE
      raid_and_bench: {
        raid: { tanks: [], heals: [], dps: [] },
        bench: { tanks: [], heals: [], dps: [] },
      },
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

          // console.info(start, end);

          ceBench(bench_name, start, end).then((bench_history) => {
            this.setState({
              loading: false,
              prior_benches: bench_history,
              raid_and_bench: this.estimateRaid(bench_history),
            });
          });

          console.info("ORGANISING...");
        }
      );
    });
  }

  estimateRaid(bench_history) {
    // START WITH EMPTY RAID + EVERYONE ON THE BENCH
    var raid_and_bench = {
      raid: { tanks: [], heals: [], dps: [] },
      bench: {
        tanks: Array.from(this.state.tanks),
        heals: Array.from(this.state.heals),
        dps: Array.from(this.state.dps),
      },
      roster: Array.from(this.state.roster),
      recently_benched: recently_benched_players(bench_history),
    };

    // ADD RECENTLY BENCHED PLAYERS TO RAID
    const benched = recently_benched_players(bench_history);
    console.info("BENCHED", benched);
    for (var x in benched) {
      const player_name = benched[x];
      // console.info("TRYING to add", player_name);
      raid_and_bench = add_player_to_raid(
        player_name,
        raid_and_bench,
        this.state.raid_balance_settings
      );
    }

    console.info("remaining_bench", raid_and_bench.recently_benched);

    // SORT BY LP
    raid_and_bench.bench.dps.sort(
      (a, b) =>
        (b.latest_priority > a.latest_priority) -
        (b.latest_priority < a.latest_priority)
    );

    // FILL MINIMUMS FOR DPS
    for (var d in raid_and_bench.bench.dps) {
      raid_and_bench = add_player_to_raid(
        raid_and_bench.bench.dps[d]["name"],
        raid_and_bench,
        this.state.raid_balance_settings
      );
    }

    // FILL MINIMUMS FOR TANKS
    for (var t in raid_and_bench.bench.tanks) {
      raid_and_bench = add_player_to_raid(
        raid_and_bench.bench.tanks[t]["name"],
        raid_and_bench,
        this.state.raid_balance_settings
      );
    }

    // FILL MINIMUMS FOR HEALS
    for (var h in raid_and_bench.bench.heals) {
      raid_and_bench = add_player_to_raid(
        raid_and_bench.bench.heals[h]["name"],
        raid_and_bench,
        this.state.raid_balance_settings
      );
    }

    // FILL FLEX SLOTS WITH REMAINING BENCH

    // FILL FLEX SLOTS WITH HIGHEST LP

    // RETURN ESTIMATE
    return raid_and_bench;
  }

  OLDestimateRaid(bench_history) {
    // START WITH EVERYONE ON THE BENCH
    var bench_tanks = Array.from(this.state.tanks);
    var bench_heals = Array.from(this.state.heals);
    var bench_dps = Array.from(this.state.dps);

    // START WITH EMPTY RAID
    var raid_tanks = [];
    var raid_heals = [];
    var raid_dps = [];

    //var raid_tanks_names = [];
    //var raid_heals_names = [];
    var raid_dps_names = [];

    // GET NAMES
    var available_dps_names = player_names(bench_dps);
    console.info("available_dps_names", available_dps_names);

    console.info("recently_benched_players", recently_benched_players);

    console.info("raid_dps_names", raid_dps_names);

    /* 

    // START WITH EVERYONE ON THE BENCH
    var bench_tanks = Array.from(this.state.tanks);
    var bench_heals = Array.from(this.state.heals);
    var bench_dps = Array.from(this.state.dps);

    // START WITH NO ONE IN THE RAID
    var raid_tanks = [];
    var raid_heals = [];
    var raid_dps = [];



    // FILL RAID WITH TANKS FROM BENCH HISTORY
    for (var bench_tank_i in this.state.tanks) {
      const _bench_tank = this.state.tanks[bench_tank_i];
      if (recently_benched_players.includes(_bench_tank["name"])) {
        raid_tanks.push(_bench_tank); // Add to raid
        bench_tanks.pop(_bench_tank); // Remove from bench
      }
    }

    // FILL RAID WITH HEALERS FROM BENCH HISTORY
    for (var bench_heal_i in this.state.heals) {
      const _bench_heal = this.state.heals[bench_heal_i];
      if (recently_benched_players.includes(_bench_heal["name"])) {
        raid_heals.push(_bench_heal); // Add to raid
        bench_heals.pop(_bench_heal); // Remove from bench
      }
    }


 */

    // FILL RAID MINIMUMS
    /*     for (var w in roster) {
        var pl = roster[w];
        var pt = player_type(pl);
        console.info("assessing",pt, pl["class"],pl["name"], pl["latest_priority"]) 

        // TODO: FILL RAID MINIMUMS
        if (pt === "tank") {

            if (raid_tanks.length < min_maintanks) {
                raid_tanks.push(pl);
                roster.pop(pl);
            } else {
                console.info("TANK SPOTS FULL");
            }
        } else {
            console.info(pl["name"], "is not a tank");
        }

    } */

    // FILL RAID WITH HIGH PRIO REMAINDERS

    // TODO: FILL REMAINING SLOTS
    /*     for (var r in roster) {
        const _player = roster[r];
        const _player_type = player_type(_player)
        console.info("REMAINING",_player_type, _player["class"],_player["name"], _player["latest_priority"])
    } */

    var estimate = {
      raid_tanks: raid_tanks.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      raid_heals: raid_heals.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      raid_dps: raid_dps.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      bench_tanks: bench_tanks.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      bench_heals: bench_heals.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
      bench_dps: bench_dps.sort(
        (a, b) =>
          (a.latest_priority > b.latest_priority) -
            (a.latest_priority < b.latest_priority) ||
          (a.name > b.name) - (a.name < b.name)
      ),
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
          <h1 className="legendary">Raid Priority</h1>
          Assuming everyone turns up next raid, here's what it might look like
          taking Raid Balance and Recently Benched Raiders into account.
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/tanks.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.raid.tanks.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.raid.tanks}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tanks)}
                  defaultPageSize={this.state.raid_and_bench.raid.tanks.length}
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
                  {this.state.raid_and_bench.raid.heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.raid.heals}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={this.state.raid_and_bench.raid.heals.length}
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
                  {this.state.raid_and_bench.raid.dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.raid.dps}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={this.state.raid_and_bench.raid.dps.length}
                  minRows={0}
                  className={"roles_table"}
                />
              </li>
            </ul>
          </div>
          <h1 className="legendary">Bench Priority</h1>
          Assuming everyone turns up next raid, here's what the bench might look
          like taking Raid Balance and Recently Benched Raiders into account.
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.bench.tanks.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.bench.tanks}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tanks)}
                  defaultPageSize={this.state.raid_and_bench.bench.tanks.length}
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
                  {this.state.raid_and_bench.bench.heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.bench.heals}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={this.state.raid_and_bench.bench.heals.length}
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
                  {this.state.raid_and_bench.bench.dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.bench.dps}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={this.state.raid_and_bench.bench.dps.length}
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
            <div className="tab_content">{benchmaster_9000_view}</div>
          </TabPanel>
          <TabPanel>
            <div className="tab_content">{bench_history_view}</div>
          </TabPanel>
          <TabPanel>
            <div className="tab_content">
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
