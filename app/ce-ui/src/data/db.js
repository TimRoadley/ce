import API from '@aws-amplify/api';
import { graphqlOperation } from '@aws-amplify/api';
import config from '../aws-exports'
API.configure(config)

export async function getData(query, variables) {
    return await API.graphql(graphqlOperation(query, variables))
}

export async function getDataInBatches(query, queryName, variables) {

    // GET INITIAL DATA
    const x = await API.graphql(graphqlOperation(query, variables))
    console.info("x",x);
    var all_items = x.data[queryName].items
    var nextToken = x.data[queryName].nextToken

    // GET MORE DATA IF REQUIRED
    while (nextToken !== null) {
        var nextTokenVariables = variables;
        nextTokenVariables['nextToken'] = nextToken
        let more_data = await API.graphql(graphqlOperation(query, nextTokenVariables))
        all_items = all_items.concat(more_data.data[queryName].items)
        nextToken = more_data.data[queryName].nextToken
    }
    return all_items;
}