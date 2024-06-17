import {getTableEndpoint} from "./getApiEndpoint";

export async function updatedData (tableName, updatedData ) {
    /* update the modified data in the bubble database */
    const tableEndpoint = getTableEndpoint(tableName);
    //const tableEndpoint = `https://zeroqode-demo-01.bubbleapps.io/version-test/api/1.1/obj/${tableName}`

    const {
        _id,
        Slug,
        "Modified Date": ModifiedDate,
        "Created Date": CreatedDate,
        "Created By": CreatedBy,
        ...dataWithoutIdAndSlug
    } = updatedData;

    const newData = Object.keys(dataWithoutIdAndSlug).reduce((acc, key) => {
        const newKey = key.split('_')[0];
        acc[newKey] = dataWithoutIdAndSlug[key];
        return acc;
    }, {});

    const newItem = _id.includes("--internal");

    const apiUrl =  newItem
        ? tableEndpoint
        : `${tableEndpoint}/${updatedData?._id}`; // add or update record based on whether its a local item or it has a bubble id

   return fetch(apiUrl, {
        method: newItem ? 'POST' : 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Could not edit or add to bubble");
            }
            if(newItem){
                return response.json();
            }
        }).then((data) => {

           if(newItem) {
               return data.id;
           } else {
               return updatedData?._id
           }

        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
}
