import React from "react";
import ReactDOM from "react-dom/client";
import {
  getApiEndpoint,
  getColumnsForReact,
  getValuesForReact,
  filterOutUnsupportedNames,
  getTitlesForEmptyColumns,
} from "./functions";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import App from "./App";

function initializeTable(container) {
  const root = ReactDOM.createRoot(container);

  const defaults = {
    columns: [],
    data: [],
    onDelete: () => {},
    onChangeListener: () => {},
    optionsForPlugin: {},
  };

  const updateData = (props) => {
    root.render(
      <React.StrictMode>
        <App {...props} />
      </React.StrictMode>
    );
  };

  updateData(defaults);

  return {
    updateData,
    functions: {
      getApiEndpoint,
      getColumnsForReact,
      getValuesForReact,
      filterOutUnsupportedNames,
      getTitlesForEmptyColumns,
    },
  };
}

window.ZQ_PrimeReact_DataTable = {
  initializeTable,
};
