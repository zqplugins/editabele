export function getApiEndpoint(isFetchMedatada, databaseTableName) {
  const url = window.location.href;
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const isLive = !url.includes("version-test");
  const baseUrl = `${protocol}//${host}/${isLive ? "" : "version-test/"}`;
  const endpoint = `api/1.1/${
    isFetchMedatada ? "meta" : "obj/" + databaseTableName.toLowerCase()
  }`;
  return baseUrl + endpoint;
}

export function getColumnsForReact({
  dataColumns,
  progressBarField,
  reviewsField,
}) {
  return dataColumns.map((columnName) => {
    const splitColumnName = columnName.split("_");
    const mappedColumnName = splitColumnName[0];

    let columnType = "";

    if (columnName.includes("_custom_")) {
      columnType = "text";
    } else if (
      columnName.toLowerCase().includes(progressBarField.toLowerCase())
    ) {
      columnType = "ProgressBar";
    } else if (columnName.toLowerCase().includes(reviewsField.toLowerCase())) {
      columnType = "reviews";
    } else {
      columnType = splitColumnName[splitColumnName.length - 1];
    }

    return {
      field: columnName,
      header: mappedColumnName,
      type: columnType,
    };
  });
}

export const getValuesForReact = (data, dataColumns) => {
  return data.map((item) => {
    const rowValues = dataColumns.reduce(
      (accumulator, columnName) => {
        const columnValue = item.get(columnName);

        accumulator[columnName] = columnName.includes("_custom_")
          ? columnValue?.get("_id")
          : columnValue;

        return accumulator;
      },
      {
        _id: item.get("_id"), // Initialize the accumulator with the _id property
      }
    );

    return rowValues;
  });
};

export function filterOutUnsupportedNames(dataArray) {
  const toFilterOut = ["_id", "Slug"]; // exclude service column names

  const resultArray = dataArray.filter((columnName) => {
    // exclude any column name with a space in it
    if (toFilterOut.includes(columnName)) {
      return false;
    }
    return !columnName.includes(" ");
  });

  return resultArray;
}

export async function getTitlesForEmptyColumns(
  databaseTableName,
  reviewsField,
  progressBarField
) {
  const metadataEndpoint = getApiEndpoint(true, databaseTableName);

  const response = await fetch(metadataEndpoint, { method: "GET" });

  if (!response.ok) throw new Error("Couldn't fetch the metadata");

  const data = await response.json();

  const table = data.types[databaseTableName.toLowerCase()];

  if (!table) {
    throw new Error("Table with this name doesn't exist");
  }

  const emptyTableFieldNames = table.fields.map((item) => item.id);

  const supportedFiledNames = filterOutUnsupportedNames(emptyTableFieldNames);

  const titles = getColumnsForReact({
    dataColumns: supportedFiledNames,
    progressBarField,
    reviewsField,
  });

  return titles;
}
