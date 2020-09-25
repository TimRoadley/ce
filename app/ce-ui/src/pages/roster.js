import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles/roster.css";
import { organise } from "../helper/player-organiser";

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
      const x = organise(result);
      this.setState({
        loading: false,
        tanks: x["tanks"],
        heals: x["heals"],
        dps: x["dps"],
      });
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
                  //pageSizeOptions={pageSizeOptions(this.state.tanks)}
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
                  {this.state.heals.length} Heals
                </h2>
                <ReactTable
                  data={this.state.heals}
                  columns={columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.heals)}
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
                  {this.state.dps.length} DPS
                </h2>
                <ReactTable
                  data={this.state.dps}
                  columns={columns}
                  showPagination={false}
                  //pageSizeOptions={pageSizeOptions(this.state.dps)}
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
        <p>This page shows our current roster.</p>

        {view}
      </div>
    );
  }
}
