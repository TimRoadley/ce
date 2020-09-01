/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCePlayer = /* GraphQL */ `
  mutation CreateCePlayer(
    $input: CreateCEPlayerInput!
    $condition: ModelCEPlayerConditionInput
  ) {
    createCEPlayer(input: $input, condition: $condition) {
      name
      class
      rank
      createdAt
      updatedAt
    }
  }
`;
export const updateCePlayer = /* GraphQL */ `
  mutation UpdateCePlayer(
    $input: UpdateCEPlayerInput!
    $condition: ModelCEPlayerConditionInput
  ) {
    updateCEPlayer(input: $input, condition: $condition) {
      name
      class
      rank
      createdAt
      updatedAt
    }
  }
`;
export const deleteCePlayer = /* GraphQL */ `
  mutation DeleteCePlayer(
    $input: DeleteCEPlayerInput!
    $condition: ModelCEPlayerConditionInput
  ) {
    deleteCEPlayer(input: $input, condition: $condition) {
      name
      class
      rank
      createdAt
      updatedAt
    }
  }
`;
export const createCeStandings = /* GraphQL */ `
  mutation CreateCeStandings(
    $input: CreateCEStandingsInput!
    $condition: ModelCEStandingsConditionInput
  ) {
    createCEStandings(input: $input, condition: $condition) {
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
export const updateCeStandings = /* GraphQL */ `
  mutation UpdateCeStandings(
    $input: UpdateCEStandingsInput!
    $condition: ModelCEStandingsConditionInput
  ) {
    updateCEStandings(input: $input, condition: $condition) {
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
export const deleteCeStandings = /* GraphQL */ `
  mutation DeleteCeStandings(
    $input: DeleteCEStandingsInput!
    $condition: ModelCEStandingsConditionInput
  ) {
    deleteCEStandings(input: $input, condition: $condition) {
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
