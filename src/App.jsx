import React, {useState, useRef, useEffect} from "react";


import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { classNames } from 'primereact/utils';
import {  format } from 'date-fns'
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import './App.css';





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
function App({columns, data: bubbleData, optionsForPlugin, onChangeListener}) {

    const [dataToAdd, setDataToAdd] = useState([]);
    const [dataToDelete, setDataToDelete] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [editingRows, setEditingRows] = useState({});
    const toast = useRef(null);
    const [lockedCustomers, setLockedCustomers] = useState([]);
    const [data, setData] = useState(null);
    const [isInEditMode, setIsInEditMode] = useState(false);
    const fileUploadRef = useRef(null);
    const dt = useRef(null);



    useEffect(() => {
        console.log('setting data');
        /** @type {Array} */
        const completeDataList =
            [...dataToAdd, ...bubbleData]
                .filter(({ _id }) => !dataToDelete.includes(_id));

        setData(completeDataList);
    }, [bubbleData, dataToAdd, dataToDelete, setData]);

    const [filters, setFilters] = useState({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    });

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };


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
        fixedHeader,
        editable,
        editMode,
        showValueProgressBar,
        progressBarHeight,
        showAlert,
        alertPosition,
    } = optionsForPlugin;

    const booleanValue = [
        {
            name: 'true',
        },
        {
            name: 'false',
        },
    ];

    const onRowSelect = (event) => {
        toast?.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.cities}`, life: 3000 });
    };

    const onRowUnselect = (event) => {
        console.log(event)
        toast?.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.cities}`, life: 3000 });
    };

    const footer = footerText;

    const formatDate = (value) => {
        if (!value) {
            return 'Missing date';
        }

        if (!isNaN(new Date(value))) {
            return 'Invalid date';
        }

        return format(new Date(value), 'yyyy/MM/dd')
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
        setIsInEditMode(true );
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

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            ProgressBar: { value: null, matchMode: FilterMatchMode.BETWEEN },
            Boolean: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
    };


    const header = (
        <>
            <div className="flex justify-content-between mb-2">
                <span className="">{headerText}</span>
                <div className="flex gap-2">
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV"/>
                </div>
                <div className="flex gap-2">
                    <Button type="button" icon="pi pi-plus" rounded onClick={() => {
                        const newTempId = `--internal-${new Date().getTime()}`;
                        const newTempObject = {
                            _id: newTempId,
                        };

                        setDataToAdd((oldDataToAdd) => {
                            return [newTempObject, ...oldDataToAdd];
                        });

                        setEditingRows((oldEditingRows) => {
                            return {
                                ...oldEditingRows,
                                [newTempId]: true,
                            };
                        })
                    }} data-pr-tooltip="add"/>
                </div>
            </div>
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={filters.global.value} onChange={onGlobalFilterChange } placeholder="Global Search" />
             </span>
            </div>
        </>

    );


    const editByType = {
        text: (field, options) => {
            return <InputText type="text" value={options.value}
                              onChange={(e) => options.editorCallback(e.target.value)}/>;
        },
        reviews: (field, options) => {
            return <Rating value={options.value} onChange={(e) => options.editorCallback(e.value)}
                           cancel={false}></Rating>
        },
        number: (field, options) => {
            return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)}/>
        },
        ProgressBar: (field, options) => {
            return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)}/>
        },
        booleanForm: (field, options) => {
            const value = typeof options.value === 'object'
                ? options.value
                : booleanValue.find(({name}) => name === String(options.value));

            return (
                <Dropdown
                    value={value}
                    options={booleanValue}
                    onChange={(e) => options.editorCallback(e.value.name === 'true')}
                    placeholder="Select a Status"
                    optionLabel="name"
                    className="w-full md:w-14rem"
                />
            );
        },
        date: (field, options) => {
            return <Calendar value={options.value} onChange={(e) => options.editorCallback(e.value)} showWeek/>
        },
        image: (field, options) => {
            return <FileUpload
                mode="basic"
                accept="image/*"
                maxFileSize={1_000_000}
                onSelect={async (event) => {
                    console.log('onSelect');
                    const selectedFile = event.files[0];
                    const base64Data = await getFileContentBase64(selectedFile);
                    options.editorCallback({
                        name: selectedFile.name,
                        data: base64Data,
                    });
                }}
            />;
        },
    };

    const bodyTemplateByType = {
        image: (field, element) => {
            return <img src={element[field]} style={{ maxHeight: '4rem' }} className="w-6rem shadow-2 border-round"/>;
        },
        ProgressBar: (field, element) => {
            return <ProgressBar value={element[field]} showValue={showValueProgressBar} style={{ height: `${progressBarHeight}px`, color: "#000"}}></ProgressBar>;
        },
        booleanForm: ( field, element ) =>{
            return   <i className={classNames('pi', { 'text-green-500 pi-check-circle': element[field], 'text-red-500 pi-times-circle':  !element[field] })} ></i>;
        },
        date: ( field, element ) => {
            return  formatDate(element[field]);
        },
        reviews: ( field, element) => {
            return <Rating value={element[field]} readOnly cancel={false} />;
        }

    };




    const createColumn = ({field, header, type}, index) => {
        return <Column
            bodyClassName="text-center"
            key={field}
            columnKey={field}
            field={field}
            header={header}
            sortable={sortable === true}
            rowEditor={false}
            editor={field === '_id' ? null : editByType[type]?.bind(this, field)}
            body={bodyTemplateByType[type]?.bind(this, field)}
        >
        </Column>
    };
    return (
        <div className="card" style={{height: '100%'}}>
            {(showAlert) && <Toast ref={toast} position={alertPosition}/>}
            <style>
                :root {'{'}
                    --data-table--button-gap: 123px;
                {'}'}
            </style>
            <DataTable
                ref={dt}
                tableStyle={{minWidth: '50rem'}}
                resizableColumns
                //columnResizeMode='expand'
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
                selectionMode={!isInEditMode && (selectionMode === "multiple" || selectionMode === "single") ? selectionMode : null}
                dragSelection={dragSelection === true}
                emptyMessage={emptyMessage ? emptyMessage : "No results found"}
                selection={isInEditMode ? null : selectedData}
                frozenValue={lockedCustomers}
                onSelectionChange={isInEditMode ? null : (e) => setSelectedData(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
                metaKeySelection={true}
                editMode={editMode}
                onRowEditInit={onRowEditInit}
                onRowEditComplete={onRowEditComplete}
                dataKey='_id'
                editingRows={editingRows}
                onRowEditChange={(event) => {
                    setEditingRows(event.data);
                }}
            >
                {
                    !isInEditMode && selectionMode && <Column key="select-row" selectionMode={selectionMode} headerStyle={{width: '3rem'}}></Column>
                }
                {
                    columns.map(({field, header, type}, index) => (
                        createColumn({field, header, type}, index)
                    ))
                }
                <Column key="edit-row" rowEditor
                        bodyStyle={{textAlign: 'left'}} >
                </Column>
                <Column key="delete-row" body={({ _id }) => (
                    <Button icon="pi pi-times" rounded text onClick={() => {
                        setDataToDelete((oldDataToDelete) => {
                            return [
                                ...oldDataToDelete,
                                _id,
                            ];
                        });
                    }} severity="danger" aria-label="Cancel" />
                )} />
            </DataTable>
        </div>
    );
}

export default App;
