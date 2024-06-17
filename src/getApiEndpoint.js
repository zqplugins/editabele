/**
 * @param {string} databaseTableName
 * @param {boolean} isFetchMetadata
 * @return {string} URL to the Bubble table
 */
export function getApiBaseUrl() {
    const url = window.location.href;
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const isLive = !url.includes('version-test');
    const environment = isLive
        ? ''
        : 'version-test/';

    const baseUrl = `${protocol}//${host}/${environment}api/1.1`;

    return baseUrl;
}

export function getTableEndpoint(databaseTableName) {
    const baseUrl = getApiBaseUrl();

    return `${baseUrl}/obj/${databaseTableName}`;
}

export function getMetadataEndpoint() {
    const baseUrl = getApiBaseUrl();

    return `${baseUrl}/meta`;
}
