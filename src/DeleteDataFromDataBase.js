import {getTableEndpoint} from "./getApiEndpoint";

export function deleteData(tableName, idToDelete){
    console.log('idToDelete', idToDelete);
    if( idToDelete.includes('--internal') ){ return }
 const tableEndpoint = getTableEndpoint(tableName);
//const url = `https://zeroqode-demo-01.bubbleapps.io/version-test/api/1.1/obj/${tableName}/${idToDelete}`
const apiUrl = tableEndpoint + "/" + idToDelete;
fetch(apiUrl, {
    method: "DELETE",
})
    .then(response => {
        if (response.ok) {
        } else {
            console.error("Failed to save data", response);
        }
    })
    .catch(error => console.error("Error saving data:", error));
}