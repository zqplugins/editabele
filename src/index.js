import React from "react";
import ReactDOM from "react-dom/client";


import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import App from "./App";

function initializeTable(container) {
  const root = ReactDOM.createRoot(container);

  const defaults = {
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
  };
}

window.ZQ_PrimeReact_DataTable = {
  initializeTable,
};
