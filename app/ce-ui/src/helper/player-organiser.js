export function class_count(players, class_name, roster) {
  var count = 0;
  for (var x in players) {
    const player = players[x];
    const pc = player["class"];
    if (pc === class_name) {
      count++;
    }
  }
  return count;
}

export function remove_player_from_array(player, player_array) {
  console.info("BEFORE REMOVING", player, "from", player_array);

  var player_index = null;
  for (var index in player_array) {
    const p = player_array[index];
    if (p["name"] === player["name"]) {
      console.info("FOUND ");
      player_index = index;
    }
  }

  if (player_index !== null) {
    player_array.splice(index - 1, 1);
  }

  console.info("AFTER REMOVING", player, "from", player_array);
  return player_array;
}

export function remove(player, player_array) {
  for (var i = 0; i < player_array.length; i++) {
    if (player_array[i] === player) {
      player_array.splice(i, 1);
    }
  }
}

export function add(
  class_name,
  min_setting,
  raid_array,
  bench_array,
  player,
  roster
) {
  if (player["class"] === class_name) {
    if (class_count(raid_array, class_name, roster) < min_setting) {
      console.info(
        "  ..Added",
        player["class"],
        player_type(player),
        player["name"]
      );
      raid_array.push(player); // Add player to raid
      remove(player, bench_array); // Remove player from bench
    } else {
      console.info(
        "FULL, CAN'T ADD",
        player["class"],
        player_type(player),
        player["name"]
      );
    }
  }
}

export function add_player_to_raid(player_name, raid_and_bench, settings) {
  var x = { ...raid_and_bench }; // copy existing raid
  const roster = x.roster;

  const s = settings;
  // console.info("SETTINGS", settings);

  const po = player_object(player_name, roster);
  const pc = po.class;
  const pt = player_type(po);

  if (pt === "dps") {
    if (pc === "Mage") {
      add("Mage", s.min_mages, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Hunter") {
      add("Hunter", s.min_hunters, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Warlock") {
      add("Warlock", s.min_warlocks, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Rogue") {
      add("Rogue", s.min_rogues, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Warrior") {
      add("Warrior", s.min_offtanks, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Priest") {
      add("Priest", s.min_shadow, x.raid.dps, x.bench.dps, po, roster);
    } else if (pc === "Druid") {
      add("Druid", s.min_feral, x.raid.dps, x.bench.dps, po, roster);
    }
  } else if (pt === "heal") {
    if (pc === "Paladin") {
      add("Paladin", s.min_paladins, x.raid.heals, x.bench.heals, po, roster);
    } else if (pc === "Priest") {
      add("Priest", s.min_priests, x.raid.heals, x.bench.heals, po, roster);
    } else if (pc === "Druid") {
      add("Druid", s.min_resto_druids, x.raid.heals, x.bench.heals, po, roster);
    }
  } else if (pt === "tank") {
    if (pc === "Warrior") {
      add("Warrior", s.min_maintanks, x.raid.tanks, x.bench.tanks, po, roster);
    } else if (pc === "Druid") {
      add("Druid", s.min_maintanks, x.raid.tanks, x.bench.tanks, po, roster);
    }
  }

  // console.info("updated_raid_and_bench", updated_raid_and_bench);
  return x;
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
