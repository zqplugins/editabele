import React, { useState, useRef, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { format } from "date-fns";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { getTitlesForEmptyColumns } from "./functions";
import { FileUpload } from "primereact/fileupload";
import "./App.css";

/**
 * @param {(editedRowData, allData) => void} onChangeListener
 * @param {Array<{header: string; field: string; type: string}>} columns
 * @param {Array<{[key: string]: any}>} data
 * @param {{
 *     headerText: string;
 *     footerText: string;
 *     showGridlines: boolean;
 *     size: string;
 *     stripedRows: boolean;
 *     Paginator: boolean;
 *     sortable: boolean;
 *     sortMode: Text;
 *     rowsPerPageOptions: Array,
 *     rows: number,
 *     emptyMessage: string,
 *     dragSelection: boolean
 *
 * }} optionsForPlugin
 * @returns {JSX.Element}
 * @constructor
 */
function App({
  columns,
  data: bubbleData,
  optionsForPlugin,
  onDelete,
  onChangeListener,
}) {
  const {
    size,
    headerText,
    footerText,
    showGridlines,
    rows,
    rowsPerPageOptions,
    stripedRows,
    paginator,
    sortable,
    sortMode,
    sortField,
    removableSort,
    multiple,
    emptyMessage,
    filter,
    dragSelection,
    selectionMode,
    editMode,
    showValueProgressBar,
    progressBarHeight,
    showAlert,
    databaseTableName,
    alertFieldName,
    alertPosition,
    reviewsField,
    primaryColor,
    highlightColor,
    progressBarLabelColor,
    progressBarField,
  } = optionsForPlugin;

  const [selectedData, setSelectedData] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const dt = useRef(null);
  const [localColumns, setLocalColumns] = useState(columns);

  useEffect(() => {
    if (bubbleData.length === 0) return;
    /** @type {Array} */
    setData(bubbleData);
  }, [bubbleData]);

  useEffect(() => {
    if (localColumns.length > 0) return;
    if (!databaseTableName) return;

    getTitlesForEmptyColumns(
      databaseTableName,
      reviewsField,
      progressBarField
    ).then((emptyColumns) => {
      setLocalColumns(emptyColumns);
    });
  }, [localColumns, databaseTableName]);

  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const booleanValue = [
    {
      name: "true",
    },
    {
      name: "false",
    },
  ];

  const onRowSelect = (event) => {
    const requiredKey = Object.keys(event.data).find((key) =>
      key.includes(alertFieldName)
    );

    console.log("REQUERED KEY", requiredKey);

    if (requiredKey) {
      toast?.current.show({
        severity: "info",
        summary: "Record selected",
        detail: `Name: ${event.data[requiredKey]}`,
        life: 3000,
      });
    }
    setSelectedData((prevData) => [event.data, ...prevData]);
  };

  const onRowUnselect = (event) => {
    const requiredKey = Object.keys(event.data).find((key) =>
      key.includes(alertFieldName)
    );

    if (requiredKey) {
      toast?.current.show({
        severity: "info",
        summary: "Record unselected",
        detail: `Name: ${event.data[requiredKey]}`,
        life: 3000,
      });
    }
    const selected = selectedData.filter((item) => item._id !== event.data._id);
    setSelectedData(selected);
  };

  const footer = footerText;

  const formatDate = (value) => {
    if (!value) {
      return "Missing date";
    }

    if (!isNaN(new Date(value))) {
      return "Invalid date";
    }

    return format(new Date(value), "yyyy/MM/dd");
  };

  const getFileContentBase64 = (file) => {
    return new Promise(async (resolve) => {
      // convert file to base64 encoded
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const base64data = reader.result;

        resolve(base64data);
      };
    });
  };

  const onRowEditInit = () => {
    setIsInEditMode(true);
  };

  const onRowEditComplete = (e) => {
    let _data = [...data];
    let { newData, index } = e;

    _data[index] = newData;

    setData(_data);

    onChangeListener(newData, _data);
    setIsInEditMode(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };

  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFilters({
      global: { value: "", matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      ProgressBar: { value: null, matchMode: FilterMatchMode.BETWEEN },
      Boolean: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
  };

  const header = (
    <>
      <div className="flex justify-content-between mb-2 align-items-center">
        <span className="">{headerText}</span>
        <div className="flex gap-2">
          <Button
            type="button"
            icon="pi pi-file"
            style={{
              backgroundColor: "var(--primary-color)",
              border: `0.1rem solid ${"var(--primary-color)"}`,
            }}
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-plus"
            style={{
              backgroundColor: "var(--primary-color)",
              border: `0.1rem solid ${"var(--primary-color)"}`,
            }}
            rounded
            onClick={() => {
              const newTempId = `--internal-${new Date().getTime()}`;
              const newTempObject = {
                _id: newTempId,
              };

              setData((prevData) => [newTempObject, ...prevData]);

              setEditingRows((oldEditingRows) => {
                return {
                  ...oldEditingRows,
                  [newTempId]: true,
                };
              });
            }}
            data-pr-tooltip="add"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          style={{ color: "var(--primary-color)" }}
          onClick={clearFilter}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={filters.global.value}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
          />
        </span>
      </div>
    </>
  );

  const editByType = {
    text: (field, options) => {
      return (
        <InputText
          type="text"
          value={options.value}
          onChange={(e) => options.editorCallback(e.target.value)}
        />
      );
    },
    reviews: (field, options) => {
      return (
        <Rating
          value={options.value}
          onChange={(e) => options.editorCallback(e.value)}
          cancel={false}
        ></Rating>
      );
    },
    number: (field, options) => {
      return (
        <InputNumber
          value={options.value}
          onValueChange={(e) => options.editorCallback(e.value)}
        />
      );
    },
    ProgressBar: (field, options) => {
      return (
        <InputNumber
          value={options.value}
          onValueChange={(e) => options.editorCallback(e.value)}
        />
      );
    },
    booleanForm: (field, options) => {
      const value =
        typeof options.value === "object"
          ? options.value
          : booleanValue.find(({ name }) => name === String(options.value));

      return (
        <Dropdown
          value={value}
          options={booleanValue}
          onChange={(e) => options.editorCallback(e.value.name === "true")}
          placeholder="Select a Status"
          optionLabel="name"
          className="w-full md:w-14rem"
        />
      );
    },
    date: (field, options) => {
      return (
        <Calendar
          value={options.value}
          onChange={(e) => options.editorCallback(e.value)}
          showWeek
        />
      );
    },
    image: (field, options) => {
      return (
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1_000_000}
          onSelect={async (event) => {
            const selectedFile = event.files[0];
            const base64Data = await getFileContentBase64(selectedFile);
            options.editorCallback({
              name: selectedFile.name,
              data: base64Data,
            });
          }}
        />
      );
    },
  };

  const bodyTemplateByType = {
    image: (field, element) => {
      return (
        <img
          src={element[field]}
          style={{ maxHeight: "4rem" }}
          className="w-6rem shadow-2 border-round"
        />
      );
    },
    ProgressBar: (field, element) => {
      return (
        <ProgressBar
          value={element[field]}
          showValue={showValueProgressBar}
          style={{
            height: `${progressBarHeight}px`,
          }}
        ></ProgressBar>
      );
    },
    booleanForm: (field, element) => {
      return (
        <i
          className={classNames("pi", {
            "text-green-500 pi-check-circle": element[field],
            "text-red-500 pi-times-circle": !element[field],
          })}
        ></i>
      );
    },
    date: (field, element) => {
      return formatDate(element[field]);
    },
    reviews: (field, element) => {
      return <Rating value={element[field]} readOnly cancel={false} />;
    },
  };

  const createColumn = ({ field, header, type }, index) => {
    return (
      <Column
        bodyClassName="text-center"
        key={field}
        columnKey={field}
        field={field}
        header={header}
        sortable={sortable === true}
        rowEditor={false}
        editor={field === "_id" ? null : editByType[type]?.bind(this, field)}
        body={bodyTemplateByType[type]?.bind(this, field)}
      ></Column>
    );
  };

  return (
    <div className="card" style={{ height: "100%" }}>
      {showAlert && (
        <Toast color={primaryColor} ref={toast} position={alertPosition} />
      )}
      <style>
        :root {"{"}
        --primary-color: {primaryColor}; --highlight-bg: {highlightColor};
        --highlight-text-color: {primaryColor}; --data-table--button-gap: 123px;
        {"}"}
        .p-progressbar-label{"{"}
        color: {progressBarLabelColor} !important
        {"}"}
        .p-progressbar-value{"{"}
        background: {primaryColor}!important
        {"}"}
        .p-rating-item.p-rating-item-active svg{"{"}
        color: {primaryColor} !important
        {"}"}
        .p-fileupload-choose {"{"}
        background: {primaryColor} !important; border: 1px solid {primaryColor}{" "}
        !important;
        {"}"}
        .p-highlight.p-selectable-row {"{"}
        background: {highlightColor} !important;
        {"}"}
        .p-checkbox-box.p-component, .p-radiobutton-box.p-component {"{"}
        border-color: {primaryColor} !important;
        {"}"}
        .p-checkbox .p-checkbox-box.p-highlight, .p-radiobutton-box
        .p-component.p-highlight {"{"}
        background: {primaryColor} !important;
        {"}"}
        .p-checkbox.p-component.p-highlight {"{"}
        background: {primaryColor} !important;
        {"}"}
        .p-checkbox-box.p-component.p-highlight.p-focus {"{"}
        background: {primaryColor} !important; box-shadow: 0 0 0 0.2rem{" "}
        {primaryColor} !important;
        {"}"}
        .p-checkbox-box.p-component.p-focus {"{"}
        box-shadow: 0 0 0 0.2rem {primaryColor} !important;
        {"}"}
        .p-radiobutton .p-radiobutton-box.p-highlight {"{"}
        background: {primaryColor} !important;
        {"}"}
        .p-radiobutton .p-radiobutton-box:not(.p-disabled).p-focus {"{"}
        box-shadow: 0 0 0 0.2rem {highlightColor} !important;
        {"}"}
        {/* .p-radiobutton-box.p-component.p-focus {"{"}
        background: {primaryColor} !important;
        {"}"} */}
        .p-datatable.p-datatable tr.p-highlight {"{"}
        color: {primaryColor} !important;
        {"}"}
        .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {"{"}
        background: {highlightColor} !important;
        {"}"}
        .p-link, p-link:focus {"{"}
        color: {primaryColor} !important;
        {"}"}
        .p-link:focus{"{"}
        box-shadow: 0 0 0 0.2rem {highlightColor} !important;
        {"}"}
        .p-inputtext:enabled:focus, .p-inputtext:enabled:hover {"{"}
        border-color: {primaryColor};{"}"}
        .p-inputtext:enabled:focus {"{"}
        box-shadow: 0 0 0 0.2rem {primaryColor} !important;
        {"}"}
        .p-button.p-button-outlined.p-component:hover {"{"}
        background: {highlightColor} !important;
        {"}"}
        .p-dropdown.p-component:hover {"{"}
        border-color: {highlightColor};{"}"}
        .p-dropdown.p-component.p-focus {"{"}
        border-color: {highlightColor}; box-shadow: 0 0 0 0.2rem{" "}
        {highlightColor} !important;
        {"}"}
        .p-dropdown-item.p-highlight {"{"}
        color: {highlightColor} !important; background: {highlightColor}
        !important;
        {"}"}
        .p-button:focus {"{"}
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px {highlightColor}, 0 1px 2px 0
        rgb(0, 0, 0);
        {"}"}
        .p-datatable .p-sortable-column.p-highlight {"{"}
        color: {primaryColor} !important; background: {primaryColor}
        !important; box-shadow: inset 0 0 0 0.2rem {primaryColor} !important;
        {"}"}
        .p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon{" "}
        {"{"}
        color: {primaryColor} !important;
        {"}"}
        .p-toast-message-content {"{"}
        color: {primaryColor};
        {"}"}
        .p-icon.p-toast-message-icon {"{"}
        color: {primaryColor} !important;
        {"}"}
        .p-toast .p-toast-message.p-toast-message-info {"{"}
        background: {highlightColor} !important;
        color: {primaryColor} !important;
        border-color: {primaryColor} !important;
        border-width: 0 0 0 6px;
        {"}"}
        .p-selection-column, .p-editable-column {"{"}
        vertical-align: middle !important;
        {"}"}
        .p-column-header-content {"{"}
        justify-content: center !important;
        {"}"}
        .p-datatable-header div:first-child {"{"}
        align-items: center !important;
        {"}"}
        .p-rating {"{"}
        justify-content: center !important;
        {"}"}
        .p-button-label {"{"}
        max-width: 8rem; overflow: hidden; text-overflow: ellipsis;
        {"}"}
        td[role="cell"] {"{"}
        vertical-align: middle !important;
        {"}"}
      </style>
      <DataTable
        ref={dt}
        tableStyle={{ minWidth: "50rem" }}
        resizableColumns
        size={size}
        value={data}
        header={header}
        footer={footer}
        showGridlines={showGridlines === true}
        stripedRows={stripedRows === true}
        paginator={paginator === true}
        rowsPerPageOptions={rowsPerPageOptions}
        rows={rows}
        sortField={sortField === true}
        removableSort={removableSort === true}
        multiple={multiple === true}
        sortMode={sortMode ? "multiple" : null}
        filters={filter === true ? filters : null}
        scrollHeight="flex"
        selectionMode={
          !isInEditMode &&
          (selectionMode === "multiple" || selectionMode === "single")
            ? selectionMode
            : null
        }
        dragSelection={dragSelection === true}
        emptyMessage={emptyMessage ? emptyMessage : "No results found"}
        selection={isInEditMode ? null : selectedData}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        metaKeySelection={true}
        editMode={editMode}
        onRowEditInit={onRowEditInit}
        onRowEditComplete={onRowEditComplete}
        dataKey="_id"
        editingRows={editingRows}
        onRowEditChange={(event) => {
          setEditingRows(event.data);
        }}
      >
        {!isInEditMode && selectionMode && (
          <Column
            key="select-row"
            selectionMode={selectionMode}
            headerStyle={{ width: "3rem" }}
          ></Column>
        )}
        {localColumns.map(({ field, header, type }, index) =>
          createColumn({ field, header, type }, index)
        )}
        <Column
          key="edit-row"
          rowEditor
          bodyStyle={{ textAlign: "left" }}
        ></Column>
        <Column
          key="delete-row"
          body={({ _id }) => (
            <Button
              icon="pi pi-times"
              rounded
              text
              onClick={() => {
                setData((prevData) =>
                  prevData.filter((item) => item._id !== _id)
                );
                onDelete(_id);
              }}
              severity="danger"
              aria-label="Cancel"
            />
          )}
        />
      </DataTable>
    </div>
  );
}

export default App;