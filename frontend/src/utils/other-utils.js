import FileSaver from 'file-saver';
const XLSX = require('xlsx');

export const downloadExcel = (data, headers, fileName, columnsToHide = [], userHasModifiedColumns = false) => {
    const xlsxData = Object.assign([], data);
    
    let filteredHeaders = headers;
    let filteredData = xlsxData;
    let exportType = 'complete';
    
    // CASE 1: User hasn't modified columns - Export ALL data
    if (!userHasModifiedColumns) {
        exportType = 'complete';
    } 
    // CASE 2: User has modified columns - Export only visible columns
    else if (columnsToHide && columnsToHide.length > 0) {
        // Get indices of visible columns (not in columnsToHide)
        const visibleColumnIndices = [];
        filteredHeaders = [];
        
        headers.forEach((header, index) => {
            if (!columnsToHide.includes(index)) {
                visibleColumnIndices.push(index);
                filteredHeaders.push(header);
            }
        });
        
        // Filter data to only include visible columns
        filteredData = xlsxData.map(row => {
            return visibleColumnIndices.map(index => row[index]);
        });
        
        exportType = 'filtered';
    }
    
    const translatedXlsxData = filteredHeaders ? mapDataObjKeys(filteredData, filteredHeaders) : filteredData;
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(translatedXlsxData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
    });
    const blob = new Blob([excelBuffer], { type: fileType });
    
    // Filename based on export type
    const finalFileName = exportType === 'filtered' 
        ? `${fileName}_custom_columns` 
        : `${fileName}_complete`;
        
    FileSaver.saveAs(blob, finalFileName + fileExtension);
};

const mapDataObjKeys = (data, keys) => {
    let dataArray = [];
    data.forEach(row => {
        const newRowObj = {};
        row.forEach((datapoint, index) => {
            const keyValue = keys[index];
            newRowObj[keyValue] = datapoint;
        });
        dataArray.push(newRowObj);
    });
    return dataArray;
};

export const downloadHtml = (data, fileName) => {
    const blob = new Blob([data], {type: 'text/html'});
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
};
