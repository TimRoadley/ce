import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import Loading from "../components/loading";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default class Bench extends React.Component {
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
      //this.organise(result);

      this.setState({
        // chart_data: chart_data,
        // player_data: player_data.data.getCEPlayer,
        loading: false,
      });
    });
  }

  render() {
    var view;
    if (this.state.loading) {
      view = <Loading />;
    } else {
      view = <div>TODO: add autobencher</div>;
    }
    return (
      <div>
        <h1>Bench</h1>
        <p>
          This page is used to guide us on who to bench, in case we get 40+ raiders.
        </p>
        <p>
          No one wants to be benched (especially when they have high{" "}
          <strong className="artifact">Loot Priority</strong>) and no one wants
          to be in a poorly balanced and underperforming raid either.
        </p>
        <p>
          To be considered a raider in the first place, we expect you to
          turn up regularly, enchant your gear and bring basic consumables.
        </p>
        <h2>Bench Priority</h2>
        <div
          style={{
            margin: "1% 5% 1% 5%",
            backgroundColor: "#111111",
            borderRadius: "5px",
            padding: "0px 10px 5px 10px",
            textAlign: "center",
          }}
        >
          <br />
          <h3>Assuming no impact to Raid Balance...</h3>
          <h3>
            <strong className="epic">Low Loot Priority Raiders</strong> &gt;{" "}
            <strong className="rare">Recently Benched Raiders</strong>
          </h3>
          <h3>... however volunteers are appreciated</h3>
        </div>
        <Tabs>
          <TabList>
            <Tab>Benchmaster 9000&trade;</Tab>
            <Tab>Raid Balance</Tab>
          </TabList>

          <TabPanel>
            <div>{view}</div>
          </TabPanel>
          <TabPanel>
            <div>
              Our AQ strategies require the following tank, heal and dps roles. When overlaid
              with our current roster it looks like this:
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
              <h2>Assuming no one volunteers to be benched:</h2>
              We'll use the Benchmaster 9000&trade;, which:
              <ul>
                <li>Maintains Raid Balance</li>
                <li>Prioritises a spot for those recently benched</li>
                <li>Prioritises lowest Loot Priority raiders to the bench for each role</li>
              </ul>
              The output is just a guide, so volunteers could sit instead.
              <h2>If you are Benched</h2>
              <ul>
                <li>Thanks for ensuring we continue to have full raids!</li>
                <li>Rest assured you'll get a spot next clear.</li>
                <li>
                  If we're doing progression, the original raiders
                  will take precedence this lockout HOWEVER note that they might
                  not turn up, so please be available just in case. This issue
                  will dissapear when AQ is clear in 1 night (soon&trade;).
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
