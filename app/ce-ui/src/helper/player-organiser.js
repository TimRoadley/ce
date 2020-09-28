export function player_role(player) {
  const player_name = player["name"];
  const player_class = player["class"];
  // SKIP
  if (
    ["Faceslicer", "Stepdadi", "Weechee", "Jeremypaxman", "Grolder"].includes(player_name)
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
    ["Agiel"].includes(player_name) // RESTO DRUIDS
  ) {
    return "heal";
  }

  // OFFTANKS
  else if (player_class === "Warrior" || player_class === "Druid") {
    return "offtank";
  }

  // OTHERWISE DPS
  return "dps";
}

export function organise(result) {
  var roster = [];
  var tank = [];
  var offtank = [];
  var heal = [];
  var dps = [];

  for (var x in result) {
    const player = result[x];

    // SKIP
    if (player_role(player) === "skip") {
      console.info("skipped", player["name"]);
    }

    // TANKS
    else if (player_role(player) === "tank") {
      tank.push(player);
      roster.push(player);
    }

    // OFFTANKS (i.e. warrior/druid dps)
    else if (player_role(player) === "offtank") {
      offtank.push(player);
      roster.push(player);
    }

    // HEALERS
    else if (player_role(player) === "heal") {
      heal.push(player);
      roster.push(player);
    }

    // DPS
    else if (player_role(player) === "dps") {
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
    tank: tank.sort(
      (a, b) =>
        (b.latest_priority > a.latest_priority) -
          (b.latest_priority < a.latest_priority) ||
        (a.name > b.name) - (a.name < b.name)
    ),
    offtank: offtank.sort(
      (a, b) =>
        (b.latest_priority > a.latest_priority) -
          (b.latest_priority < a.latest_priority) ||
        (a.name > b.name) - (a.name < b.name)
    ),
    heal: heal.sort(
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

export function player_object(player_name, roster) {
  for (var x in roster) {
    const player = roster[x];
    if (player_name === player["name"]) {
      return player;
    }
  }
  return null;
}

export function class_count(players, class_name) {
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

export function recently_benched_players(bench_history, roster) {
  // console.info("bench_history", bench_history);

  // PREPARE RECENTLY BENCHED PLAYER NAMES
  var recently_benched_players = {};
  for (var x in bench_history) {
    var h = bench_history[x];
    var bench_date = bench_history[x]["bench_date"];
    var players = h["players"];
    if (players !== undefined && players !== null)
      for (var p in players) {
        var player_name = players[p];
        // console.info("BENCHED", bench_date, player_name);

        // Add new
        if (recently_benched_players[player_name] === undefined) {
          recently_benched_players[player_name] = player_object(
            player_name,
            roster
          );
          recently_benched_players[player_name]["benched"] = [];
        }

        recently_benched_players[player_name]["benched"].push(bench_date);
      }
  }

  var rbp = [];
  Object.keys(recently_benched_players).forEach(function (key) {
    // console.log("DICT", key, recently_benched_players[key]);
    rbp.push(recently_benched_players[key]);
  });

  return rbp;
}

export function populate_raid_with_bench(rb, settings) {
  for (var x in rb.recently_benched) {
    var player = rb.recently_benched[x];
    const r = raid_needs_player(player, rb, settings);
    const role = r["role"];
    // console.info("BENCHED", player.name, r);
    if (r["needed"]) {
      player["raid_assignment"] = role;
      rb.raid[role].push(player);
    } else {
      player["raid_assignment"] = "priority";
      if (rb.raid["priority"] === undefined) {
        rb.raid["priority"] = [];
      }
      rb.raid["priority"].push(player);
    }
    remove_player(player, rb.available[role]);
  }
  return rb;
}

export function sort_by_lp(player_array) {
  return player_array.sort(
    (a, b) =>
      (b.latest_priority > a.latest_priority) -
        (b.latest_priority < a.latest_priority) ||
      (a.name > b.name) - (a.name < b.name)
  );
}

export function populate_raid_with_minimums(rb, settings) {
  // PUT HIGHEST LP AT TOP
  for (var role in rb.available) {
    rb.available[role] = sort_by_lp(rb.available[role]);
  }

  // FILL RAID REMAINDER
  for (var _role in rb.available) {
    var to_be_removed = [];
    for (var x in rb.available[_role]) {
      const player = rb.available[_role][x];
      const r = raid_needs_player(player, rb, settings);
      console.info(
        "Trying to fill",
        _role,
        "role with",
        player["class"],
        player["name"],
        "RESULT",
        r
      );
      if (r["needed"]) {
        const assigned_role = r["role"];
        player["raid_assignment"] = assigned_role;
        rb.raid[assigned_role].push(player);
        to_be_removed.push(player);
      }
    }

    for (var i in { ...to_be_removed }) {
      remove_player(to_be_removed[i], rb.available[_role]);
    }
  }

  return rb;
}

export function populate_raid_with_remainder(rb, settings) {
  // PUT HIGHEST LP AT TOP
  for (var role in rb.available) {
    rb.available[role] = sort_by_lp(rb.available[role]);
  }

  
  
  return rb;
}

export function remove_player(player, player_array) {
  const player_name = player["name"];
  for (var x in player_array) {
    const p = player_array[x];
    const pn = p["name"];
    if (pn === player_name) {
      player_array.splice(x, 1);
    }
  }
}

export function class_minimum(role, class_name, settings) {
  //console.info(settings);
  if (role === "tank") {
    switch (class_name) {
      case "Druid":
        return settings.min_maintanks;
      case "Warrior":
        return settings.min_maintanks;
      default:
        return 0;
    }
  }

  if (role === "offtank") {
    switch (class_name) {
      case "Druid":
        return settings.min_offtanks;
      case "Warrior":
        return settings.min_offtanks;
      default:
        return 0;
    }
  }

  if (role === "heal") {
    switch (class_name) {
      case "Paladin":
        return settings.min_paladins;
      case "Priest":
        return settings.min_priests;
      case "Druid":
        return settings.min_resto_druids;
      default:
        return 0;
    }
  }

  if (role === "dps") {
    switch (class_name) {
      case "Druid":
        return settings.min_feral;
      case "Priest":
        return settings.min_shadow;
      case "Hunter":
        return settings.min_hunters;
      case "Mage":
        return settings.min_mages;
      case "Rogue":
        return settings.min_rogues;
      case "Warlock":
        return settings.min_warlocks;
      default:
        return 0;
    }
  }
}

export function raid_needs_player(player, rb, settings) {
  const pr = player_role(player);
  const pc = player["class"];
  const s = settings;

  var result = { needed: false, reason: "bench" };

  // FILL TANK ROLES
  if (pr === "tank") {
    if (raid_needs_role("tank", rb.raid.tank, s.max_maintanks)) {
      result = { needed: true, role: "tank" };
    }
  }

  // FILL HEAL ROLES
  if (pr === "heal") {
    if (raid_needs_role("heal", rb.raid.heal, s.max_heals)) {
      result = { needed: true, role: "heal" };
    }
  }

  // FILL OFFTANK ROLES
  if (pr === "offtank") {
    if (raid_needs_role("offtank", rb.raid.offtank, s.max_offtanks)) {
      result = { needed: true, role: "offtank" };
    } else {
      if (raid_needs_role("dps", rb.raid.dps, s.max_dps)) {
        result = { needed: true, role: "dps" };
      }
    }
  }

  // FILL DPS ROLES
  if (pr === "dps") {
    if (raid_needs_role("dps", rb.raid.dps, s.max_dps)) {
      result = { needed: true, role: "dps" };
      const class_min = class_minimum(pr, pc, s);
      if (raid_needs_class(pc, class_min, rb)) {
        result = { needed: true, role: "dps" };
      } else {
        const reason = pc + " slots full";
        result = { needed: false, role: "bench", reason: reason };
      }
    }
  }

  return result;
}

export function raid_needs_class(class_name, class_min, rb) {
  const cn = class_name;
  const cc = class_count(rb.raid.dps, cn);
  const ms = class_min;
  if (ms > cc) {
    // console.info("Need", cn, "have", cc, "of", ms);
    return true;
  }
  console.info(cn, "slots full, have", cc, "of", ms);
  return false;
}

export function raid_needs_role(role_name, role_array, role_max) {
  if (role_max > role_array.length) {
    // console.info("Need", role_name, "have", role_array.length, "of", role_max);
    return true;
  }
  console.info("FULL", role_name, "have", role_array.length, "of", role_max);
  return false;
}
