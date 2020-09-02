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
export const getCeStanding = /* GraphQL */ `
  query GetCeStanding($name: String!, $recorded: Float!) {
    getCEStanding(name: $name, recorded: $recorded) {
      name
      recorded
      ep
      gp
      priority
      createdAt
      updatedAt
    }
  }
`;
export const listCeStandings = /* GraphQL */ `
  query ListCeStandings(
    $name: String
    $recorded: ModelFloatKeyConditionInput
    $filter: ModelCEStandingFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCEStandings(
      name: $name
      recorded: $recorded
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        name
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
