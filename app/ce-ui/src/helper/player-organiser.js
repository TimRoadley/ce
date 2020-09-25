export function organise(result) {

  var tanks = [];
  var heals = [];
  var dps = [];

  for (var x in result) {
    const player = result[x];
    const player_name = player["name"];
    const player_class = player["class"];

    // SKIP
    if (
      ["Faceslicer", "Stepdadi", "Weechee", "Jeremypaxman"].includes(
        player_name
      )
    ) {
      console.info("skipped");
    }

    // TANKS
    else if (
      ["Hakan", "Sblades", "Inflict", "Pearbear", "Weedwakka"].includes(
        player_name
      )
    ) {
      tanks.push(player);
    }

    // SPECIFIC DPS
    else if (["Willikins"].includes(player_name)) {
      dps.push(player);
    }

    // HEALERS
    else if (
      player_class === "Paladin" ||
      player_class === "Priest" ||
      ["Agiel"].includes(player_name)
    ) {
      heals.push(player);
    }

    // DPS
    else {
      dps.push(player);
    }
  }

  // RETURN DATA
  return {
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
