import { getTableEndpoint } from "./getApiEndpoint";

/**
 * @param {string} tableName
 * @return {Promise<any>}
 */
export async function getDataFromDatabase(tableName) {
    let url = getTableEndpoint(tableName);
    url = `${url}?&sort_field=Modified%20Date&descending=true`;
    // const url = `https://zeroqode-demo-01.bubbleapps.io/version-test/api/1.1/obj/${tableName}?&sort_field=Modified%20Date&descending=true`;
    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Could not edit or add to bubble. Reason: ${responseText}`);
    }

    const data = await response.json();
    console.log(data)
    return data.response.results;
}