/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCePlayer = /* GraphQL */ `
  query GetCePlayer($name: String!) {
    getCEPlayer(name: $name) {
      name
      class
      rank
      latest_ep
      latest_gp
      latest_priority
      latest_update
      createdAt
      updatedAt
    }
  }
`;
export const listCePlayers = /* GraphQL */ `
  query ListCePlayers(
    $name: String
    $filter: ModelCEPlayerFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCEPlayers(
      name: $name
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        name
        class
        rank
        latest_ep
        latest_gp
        latest_priority
        latest_update
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCeStandings = /* GraphQL */ `
  query GetCeStandings($player_name: String!, $recorded: Float!) {
    getCEStandings(player_name: $player_name, recorded: $recorded) {
      player_name
      recorded
      ep
      gp
      priority
      createdAt
      updatedAt
    }
  }
`;
export const listCeStandingss = /* GraphQL */ `
  query ListCeStandingss(
    $player_name: String
    $recorded: ModelFloatKeyConditionInput
    $filter: ModelCEStandingsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCEStandingss(
      player_name: $player_name
      recorded: $recorded
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        player_name
        recorded
        ep
        gp
        priority
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
