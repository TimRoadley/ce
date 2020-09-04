import { getDataInBatches } from './db';
import { listCeStandings } from '../graphql/queries';

export async function ceStandings(name, start, end) {
    let query = listCeStandings;
    let queryName = 'listCEStandings';
    let variables = { limit: 999999, name: name, recorded:{ "between": [start, end] } };
    return await getDataInBatches(query, queryName, variables);
}
