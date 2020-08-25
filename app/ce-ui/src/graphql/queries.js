/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCePlayer = /* GraphQL */ `
  query GetCePlayer($name: String!) {
    getCEPlayer(name: $name) {
      name
      class
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCePlayerHistory = /* GraphQL */ `
  query GetCePlayerHistory($player_name: String!, $recorded: Float!) {
    getCEPlayerHistory(player_name: $player_name, recorded: $recorded) {
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
export const listCePlayerHistorys = /* GraphQL */ `
  query ListCePlayerHistorys(
    $player_name: String
    $recorded: ModelFloatKeyConditionInput
    $filter: ModelCEPlayerHistoryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCEPlayerHistorys(
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
