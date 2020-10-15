export function player_role(player) {
  const player_name = player["name"];
  const player_class = player["class"];
  // SKIP
  if (
    ["Faceslicer", "Stepdadi", "Weechee", "Jeremypaxman", "Grolder"].includes(
      player_name
    )
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
    // TODO: Check if raid is full on tanks and offtanks

    //if (raid_needs_role("offtank", rb.raid.offtank, s.max_offtanks)) {

    //}

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

export function class_minimums_met(class_name, player_role, rb, settings) {
 
  var all = [].concat(...rb.raid.tank).concat(...rb.raid.offtank).concat(...rb.raid.heal).concat(...rb.raid.dps)

  var maintank = 0;
  var offtank = 0;
  var count = 0;
  for (var x in all) {
    const p = all[x];
    const pc = p.class;
    if (class_name === pc) {
      count++
    }
    if (player_role === 'tank') {
      maintank++
    }
    if (player_role === 'tank') {
      offtank++
    }
  }
  
  const cm = class_minimum(player_role, class_name, settings)
  console.info("There are", class_name, player_role, count, "of", cm)

  if (player_role === "tank" && maintank >= settings.max_maintanks) {
    return true
  }

  else if (player_role === "offtank" && offtank >= settings.max_offtanks) {
    return true
  }

  else if (count >= cm) {
    return true
  } else {



    return false
  }
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

export function save_audit(name, rb) {
  var audit = {};
  audit["raid"] = { tank: [], offtank: [], heal: [], dps: [] };

  // ADD DPS
  for (var dps in rb.raid.dps) {
    const _dps = {
      name: rb.raid.dps[dps]["name"],
      class: rb.raid.dps[dps]["class"],
      latest_ep: rb.raid.dps[dps]["latest_ep"],
    };
    audit["raid"]["dps"].push(_dps);
  }

  // ADD HEALS
  for (var heal in rb.raid.heal) {
    const _heal = {
      name: rb.raid.heal[heal]["name"],
      class: rb.raid.heal[heal]["class"],
      latest_ep: rb.raid.heal[heal]["latest_ep"],
    };
    audit["raid"]["heal"].push(_heal);
  }

  // ADD TANKS
  for (var tank in rb.raid.tank) {
    const _tank = {
      name: rb.raid.tank[tank]["name"],
      class: rb.raid.tank[tank]["class"],
      latest_ep: rb.raid.tank[tank]["latest_ep"],
    };
    audit["raid"]["tank"].push(_tank);
  }

  // ADD OFFTANKS
  for (var offtank in rb.raid.offtank) {
    const _offtank = {
      name: rb.raid.offtank[offtank]["name"],
      class: rb.raid.offtank[offtank]["class"],
      latest_ep: rb.raid.offtank[offtank]["latest_ep"],
    };
    audit["raid"]["offtank"].push(_offtank);
  }

  rb[name] = audit;
  return rb;
}

export function populate_raid_with_bench(rb, settings) {
  for (var x in rb.recently_benched) {
    var player = rb.recently_benched[x];
    const rnp = raid_needs_player(player, rb, settings);
    const pr = player_role(player);
    const role_max = role_maximum(pr, settings);
    const rnr = raid_needs_role(pr, rb.raid[pr], role_max);
    const role = rnp["role"];

    // IF THE PLAYER IS NEEDED TO FILL MINIMUMS
    if (rnp["needed"]) {
      if (!rb.raid[role]) {
        rb.raid[role] = [];
      }
      rb.raid[role].push(player);
      remove_player(player, rb.available);
      console.info("ADD RECENTLY BENCHED:", player.name, "as", role);
    }

    // IF THE ROLE IS NEEDED TO FILL TO MAXIMUMS
    else if (rnr) {
      if (!rb.raid[pr]) {
        rb.raid[pr] = [];
      }
      rb.raid[pr].push(player);
      remove_player(player, rb.available);
      console.info("ADD RECENTLY BENCHED:", player.name, "as", pr);
    } else {
      console.ware(
        "FAILED TO ADD RECENTLY BENCHED:",
        player.name,
        pr,
        "doesn't fit!"
      );
    }
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

export function sort_by_lp_desc(player_array) {
  return player_array.sort(
    (a, b) =>
      (a.latest_priority > b.latest_priority) -
        (a.latest_priority < b.latest_priority) ||
      (a.name > b.name) - (a.name < b.name)
  );
}

export function populate_raid_with_class_minimums(rb, settings) {
  rb.available = sort_by_lp(rb.available); // PUT HIGHEST LP AT TOP
  for (var x in rb.available) {
    const p = rb.available[x];
    const pr = player_role(p);
    const cm = class_minimum(pr, p.class, settings);

    if (class_minimums_met(p.class, pr, rb, settings)) {
      console.info("...SKIP", p.latest_priority, p.name, pr, p.class);
    } else {
      console.info("...ADD", p.latest_priority, p.name, pr, p.class);
      rb.raid[pr].push(p);
    }

    /*    if (raid_needs_class(p.class, cm, rb)) {

    } else {
      
    } */
  }

  // remove_player(p, rb.available.all)
  return rb;
}

export function populate_raid_with_role_maximums(rb, settings) {
  return rb;
}

export function populate_raid_with_minimums(rb, settings) {
  var to_be_removed = [];

  // FILL TANK ROLES
  console.info("FILLING ROLE:", "tank");
  rb.available["tank"] = sort_by_lp(rb.available["tank"]); // PUT HIGHEST LP AT TOP
  for (var t in rb.available["tank"]) {
    const player = rb.available["tank"][t];
    const r = raid_needs_player(player, rb, settings);
    if (r["needed"]) {
      rb.raid["tank"].push(player);
      console.info(
        "  POPULATE CLASS MINIMUMS",
        player["name"],
        "as tank with",
        player["latest_priority"],
        "lp"
      );
    } else {
      rb.available["offtank"].push(player);
      console.info(
        "  ! TANKS FULL, REASSIGN ROLE:",
        player["name"],
        "to offtank",
        player["latest_priority"],
        "lp"
      );
    }
    to_be_removed.push(player);
  }
  for (var ti in { ...to_be_removed }) {
    remove_player(to_be_removed[ti], rb.available);
  }

  // FILL OFFTANK ROLES
  console.info("FILLING ROLE:", "offtank");
  rb.available["offtank"] = sort_by_lp(rb.available["offtank"]); // PUT HIGHEST LP AT TOP
  for (var o in rb.available["offtank"]) {
    const player = rb.available["offtank"][o];
    const r = raid_needs_player(player, rb, settings);
    if (r["needed"]) {
      rb.raid["offtank"].push(player);
      console.info(
        "  POPULATE CLASS MINIMUMS",
        player["name"],
        "as offtank with",
        player["latest_priority"],
        "lp"
      );
    } else {
      rb.available["dps"].push(player);
      console.info(
        "  ! OFFTANKS FULL, REASSIGN ROLE:",
        player["name"],
        "to dps",
        player["latest_priority"],
        "lp"
      );
    }
    to_be_removed.push(player);
  }
  for (var oi in { ...to_be_removed }) {
    remove_player(to_be_removed[oi], rb.available);
  }

  // FILL HEAL ROLES
  console.info("FILLING ROLE:", "heal");
  rb.available["heal"] = sort_by_lp(rb.available["heal"]); // PUT HIGHEST LP AT TOP
  for (var h in rb.available["heal"]) {
    const player = rb.available["heal"][h];
    const r = raid_needs_player(player, rb, settings);
    if (r["needed"]) {
      rb.raid["heal"].push(player);
      console.info(
        "  POPULATE CLASS MINIMUMS",
        player["name"],
        "as heal with",
        player["latest_priority"],
        "lp"
      );
    } else {
      rb.bench["heal"].push(player);
      console.info(
        "  ! HEALS FULL, BENCHED:",
        player["name"],
        player["latest_priority"],
        "lp"
      );
    }
    to_be_removed.push(player);
  }
  for (var hi in { ...to_be_removed }) {
    remove_player(to_be_removed[hi], rb.available);
  }

  // FILL DPS ROLES
  console.info("FILLING ROLE:", "dps");
  rb.available["dps"] = sort_by_lp(rb.available["dps"]); // PUT HIGHEST LP AT TOP
  for (var d in rb.available["dps"]) {
    const player = rb.available["dps"][d];
    const r = raid_needs_player(player, rb, settings);
    if (r["needed"]) {
      rb.raid["dps"].push(player);
      console.info(
        "  POPULATE CLASS MINIMUMS: ADD",
        player["name"],
        "as dps with",
        player["latest_priority"],
        "lp"
      );
    } /*  else {
      rb.bench["dps"].push(player);
      console.info(
        "  ! DPS FULL, BENCHED:",
        player["name"],
        player["latest_priority"],
        "lp"
      );
    } */
    to_be_removed.push(player);
  }
  for (var di in { ...to_be_removed }) {
    remove_player(to_be_removed[di], rb.available);
  }

  rb = save_audit("after_populate_raid_with_minimums", rb);
  return rb;
}

export function populate_raid_with_remainder(rb, settings) {
  // PUT HIGHEST LP AT TOP
  for (var role in rb.available) {
    rb.available[role] = sort_by_lp(rb.available[role]);
  }

  for (var _role in rb.available) {
    for (var x in rb.available[_role]) {
      const p = rb.available[_role][x];
      const pr = player_role(p);
      console.info(
        "TRYING TO FIT REMAINDER",
        p["latest_priority"],
        p["name"],
        pr
      );

      switch (pr) {
        case "tank":
          if (raid_needs_role(pr, rb.raid.tank, settings.max_maintanks)) {
            rb.raid.tank.push(p);
            remove_player(p, rb.available);
          }
          break;
        case "offtank":
          if (raid_needs_role(pr, rb.raid.offtank, settings.max_offtanks)) {
            rb.raid.offtank.push(p);
            remove_player(p, rb.available);
          }
          break;
        case "heal":
          if (raid_needs_role(pr, rb.raid.heal, settings.max_heals)) {
            rb.raid.heal.push(p);
            remove_player(p, rb.available);
          }
          break;
        case "dps":
          if (raid_needs_role(pr, rb.raid.dps, settings.max_dps)) {
            rb.raid.dps.push(p);
            remove_player(p, rb.available);
          }
          break;
        default:
          console.info("UNHANDLED ROLE", pr, "for", p);
      }
      remove_player(p, rb.raid.priority);
    }
  }

  return rb;
}

export function populate_raid_with_remaining_bench(rb, settings) {
  for (var x in rb.raid.priority) {
    const p = rb.raid.priority[x];
    const pr = player_role(p);
    console.info("TRYING TO FIT EXTRAS", p["name"], pr);

    switch (pr) {
      case "tank":
        if (raid_needs_role(pr, rb.raid.tank, settings.max_maintanks)) {
          rb.raid.tank.push(p);
          remove_player(p, rb.available);
        }
        break;
      case "offtank":
        if (raid_needs_role(pr, rb.raid.offtank, settings.max_offtanks)) {
          rb.raid.offtank.push(p);
          remove_player(p, rb.available);
        }
        break;
      case "heal":
        if (raid_needs_role(pr, rb.raid.heal, settings.max_heals)) {
          rb.raid.heal.push(p);
          remove_player(p, rb.available);
        }
        break;
      case "dps":
        if (raid_needs_role(pr, rb.raid.dps, settings.max_dps)) {
          rb.raid.dps.push(p);
          remove_player(p, rb.available);
        }
        break;
      default:
        console.info("UNHANDLED ROLE", pr, "for", p);
    }
    remove_player(p, rb.raid.priority);
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

export function role_maximum(role_name, settings) {
  switch (role_name) {
    case "tank":
      return settings.max_maintanks;
    case "offtank":
      return settings.max_offtanks;
    case "heal":
      return settings.max_heals;
    case "dps":
      return settings.max_dps;
    default:
      console.error("UNHANDLED role_maximum", role_name);
      return 0;
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
    }
  }

  // FILL DPS ROLES
  if (pr === "dps") {
    if (raid_needs_role("dps", rb.raid.dps, s.max_dps)) {
      result = { needed: true, role: "dps" };
      const class_min = class_minimum(pr, pc, s);
      if (raid_needs_class(pc, class_min, rb)) {
        result = { needed: true, role: "dps" };
      }
    }
  }

  return result;
}

export function raid_needs_class(class_name, class_min, rb) {
  const cn = class_name;
  const cc = class_count(rb.raid.all, cn);
  const ms = class_min;
  if (ms > cc) {
    // console.info("Need", cn, "have", cc, "of", ms);
    return true;
  }
  // console.info(cn, "slots full, have", cc, "of", ms);
  return false;
}

export function raid_needs_role(role_name, role_array, role_max) {
  if (role_max > role_array.length) {
    // console.info("Need", role_name, "have", role_array.length, "of", role_max);
    return true;
  }
  /*   console.info(
    "ROLE FULL",
    role_name,
    "( have",
    role_array.length,
    "of",
    role_max,
    ")", role_array
  ); */
  return false;
}
