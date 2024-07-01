import { getMetadataEndpoint } from "./getApiEndpoint"

/**
 *
 * @param tableName
 *  @return {Promise<Array<{
 *     field: string;
 *     header: string;
 *     type: 'text' | 'image' | 'number' | 'date' | 'user'
 * }>>} fields
 */

export async function getColumnNameFromBubble(tableName) {
    const url = getMetadataEndpoint(tableName);
    // const url = "https://zeroqode-demo-01.bubbleapps.io/version-test/api/1.1/meta";
    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Could not edit or add to bubble. Reason: ${responseText}`);
    }

    const data = await response.json();
    const fields = data.types[tableName].fields;

    return fields;

}

/**
 *
 * @param {string} progressBarField
 * @param  {string} reviewsField
 * @return {Promise<Array<{
 *     field: string;
 *     header: string;
 *     type: string;
 *   }>>
 * }
 */
export async function getColumnsForReact(databaseTableName, progressBarField, reviewsField) {

    const fields = await getColumnNameFromBubble(databaseTableName);
    const ignoreField = ["_id", "Slug", "Modified Date", "Created By", "unique ID", "Created Date"];

    return fields
        .filter((item) => {
            return !ignoreField.includes(item.display);
        })
        .sort((item1, item2) => {
            return item1.display.localeCompare(item2.display);
        })
        .map((item) => {
            const displayName = item.display;

            let reactType = item.type;
            if (displayName.includes(progressBarField)) {
                reactType = 'ProgressBar';
            }

            if (displayName.includes(reviewsField)) {
                reactType = 'reviews';
            }

            return {
                field: displayName,
                header: displayName,
                type: reactType,
            };
        });
}
