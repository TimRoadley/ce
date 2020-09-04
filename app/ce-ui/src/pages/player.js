import React from "react";
//import Moment from "react-moment"; // https://www.npmjs.com/package/react-moment
import moment from "moment";
import "moment/min/locales";
import "moment-timezone";
import { ceStandings } from "../data/db-cestanding";
import { cePlayer } from "../data/db-ceplayer";
import Loading from "../components/loading";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: this.props.match.params.name,
      loading: true,
      chart_start_date: moment().subtract(365, "days").unix(),
      chart_end_date: moment().unix(),
      chart_data: [],
      player_data: {
        name: "",
        class: "",
        latest_ep: "",
        latest_gp: "",
        latest_priority: "",
        rank: "",
        latest_update: 0,
      },
    };
  }

  componentDidMount() {
    if (this.state.player !== undefined || this.state.player !== null) {
      // GET STANDINGS
      ceStandings(
        this.state.player,
        this.state.chart_start_date,
        this.state.chart_end_date
      ).then((chart_data) => {
        // GET PLAYER
        cePlayer(this.state.player).then((player_data) => {
          console.info("player_data", player_data.data.getCEPlayer);
          this.setState({
            chart_data: chart_data,
            player_data: player_data.data.getCEPlayer,
            loading: false,
          });
        });
      });
    } else {
      console.error("No Player Defined");
    }
  }

  formatXAxis = (tickItem) => {
    return moment(tickItem * 1000).format("MMM D");
  };

  formatChartTooltip = ({ active, payload, label }) => {
    if (active && payload.length > 0) {
      const date_label = moment(label * 1000).format("MMM D");

      const k0 = payload[0]["dataKey"];
      const k1 = payload[1]["dataKey"];
      const k2 = payload[2]["dataKey"];

      const v0 = payload[0]["value"];
      const v1 = payload[1]["value"];
      const v2 = payload[2]["value"];

      return (
        <div className="custom_tooltip">
          <strong>{`${date_label}`}</strong>
          <ul>
            <li>
              {k0}: {v0}
            </li>
            <li>
              {k1}: {v1}
            </li>
            <li>
              {k2}: {v2}
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

  render() {
    var view;
    if (this.state.loading) {
      view = <Loading />;
    } else {
      view = (
        <div>
          <table>
            <tr>
              <td>
                <img
                  className="player_icon"
                  src={`/images/${this.state.player_data.class}.png`}
                  alt=""
                ></img>
              </td>
              <td>
                <h1 className={this.state.player_data.class}>
                  {" "}
                  {this.state.player}
                </h1>
              </td>
            </tr>
          </table>

          <div>
            <table className="player_table">
              <tbody>
                <tr className="player_table_row_value">
                  <td className="common">{this.state.player_data.latest_ep}</td>
                  <td className="epic">{this.state.player_data.latest_gp}</td>
                  <td className="artifact">
                    {this.state.player_data.latest_priority}
                  </td>
                </tr>
                <tr className="player_table_row_name">
                  <td>Effort Points</td>
                  <td>Gear Points</td>
                  <td>Loot Priority</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>History</h2>
          <div
            style={{
              paddingBottom: "56.25%" /* 16:9 */,
              position: "relative",
              height: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={this.state.chart_data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis tickFormatter={this.formatXAxis} dataKey="recorded" />

                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <Line
                    name="Effort Points"
                    yAxisId="left"
                    strokeWidth="2"
                    type="monotone"
                    dataKey="ep"
                    stroke="#31ff00"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    name="Gear Points"
                    yAxisId="left"
                    strokeWidth="2"
                    type="monotone"
                    dataKey="gp"
                    stroke="#9f37e3"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    name="Loot Priority"
                    yAxisId="right"
                    strokeWidth="2"
                    type="monotone"
                    dataKey="priority"
                    stroke="#E2CC6B"
                    activeDot={{ r: 8 }}
                  />

                  <YAxis yAxisId="left">
                    <Label
                      angle={270}
                      position="left"
                      style={{ fill: "grey", textAnchor: "middle" }}
                    >
                      EP/GP
                    </Label>
                  </YAxis>
                  <YAxis yAxisId="right" orientation="right">
                    <Label
                      angle={90}
                      position="right"
                      style={{ fill: "grey", textAnchor: "middle" }}
                    >
                      Loot Priority
                    </Label>
                  </YAxis>
                  <Legend />
                  <Tooltip content={this.formatChartTooltip} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    return <div>{view}</div>;
  }
}
