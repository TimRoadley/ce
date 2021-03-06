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
      latest_ep
      latest_gp
      latest_priority
      latest_update
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
      latest_ep
      latest_gp
      latest_priority
      latest_update
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
      latest_ep
      latest_gp
      latest_priority
      latest_update
      createdAt
      updatedAt
    }
  }
`;
export const createCeStanding = /* GraphQL */ `
  mutation CreateCeStanding(
    $input: CreateCEStandingInput!
    $condition: ModelCEStandingConditionInput
  ) {
    createCEStanding(input: $input, condition: $condition) {
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
export const updateCeStanding = /* GraphQL */ `
  mutation UpdateCeStanding(
    $input: UpdateCEStandingInput!
    $condition: ModelCEStandingConditionInput
  ) {
    updateCEStanding(input: $input, condition: $condition) {
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
export const deleteCeStanding = /* GraphQL */ `
  mutation DeleteCeStanding(
    $input: DeleteCEStandingInput!
    $condition: ModelCEStandingConditionInput
  ) {
    deleteCEStanding(input: $input, condition: $condition) {
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
export const createCeBench = /* GraphQL */ `
  mutation CreateCeBench(
    $input: CreateCEBenchInput!
    $condition: ModelCEBenchConditionInput
  ) {
    createCEBench(input: $input, condition: $condition) {
      bench_name
      recorded
      bench_date
      players
      createdAt
      updatedAt
    }
  }
`;
export const updateCeBench = /* GraphQL */ `
  mutation UpdateCeBench(
    $input: UpdateCEBenchInput!
    $condition: ModelCEBenchConditionInput
  ) {
    updateCEBench(input: $input, condition: $condition) {
      bench_name
      recorded
      bench_date
      players
      createdAt
      updatedAt
    }
  }
`;
export const deleteCeBench = /* GraphQL */ `
  mutation DeleteCeBench(
    $input: DeleteCEBenchInput!
    $condition: ModelCEBenchConditionInput
  ) {
    deleteCEBench(input: $input, condition: $condition) {
      bench_name
      recorded
      bench_date
      players
      createdAt
      updatedAt
    }
  }
`;
