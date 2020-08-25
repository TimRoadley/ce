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
      createdAt
      updatedAt
    }
  }
`;
export const createCePlayerHistory = /* GraphQL */ `
  mutation CreateCePlayerHistory(
    $input: CreateCEPlayerHistoryInput!
    $condition: ModelCEPlayerHistoryConditionInput
  ) {
    createCEPlayerHistory(input: $input, condition: $condition) {
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
export const updateCePlayerHistory = /* GraphQL */ `
  mutation UpdateCePlayerHistory(
    $input: UpdateCEPlayerHistoryInput!
    $condition: ModelCEPlayerHistoryConditionInput
  ) {
    updateCEPlayerHistory(input: $input, condition: $condition) {
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
export const deleteCePlayerHistory = /* GraphQL */ `
  mutation DeleteCePlayerHistory(
    $input: DeleteCEPlayerHistoryInput!
    $condition: ModelCEPlayerHistoryConditionInput
  ) {
    deleteCEPlayerHistory(input: $input, condition: $condition) {
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
