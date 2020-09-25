import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import { ceBench } from "../data/db-cebench";
import Loading from "../components/loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { organise } from "../helper/player-organiser";
import moment from "moment";
import "moment/min/locales";
import "moment-timezone";

export default class Bench extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // AVAILABLE RAIDERS
      prior_benches: [],
      tanks: [],
      heals: [],
      dps: [],

      loading: true,

      bench_start_date: moment().subtract(28, "days").unix(),
      bench_end_date: moment().unix(),

      // 4 MT, 4 OT
      min_maintanks: 4,
      min_offtanks: 4,

      // 10 Healers
      min_resto_druids: 1,
      min_pallys: 3,
      min_priests: 3,
      remaining_heal_spots: 3,

      // DPS
      min_warlocks: 4,
      min_mages: 6,
      min_hunters: 2,
      min_rogues: 4,
      remaining_dps_spots: 6,

      // ESTIMATE
      estimate: { raid: [], tank_bench: [], heal_bench: [], dps_bench: [] },
    };
  }

  componentDidMount() {
    cePlayers().then((result) => {
      console.info("PLAYERS TO BE ORGANISED", result);
      // this.organise(result);
      const x = organise(result);
      this.setState(
        {
          loading: false,
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
            console.info("bench_history", bench_history);
          });

          console.info("ORGANISING...");
        }
      );
    });
  }

  estimateRaid() {}

  render() {
    var view;
    var bench_history_view;
    if (this.state.loading) {
      view = <Loading />;
      bench_history_view = <div></div>;
    } else {
      view = (
        <div>
          This automation fills the raid from 4 weeks of benched raiders. It
          then fills in the remaining slots based on highest Loot Priority.
          <br />
          Assuming everyone turns up next raid, and notwithstanding other
          external factors (like continuing progression with the same people in
          the same lockout), here's an estimate of the next raid.
          <br />
          The remainder of players MIGHT be benched if there are no AFK's (which
          there usually are).
        </div>
      );
      bench_history_view = <div></div>;
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
            <div>{view}</div>
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
