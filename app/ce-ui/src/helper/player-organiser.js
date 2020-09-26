
export function add_player_to_raid(player, raid_and_bench, settings) {

  var updated_raid_and_bench = {...raid_and_bench}; // copy existing raid

  console.info("Adding",player);

  player_object()
  


 

  return updated_raid_and_bench
}
export function recently_benched_players(bench_history) {
  
  // PREPARE RECENTLY BENCHED PLAYER NAMES
  var recently_benched_players = [];
  for (var x in bench_history.reverse()) {
    var h = bench_history[x];
    var players = h["players"];
    if (players !== undefined && players !== null)
      for (var p in players) {
        var player_name = players[p];
        // console.info("BENCHED PLAYER", player_name);
        recently_benched_players.push(player_name);
      }
  }
  return Array.from(new Set(recently_benched_players));
}

export function player_names(roster) {
  var names = [];
  for (var x in roster) {
    names.push(roster[x]["name"]);
  }
  return names;
}

export function player_object(player_name, roster) {
  for (var x in roster) {
    const player = roster[x];
    if (player_name === player["name"]) {
      return player;
    }
  }
  return null;
}

export function player_type(player) {
  const player_name = player["name"];
  const player_class = player["class"];
  // SKIP
  if (
    ["Faceslicer", "Stepdadi", "Weechee", "Jeremypaxman"].includes(player_name)
  ) {
    return "skip";
  }

  // TANKS
  else if (
    ["Hakan", "Sblades", "Inflict", "Pearbear", "Weedwakka"].includes(
      player_name
    )
  ) {
    return "tank";
  }

  // SPECIFIC DPS
  else if (["Willikins"].includes(player_name)) {
    return "dps";
  }

  // HEALERS
  else if (
    player_class === "Paladin" ||
    player_class === "Priest" ||
    ["Agiel"].includes(player_name)
  ) {
    return "heal";
  }

  // OTHERWISE DPS
  return "dps";
}

export function organise(result) {
  var roster = [];
  var tanks = [];
  var heals = [];
  var dps = [];

  for (var x in result) {
    const player = result[x];

    // SKIP
    if (player_type(player) === "skipped") {
      console.info("skipped", player);
    }

    // TANKS
    else if (player_type(player) === "tank") {
      tanks.push(player);
      roster.push(player);
    }

    // HEALERS
    else if (player_type(player) === "heal") {
      heals.push(player);
      roster.push(player);
    }

    // DPS
    else if (player_type(player) === "dps") {
      dps.push(player);
      roster.push(player);
    }
  }

  // RETURN DATA
  return {
    roster: roster.sort(
      (a, b) =>
        (b.latest_priority > a.latest_priority) -
          (b.latest_priority < a.latest_priority) ||
        (a.name > b.name) - (a.name < b.name)
    ),
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
  };
}
