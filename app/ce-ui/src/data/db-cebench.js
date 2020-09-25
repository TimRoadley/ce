import { getDataInBatches } from './db';
import { listCeBenchs } from '../graphql/queries';

export async function ceBench(bench_name, start, end) {
    let query = listCeBenchs;
    let queryName = 'listCEBenchs';
    let variables = { limit: 999999, bench_name:bench_name, recorded:{ "between": [start, end] } };
    return await getDataInBatches(query, queryName, variables);
}


/*
import { getDataInBatches } from './db';
import { listCeStandings } from '../graphql/queries';

export async function ceStandings(name, start, end) {
    let query = listCeStandings;
    let queryName = 'listCEStandings';
    let variables = { limit: 999999, name: name, recorded:{ "between": [start, end] } };
    return await getDataInBatches(query, queryName, variables);
}
*/