import React from "react";
import { cePlayers } from "../data/db-ceplayer";
import Loading from "../components/loading";
import ReactTable from "react-table";
import "react-table/react-table.css";
// import Moment from 'react-moment'; // https://www.npmjs.com/package/react-moment
import moment from 'moment';
import 'moment/min/locales';
import 'moment-timezone';
import { Link } from 'react-router-dom'

export default class Standings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      loading: true,
    };
  }

  componentDidMount() {
    cePlayers().then((result) => {
      // console.info("ITEMS", result);

      var filtered_players = []

      // SKIP SPECIFIC PLAYERS
      for (var x in result) {
        var player = result[x];


        if (
          ["Borettoo", "Daisoh", "Dotspam", "Faceslicer", "Faeriefloss", "Grolder", "Hakan", "Hybridevil", "Jeremypaxman", "Maedre", "Nightshot", "Playgu", "Stepdadi", "Weechee", "Zither"].includes(
            player.name
          )
        ) {
          console.info("SKIP", player.name);
          continue;
        }

        filtered_players.push(player);
        console.info("ADD", player.name);
      }



      this.setState({
        loading: false,
        players: filtered_players.sort(
          (a, b) => (b.latest_priority > a.latest_priority) - (b.latest_priority < a.latest_priority)
        ),
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
          )
        },
        {
          Header: () => <div style={{ textAlign: "left" }}>Character</div>,
          accessor: "name",
          Cell: (props) => (
            <span className={props.original.class}>
              <div><Link className={`${props.original.class}`} to={`/loot/standings/${props.original.name}`}>{props.original.name}</Link></div>
            </span>
          )
        },
        {
            Header: () => <div style={{ textAlign: "left" }}>Guild Rank</div>,
            accessor: "rank",
        },
        {
          Header: () => <div style={{ textAlign: "left" }}>Effort Points</div>,
          accessor: "latest_ep",
          Cell: (props) => (
            <span className="common">{props.original.latest_ep}</span>
          )
        },
        {
          Header: () => <div style={{ textAlign: "left" }}>Gear Points</div>,
          accessor: "latest_gp",
          Cell: (props) => (
            <span className="epic">{props.original.latest_gp}</span>
          )
        },
        {
            Header: () => <div style={{ textAlign: "left" }}>Last Updated</div>,
            accessor: "latest_update",
            Cell: props => {
              var updated = moment(props.original.latest_update * 1000).fromNow();
              if (updated.includes("hour") || 
                  updated.includes("minute") ||
                  updated.includes("second")
                  ) {
                  updated = "Today"
              }
              return <span>{updated}</span>
          }
        },
      ];

      view = (
        <div>
          <ReactTable
            data={this.state.players}
            columns={columns}
            //filterable={true}
            showPagination={false}
            //pageSizeOptions={[10, 50, 100, data.length]}
            defaultPageSize={this.state.players.length}
            //pivotBy={this.state.pivotBy}
            minRows={0}
            // defaultFilterMethod={(filter, row) => matchSorter([row[filter.id]], filter.value).length !== 0}
            /*defaultSorted={[
              {
                id: 'latest_priority',
                desc: true
              }
            ]}*/
            className={"standings_table"}
          />
        </div>
      );
    }

    return (
      <div>
        <h1>EP/GP Standings</h1>
        {view}
      </div>
    );
  }
}
