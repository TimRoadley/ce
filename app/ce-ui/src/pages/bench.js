import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import { ceBench } from "../data/db-cebench";
import Loading from "../components/loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  organise,
  sort_by_lp,
  sort_by_lp_desc,
  populate_raid_with_bench,
  populate_raid_with_minimums,
  populate_raid_with_remaining_bench,
  populate_raid_with_remainder,
  recently_benched_players,
} from "../helper/player-organiser";
import { replaceAll } from "../helper/string-helper";
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
      /* roster: [],
      tanks: [],
      heals: [],
      dps: [], */

      loading: true,

      bench_start_date: moment().subtract(30, "days").unix(),
      bench_end_date: moment().unix(),

      raid_balance_settings: {
        // MINIMUMS: 4 MT, 2 OT
        min_maintanks: 4,
        min_offtanks: 2,
        max_maintanks: 4,
        max_offtanks: 2,

        // MINIMUMS: 10 Healers
        min_resto_druids: 1,
        min_paladins: 3,
        min_priests: 3,
        max_heals: 10,

        // MINIMUMS: 22 DPS
        min_warlocks: 4,
        min_mages: 6,
        min_hunters: 3,
        min_rogues: 6,
        min_shadow: 0,
        min_feral: 0,
        max_dps: 22,
      },

      // ESTIMATE
      raid_and_bench: {
        raid: { tank: [], offtank: [], heal: [], dps: [] },
        bench: { tank: [], offtank: [], heal: [], dps: [] },
      },
    };
  }

  componentDidMount() {
    cePlayers().then((result) => {
      const bench_name = "raider";
      const start = this.state.bench_start_date;
      const end = this.state.bench_end_date;
      console.info("BENCH RANGE", start, end);
      ceBench(bench_name, start, end).then((bench_history) => {
        console.info("PRIOR BENCH", bench_history);
        this.setState({
          loading: false,
          prior_benches: bench_history.sort(
            (a, b) => (b.recorded > a.recorded) - (b.recorded < a.recorded)
          ),
          raid_and_bench: this.estimateRaid(bench_history, organise(result)),
        });
      });
    });
  }
  estimateRaid(history, raiders) {
    // START WITH EMPTY RAID + EVERYONE ON THE BENCH
    var rb = {
      raid: { tank: [], offtank: [], heal: [], dps: [] },
      bench: { tank: [], offtank: [], heal: [], dps: [] },

      available: {
        tank: Array.from(raiders.tank),
        offtank: Array.from(raiders.offtank),
        heal: Array.from(raiders.heal),
        dps: Array.from(raiders.dps),
      },
      roster: Array.from(raiders.roster),
      recently_benched: recently_benched_players(
        history,
        Array.from(raiders.roster)
      ),
    };

    // PUT BENCH IN RAID (RESPECT CLASS MINIMUMS)
    rb = populate_raid_with_bench(rb, this.state.raid_balance_settings);

    // POPULATE RAID WITH CLASS MINIMUMS
    rb = populate_raid_with_minimums(rb, this.state.raid_balance_settings);

    // POPULATE RAID WITH REMAINING BENCH
    rb = populate_raid_with_remaining_bench(
      rb,
      this.state.raid_balance_settings
    );

    // POPULATE RAID WITH REMAINDER OF HIGH LP
    rb = populate_raid_with_remainder(rb, this.state.raid_balance_settings);

    // SORT
    sort_by_lp(rb.raid.tank);
    sort_by_lp(rb.raid.offtank);
    sort_by_lp(rb.raid.heal);
    sort_by_lp(rb.raid.dps);
    sort_by_lp_desc(rb.available.tank);
    sort_by_lp_desc(rb.available.offtank);
    sort_by_lp_desc(rb.available.heal);
    sort_by_lp_desc(rb.available.dps);

    // RETURN ESTIMATE
    console.info(rb);
    return rb;
  }

  render() {
    var benchmaster_9000_view;
    var raidmaster_9000_view;
    var bench_history_view;
    if (this.state.loading) {
      benchmaster_9000_view = <Loading />;
      raidmaster_9000_view = <Loading />;
      bench_history_view = <div></div>;
    } else {
      var bench_history_view_columns = [
        {
          Header: () => <div style={{ textAlign: "left" }}> </div>,
          accessor: "bench_date",
          Cell: (props) => <div>{props.original.bench_date}</div>,
          maxWidth: 200,
        },
        {
          Header: () => <div style={{ textAlign: "left" }}> </div>,
          accessor: "bench_date",
          Cell: (props) => (
            <div>
              {replaceAll(
                replaceAll(
                  replaceAll(
                    replaceAll(JSON.stringify(props.original.players), '"', ""),
                    "[",
                    ""
                  ),
                  "]",
                  ""
                ),
                ",",
                ", "
              )}
            </div>
          ),
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
          <h1 className="legendary">Bench Priority</h1>
          Assuming everyone turns up, here's what the bench would look like
          while taking the following into account:
          <ul>
            <li>
              Maintain <span className="common">Raid Balance</span>.
            </li>
            <li>
              Prioritise a spot for{" "}
              <span className="rare">Recently Benched Raiders</span>.
            </li>
            <li>
              Fill with remaining{" "}
              <span className="epic">High Loot Priority Raiders</span>.
            </li>
          </ul>
          Please note that the original raiders will take precedence this lockout however they also might not turn up, so please be available just in case. This issue will dissapear when AQ is clear in 1 night (soon™).
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.available.tank.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.available.tank}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tank)}
                  defaultPageSize={
                    this.state.raid_and_bench.available.tank.length
                  }
                  minRows={0}
                  className={"roles_table"}
                  NoDataComponent={() => null}
                />

                {/*  <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.available.offtank.length} Offtanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.available.offtank}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tank)}
                  defaultPageSize={
                    this.state.raid_and_bench.available.offtank.length
                  }
                  minRows={0}
                  className={"roles_table"}
                /> */}
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.available.heal.length} Heals
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.available.heal}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={
                    this.state.raid_and_bench.available.heal.length
                  }
                  minRows={0}
                  className={"roles_table"}
                  NoDataComponent={() => null}
                />
              </li>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/bench.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.available.dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.available.dps}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
                  defaultPageSize={
                    this.state.raid_and_bench.available.dps.length
                  }
                  minRows={0}
                  className={"roles_table"}
                  NoDataComponent={() => null}
                />
              </li>
            </ul>
          </div>
        </div>
      );
      raidmaster_9000_view = (
        <div>
          <h1 className="legendary">Raid Priority</h1>
          Assuming everyone turns up, here's what the raid would look like while
          taking the following into account:
          <ul>
            <li>
              Maintain <span className="common">Raid Balance</span>.
            </li>
            <li>
              Prioritise a spot for{" "}
              <span className="rare">Recently Benched Raiders</span>.
            </li>
            <li>
              Fill with remaining{" "}
              <span className="epic">High Loot Priority Raiders</span>.
            </li>
          </ul>
          <div className="role_layout">
            <ul>
              <li>
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/tanks.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.raid.tank.length} Tanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.raid.tank}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tank)}
                  defaultPageSize={this.state.raid_and_bench.raid.tank.length}
                  minRows={0}
                  className={"roles_table"}
                />
                <h2>
                  <img
                    className="role_icon"
                    src={`/images/tanks.png`}
                    alt=""
                  ></img>
                  {this.state.raid_and_bench.raid.offtank.length} Offtanks
                </h2>

                <ReactTable
                  data={this.state.raid_and_bench.raid.offtank}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.tank)}
                  defaultPageSize={
                    this.state.raid_and_bench.raid.offtank.length
                  }
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
                  {this.state.raid_and_bench.raid.heal.length} Heals
                </h2>
                <ReactTable
                  data={this.state.raid_and_bench.raid.heal}
                  columns={raid_columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
                  defaultPageSize={this.state.raid_and_bench.raid.heal.length}
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
        </div>
      );
      bench_history_view = (
        <div>
          <h2 className="rare">Recently Benched Raiders</h2>
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
{/*         <h2>Bench Priority</h2>
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
          <h3>
            Assuming no impact to <span className="common">Raid Balance</span>
          </h3>
          <h3>
            <strong className="epic">Low Loot Priority Raiders</strong> &gt;{" "}
            <strong className="rare">Recently Benched Raiders</strong>
          </h3>
          <h4>... however volunteers are appreciated!</h4>
        </div> */}
        <Tabs>
          <TabList>
            <Tab>Benchmaster 9000&trade;</Tab>
            <Tab>Raidmaster 9000&trade;</Tab>
            <Tab>Raid Balance</Tab>
            <Tab>Benching Process</Tab>
          </TabList>

          <TabPanel>
            <div className="tab_content">
              {benchmaster_9000_view}
              {bench_history_view}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="tab_content">{raidmaster_9000_view}</div>
          </TabPanel>
          <TabPanel>
            <div className="tab_content">
              <h1 className="legendary">How do we balance our raids?</h1>
              Our strategies require a maximum of:
              <ul>
                <li>4 Main-tanks</li>
                <li>4 Off-tanks</li>
                <li>22 DPS</li>
                <li>10 Healers</li>
              </ul>
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
            </div>
          </TabPanel>
          <TabPanel>
            <div className="tab_content">
              <h1 className="legendary">You're not benched...</h1>
              <span className="legendary">
                ... until the raid leader confirms you're benched in{" "}
                <a href="https://discord.gg/rbM4Gwg">#raid-bench</a>
              </span>
              <br />
              <br />
              In the mean time, if auto-invite fails:
              <ul>
                <li>Check you aren't already in a group.</li>
                <li>
                  Ask on Discord who the raid leader is, in case it's changed,
                  then whisper only "inv" to the leader.
                </li>
                <li>
                  Post in <a href="https://discord.gg/rbM4Gwg">#raid-bench</a>{" "}
                  asking if you're benched.
                </li>
                <li>
                  Be patient as there's usually a lot happening at invite time.
                </li>
              </ul>
              If we're legitimately full, we may kick and reinvite people a few
              times while we get the balance right so STAY ONLINE.
              <br />
              <br />
              To decide who to bench, we'll use the Benchmaster 9000&trade;,
              however other factors we have not considered may come up, so that
              should be treated as a guide only.
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
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
