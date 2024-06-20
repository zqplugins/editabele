import React, { useState, useRef, useEffect } from "react";
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
import { FileUpload } from "primereact/fileupload";
import "./App.css";
import "./dynamic-styles.css"
import {getDataFromDatabase} from "./getDataFromDatabase";
import {getColumnsForReact} from "./getColumnsForReact";
import {updatedData} from "./UpdateOrAddObject";
import {deleteData} from "./DeleteDataFromDataBase";

/**
 * @param {(editedRowData, allData) => void} onChangeListener
 * @param {Array<{header: string; field: string; type: string}>} columns
 * @param {Array<{[key: string]: any}>} data
 * @param {{
 *     databaseTableName: string;
 *     progressBarField: string;
 *     reviewsField: string;
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
 *     paddingV: Number,
 *     paddingH: Number,
 *     border_radius: Number,
  *    fontSize: Number,
  *    fontAlignment: String,
  *    fontFamily: String,
 *     fontWeight: Number,
 *     fontColor: String,
 *     rating_color: String,
 *     rating_hover_color: String,
 *     fontAlignmentBody: String
 *
 * }} optionsForPlugin
 * @returns {JSX.Element}
 * @constructor
 */
function App({
  optionsForPlugin,
  onDelete,
  onChangeListener,
}) {
  const {
    databaseTableName,
    progressBarField,
    reviewsField,
    size,
    headerText,
    footerText,
    showGridlines,
    rows,
    rowsPerPageOptions,
    stripedRows,
    paginator,
    editable,
    sortable,
    sortMode,
    sortField,
    removableSort,
    multiple,
    emptyMessage,
    filter,
    selectionMode,
    showValueProgressBar,
    progressBarHeight,
    showAlert,
    alertFieldName,
    alertPosition,
    primaryColor,
    highlightColor,
    progressBarLabelColor,
    paddingV,
    paddingH,
    border_radius,
    fontSize,
    fontAlignment,
    fontAlignmentBody,
    FontFace,
    fontFamily,
    fontWeight,
    fontColor,
    rating_color,
    rating_hover_color,
    headerButtonsHoverColor,
    rowsHoverColor,
    actionsButtonsHoverColor,
    paginationButtonsColorHover,
    lastSelectedRowColor,
  } = optionsForPlugin;

  const [bubbleData, setBubbleData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [frozenData, setFrozenData] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const dt = useRef(null);
  const [localColumns, setLocalColumns] = useState([]);
  const initialDataFetchedRef = useRef(false);

  /**
   * todo: de scris coment ce face
   */

  useEffect(() => {
    getColumnsForReact(databaseTableName, progressBarField, reviewsField).then((columns) => {
      setLocalColumns(columns);
    });
    getDataFromDatabase(databaseTableName).then((data) => {
      setBubbleData(data);
    })
  }, [databaseTableName, progressBarField, reviewsField]);


  useEffect(() => {
    if (bubbleData.length === 0 || initialDataFetchedRef.current) return;
    /** @type {Array} */
    setData(bubbleData);
    initialDataFetchedRef.current = true;
  }, [bubbleData]);


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
    }
  ];

  function changeRgbaAlpha(rgba, newAlpha) {
    let rgbaComponents = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/);

    if (rgbaComponents) {
      let r = rgbaComponents[1];
      let g = rgbaComponents[2];
      let b = rgbaComponents[3];
      let a = newAlpha; // Noua valoare alfa

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      throw new Error("Culoarea nu este într-un format RGBA valid");
    }
  }


  const onRowSelect = (event) => {
    const requiredKey = Object.keys(event.data).find((key) =>
      key?.includes(alertFieldName)
    );

    if (requiredKey && toast?.current) {
      toast.current.show({
        severity: "info",
        summary: "Record selected",
        detail: `Name: ${event.data[requiredKey]}`,
        life: 100000,
      });
    }
    setSelectedData((prevData) => [event.data, ...prevData]);
  };

  const onRowUnselect = (event) => {
    const requiredKey = Object.keys(event.data).find((key) =>
      key?.includes(alertFieldName)
    );

    if (requiredKey && toast?.current) {
      toast.current.show({
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

    if (isNaN(new Date(value))) {
      return "Invalid date";
    }

    return format(new Date(value), "yyyy/MM/dd");
  };

  //todo: coment
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

  const onRowEditComplete = async (e) => {
    let { newData } = e;
    let _data = [...data];

    const isAdding = newData._id.startsWith("--internal");

    await onChangeListener(newData);
    if (isAdding) {
      _data.unshift(newData);
    }

    if (sortable) {
      _data.sort((a, b) => a[sortField] - b[sortField]);
    }

    if (!isAdding) {
      const indexOfEditedObject = _data.findIndex(
        (object) => object._id === newData._id
      );
      _data[indexOfEditedObject] = newData;
    }

    const uniqueData = _data.reduce((acc, current) => {
      const x = acc.find((item) => item._id === current._id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc.map((item) => (item._id === current._id ? current : item));
      }
    }, []);


    if (sortable) {
      uniqueData.sort((a, b) => a[sortField] - b[sortField]);
    }


    const tempId = newData._id;
    const newDataId = await updatedData(databaseTableName, newData);
    newData._id = newDataId;

    setData(_data);
    setFrozenData((prevData) =>
        prevData.filter((item) => item._id !== tempId)
    );
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
      "population.name": {
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
              icon="pi pi-download"
              rounded
              onClick={() => exportCSV(false)}
              data-pr-tooltip="CSV"
          />
          {editable && <Button
              type="button"
              icon="pi pi-plus"
              rounded
              onClick={() => {
                const newTempId = `--internal-${new Date().getTime()}`;
                const newTempObject = {
                  _id: newTempId,
                };

                setFrozenData((prevData) => [newTempObject, ...prevData]);

                setEditingRows((oldEditingRows) => {
                  return {
                    ...oldEditingRows,
                    [newTempId]: true,
                  };
                });
              }}
              data-pr-tooltip="add"
          />}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          onClick={clearFilter}
          size="small"
        />
        <span className="p-input-icon-left">
          <i style={{"fontFamily": 'primeicons'}} className="pi pi-search" />
          <InputText className='w-14rem'
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
        <InputText className="w-full md:w-10rem"
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
          value={options.value <= 100 ? options.value : 0}
          onValueChange={(e) => {
            const value = e.value <= 100 ? e.value : 0;
            options.editorCallback(value);
          }}
        />
      );
    },
    boolean: (field, options) => {
      const value = booleanValue.find(({ name }) => name === String(options.value));

      return (
        <Dropdown
          value={value}
          options={booleanValue}
          onChange={(e) => options.editorCallback(e.value.name === "true")}
          placeholder="Select a Status"
          optionLabel="name"
          className="w-full md:w-8rem"
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
          name="demo[]"
          type="file"
          onSelect={async (event) => {
            const selectedFile = event.files[0];
            const base64Data = await getFileContentBase64(selectedFile);
            const [base64Prefix, base64Content] = base64Data.split(',', 2);
            options.editorCallback({
              filename: selectedFile.name,
              contents: base64Content,
              prefix: base64Prefix,
            });
          }}
        />
      );
    },
  };

  const bodyTemplateByType = {
    image: (field, element) => {
      const maxHeightMap = {
        small: "3rem",
        medium: "4rem",
        large: "5rem",
      };

      const url = element[field]?.contents
        ? `${element[field].prefix},${element[field].contents}`
        : element[field];

      return (
        <img
          src={url}
          style={{ maxHeight: maxHeightMap[size] }}
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
    boolean: (field, element) => {
      return (
        <i style={{'fontFamily':'primeicons'}}
          className={classNames("pi", {
            "text-green-500 pi-check-circle": element[field],
            "text-red-500 pi-times-circle": element[field] === false,
            "": !element[field]
          })
        }
        ></i>
      );
    },
    date: (field, element) => {
      return element[field]
        ? formatDate(element[field])
        : '';
    },
    reviews: (field, element) => {
      return <Rating value={element[field]} readOnly cancel={false} />;
    },
  };

  const createColumn = ({ field, header, type }, index) => {
    return (
      <Column
        bodyClassName={`text-`+ fontAlignmentBody}
        key={field}
        columnKey={field}
        field={field}
        header={header}
        sortable={ !isInEditMode && sortable === true}
        rowEditor={false}
        editor={field === "_id" ? null : editByType[type]?.bind(this, field)}
        body={bodyTemplateByType[type]?.bind(this, field)}
      ></Column>
    );
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      {showAlert && (
        <Toast color={'red'} ref={toast} position={alertPosition} />
      )}
      <style>
        :root {"{"}
        --progress-bar-label-color: {progressBarLabelColor};
        --buttonsColor: {primaryColor};
        --headerButtonsHoverColor: {headerButtonsHoverColor};
        --rowsHoverColor: {rowsHoverColor};
        --actionsButtonsHoverColor: {actionsButtonsHoverColor};
        --paginationButtonsColorHover: {paginationButtonsColorHover};
        --lastSelectedRowColor: {lastSelectedRowColor};
        --highlight-color: {highlightColor};
        --highlight-color-transparent: {changeRgbaAlpha(highlightColor, 0.1)};
        --paddingV:{paddingV}px;
        --paddingH: {paddingH}px;
        --borderRadius: {border_radius}px;
        --faceSize: {fontSize};
        --FontFace: {fontFamily};
        --fontWeight: {fontWeight};
        --fontColor: {fontColor};
        --fontAlignment: {fontAlignment};
        --rating_color: {rating_color};
        --rating_hover_color: {rating_hover_color};
        {"}"}
      </style>
      <DataTable
        ref={dt}
        className="zq-data-table"
        tableStyle={{ minWidth: "50rem", height: "unset" }}
        resizableColumns
        size={size}
        value={data}
        frozenValue={frozenData}
        header={header}
        footer={footer}
        showGridlines={showGridlines === true}
        stripedRows={stripedRows === true}
        paginator={paginator === true}
        rowsPerPageOptions={rowsPerPageOptions}
        rows={rows}
        sortField={sortField === false}
        removableSort={ removableSort === true}
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
        emptyMessage={emptyMessage ? emptyMessage : "No results found"}
        selection={isInEditMode || selectionMode === 'none' ? null : selectedData}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        metaKeySelection={false}
        editMode={"row"}
        onRowEditInit={onRowEditInit}
        onRowEditComplete={onRowEditComplete}
        dataKey="_id"
        editingRows={editingRows}
        onRowEditChange={(event) => {
          setIsInEditMode(() => !isInEditMode);
          setEditingRows(event.data);
        }}
      >
        {!isInEditMode && selectionMode && (
            <Column
              style={{ width: 0 }}
              key="select-row"
              selectionMode={selectionMode}
              body={(...args)=>(
                  <div
                    >hello{JSON.stringify(args)}</div>
              )}
            ></Column>
        )}
        {localColumns.map(({ field, header, type }, index) =>
          createColumn({ field, header, type }, index)
        )}

        {editable && (
          <Column
            key="edit-row"
            rowEditor
            style={{ width: 0 }}
              // bodyStyle={{ textAlign: "left" }}
          ></Column>
        )}
        {editable && (
          <Column
            key="delete-row"
            style={{ width: 0 }}
            body={({ _id }) => (
              <Button
                icon="pi pi-times"
                style={{'fontFamily':'primeicons', width: '2rem', height: '2rem'}}
                rounded
                text
                onClick={() => {
                  if (_id.includes('--internal')) {
                    setFrozenData((prevData) =>
                        prevData.filter((item) => item._id !== _id)
                    );
                  } else {
                    setData((prevData) =>
                        prevData.filter((item) => item._id !== _id)
                    );
                    onDelete(_id);
                    deleteData(databaseTableName, _id);
                  }
                }}
                severity="danger"
                aria-label="Cancel"
                Cancel
              />
            )}
          />
        )}
      </DataTable>
    </div>
  );
}

export default App;
