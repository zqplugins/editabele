let component = ZQ_PrimeReact_DataTable.initializeTable(document.querySelector('#root'))
component.updateData({
    columns:[
        {
            field: "progressBar",
            header: "progressBar",
            type: "ProgressBar"
        },
        {
            field: "boolean",
            header: "boolean",
            type: "booleanForm"
        },
        {
            field: "Modified Date",
            header: "Modified Date",
            type: "date"
        },
        {
            field: "cities",
            header: "Cities",
            type: "text"
        },
        {
            boolean: "boolean",
            boolean: "boolean",
            type: "booleanForm"
        },
        {
            field: "reviews",
            header: "Reviews",
            type: "reviews"
        },
        {
            field: "flag",
            header: "flag",
            type: "image"
        },
        {
            field: "_id",
            header: "_id",
            type: "text"
        },
    ],
    data: [ {
        "aaaaa": 20,
        "Booleanjjjjn": true,
        "Modified Date": "2022-10-31T11:30:37.816Z",
        "Cities": "Lucknow",
        "geonameid": 7798,
        "country": 5,
        "flag": "//s3.amazonaws.com/appforest_uf/f1658141691191x110330066525028200/south_park_PNG47.png",
        "_id": "1620216415210x492801668770853000"
    },
{
    "ProgressBar": 20,
    "Boolean": false,
    "Modified Date": "2022-09-05T12:20:55.227Z",
    "cities": "Vancouver",
    "geonameid": 123123,
    "reviews": 2,
    "flag": "https://bf8f44e389f1639b6b29bfad9c86c7d7.cdn.bubble.io/f1643721157534x541448140222925000/Raimond%20Smith.jpg",
    "_id": "1622487498718x902620800273646800"
},
{
    "ProgressBar": 20,
    "Boolean": true,
    "Modified Date": "2022-10-26T01:42:44.127Z",
    "cities": "Recife",
    "geonameid": 2345,
    "reviews": 4,
    "flag": "https://bf8f44e389f1639b6b29bfad9c86c7d7.cdn.bubble.io/f1643721157534x541448140222925000/Raimond%20Smith.jpg",
    "_id": "1622928193145x925439779516106200"
},
{
    "ProgressBar": 20,
    "Boolean": false,
    "Modified Date": "2022-01-27T22:26:55.642Z",
    "cities": "asda",
    "reviews": 3,
    "_id": "1630068124065x388344039382042600"
},
{
    "ProgressBar": 50,
    "Boolean": true,
    "Modified Date": "2022-07-18T10:56:07.671Z",
    "cities": "Canbera ",
    "reviews": "1620213730709x972471486909325800",
    "flag": "https://bf8f44e389f1639b6b29bfad9c86c7d7.cdn.bubble.io/f1643721157534x541448140222925000/Raimond%20Smith.jpg",
    "_id": "1630068258206x154140881947289380"
},
{
    "ProgressBar": 80,
    "Boolean": false,
    "Modified Date": "2022-07-18T10:50:13.925Z",
    "cities": "Cruella",
    "reviews": 3,
    "_id": "1630068288000x331702892173946900"
},
{
    "ProgressBar": 90,
    "Created By": "1630067898518x698245806919315300",
    "Modified Date": "2021-08-27T12:45:06.512Z",
    "cities": "SADFGHJ",
    "reviews": 5,
    "_id": "1630068306464x481903823635706050"
},
{
    "ProgressBar": 70,
    "Boolean": true,
    "Modified Date": "2021-12-03T11:08:51.786Z",
    "cities": "Buenos Airos",
    "geonameid": 8,
    "reviews": 1,
    "_id": "1638529731741x526514420345291400"
},
{
    "ProgressBar": 40,
    "Boolean": true,
    "Modified Date": "2021-12-03T11:10:42.151Z",
    "cities": "Buenos Airos",
    "geonameid": 888,
    "reviews": 3,
    "_id": "1638529842148x745013794311329500"
},
{
    "ProgressBar": 60,
    "Boolean": true,
    "Modified Date": "2022-07-18T10:54:42.499Z",
    "cities": "Buenos Airos",
    "geonameid": 8888,
    "reviews": 4,
    "flag": "https://bf8f44e389f1639b6b29bfad9c86c7d7.cdn.bubble.io/f1643721157534x541448140222925000/Raimond%20Smith.jpg",
    "_id": "1638529880521x111412818973102740"
},
{
    "ProgressBar": 0,
    "Boolean": false,
    "Modified Date": "2022-07-18T10:54:29.803Z",
    "reviews": 5,
    "flag": "//s3.amazonaws.com/appforest_uf/f1658141666076x529170807406076400/south_park_PNG25.png",
    "_id": "1638534368621x988668735716242400"
},

],
    optionsForPlugin: {
        headerText: "It is header text",
        footerText: "It is footer text",
        showGridlines: true,
        stripedRows:  true,
        size: "small",
        paginator: true,
        sortable: true,
        removableSort: true,
        rowsPerPageOptions: [5, 10, 15, 50],
        rows: 5,
        sortMode: 'multiple',
        filters: true,
        filter: true,
        dragSelection: true
    }
})