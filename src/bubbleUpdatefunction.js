function(instance, properties, context) {

    const {
        data_source: dataSource,
        reviewsField,
        progressBarField,
        size,
        headerText,
        footerText,
        showGridlines,
        paginator,
        sortable,
        removableSort,
        rowsPerPageOptions,
        dragSelection,
        selectionMode,
        editable,
        editMode,
        showValueForProgresBar,
        progress_bar_height,
        stripedRows,
        showAlert,
        alert_postion
    } = properties;


    const rowsPerPageOptionsArray = rowsPerPageOptions.split(',');
    const rowsPerPageOptionsArrayWithNumber = rowsPerPageOptionsArray.map( item => {
        return Number(item)
    });


    const arrayLength = dataSource.length();
    const optionsForPlugin = {
        size: size.toLowerCase().trim(),
        headerText: headerText,
        stripedRows: stripedRows,
        footerText: footerText,
        showGridlines: showGridlines,
        paginator,
        rowsPerPageOptions: rowsPerPageOptionsArrayWithNumber,
        rows: rowsPerPageOptionsArrayWithNumber[0],
        sortable: sortable,
        sortMode: 'multiple',
        removableSort: removableSort,
        dragSelection: true,
        selectionMode: selectionMode.trim(),
        editable : editable,
        editMode: editMode,
        progressBarHeight: progress_bar_height,
        showAlert: showAlert,
        alertPosition: alert_postion
    };
    console.log(progressBarField)

    if (arrayLength) {
        const data = dataSource.get(0, arrayLength);
        const dataColumns = data[0].listProperties()
            .filter((columnName) => columnName.includes('_') && columnName !== '_id'
            );

        const columnsForReact = dataColumns.map((columnName) => {
            const splitColumName = columnName.split('_')
            const mappedColumnName = splitColumName[0];

            let columnType ='';
            if(columnName.includes('_custom_')){
                columnType = 'text'
            } else if (columnName.includes(progressBarField.toLowerCase())){
                columnType = 'ProgressBar'
            }else if(columnName.includes(reviewsField.toLowerCase())){
                columnType =  'reviews';
            } else {
                columnType =  splitColumName.reverse()[0];
            }
            return {
                field: columnName,
                header: mappedColumnName,
                type: columnType
            };
        });

        const valuesForReact = data.map((item, index) => {
            const rowValues = dataColumns.reduce((rowValues, columnName) => {
                const columnValue = item.get(columnName);

                rowValues[columnName] = columnName.includes('_custom_')
                    ? columnValue?.get('_id')
                    : columnValue;
                return rowValues;
            }, {
                id: item.get('_id'),
            });

            return rowValues;
        });


        let t = {

            "_api_c2_cities": "Vancouver123",
            "_api_c2_geonameid": 123123,
            "_api_c2_country": "1620213755808x263657908016181150",
            "_api_c2_flag": "//s3.amazonaws.com/appforest_uf/f1658141700823x182753941247680640/south_park_PNG1.png",
            "_api_c2_progressbar": 68,
            "_api_c2_reviews": 4
        }

        instance.publishState('test',  t);


        const sendInDataBase = (updatedData) => {
            const fileName = updatedData.flag_image.name;
            const fileDate = updatedData.flag_image.data.split('base64,')[1];
            const file = {
                'filename': fileName,
                'contents': fileDate
            }

            const t = {
                "Cantry": "India",
                "Population": 1000000000,
                "ProgressBar": 56,
                "Reviews": 5,
                "flag": file
            }

            const bubbleComponent = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(t)
            }

            const url = 'https://zeroqode-demo-01.bubbleapps.io/version-test/api/1.1/obj/tabel'
            fetch(url, bubbleComponent);
        };

        instance.data.primeDataTable.updateData({
            columns: columnsForReact,
            data: valuesForReact,
            optionsForPlugin: optionsForPlugin,
            onChangeListener(updatedData) {
                console.log('data changed, saving to bubble?')
                console.log(updatedData);
            }
        });
    }
}