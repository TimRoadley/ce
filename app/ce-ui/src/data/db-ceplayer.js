import { getData, getDataInBatches } from './db';
import { getCePlayer, listCePlayers } from '../graphql/queries';

export async function cePlayer(name) {
    let query = getCePlayer;
    let variables = { limit: 999999, name: name };
    return await getData(query, variables);
}

export async function cePlayers() {
    let query = listCePlayers;
    let queryName = 'listCEPlayers';
    let variables = { limit: 999999 };
    return await getDataInBatches(query, queryName, variables);
}
