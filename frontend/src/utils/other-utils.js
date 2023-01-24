import FileSaver from 'file-saver';
const XLSX = require('xlsx');

export const downloadExcel = (data, headers, fileName) => {
  const xlsxData = Object.assign([], data);
  const translatedXlsxData = mapDataObjKeys(xlsxData, headers);
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(translatedXlsxData);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array'
  });
  const blob = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(blob, fileName + fileExtension);
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

// /**
//  * Outputs the input data string to a downloadable file
//  * @param data, string
//  * @param fileName
//  */
export const downloadHtml = (data, fileName) => {
  const fileType = 'text/html';
  const fileExtension = '.html';
  const blob = new Blob([data], { type: fileType });
  FileSaver.saveAs(blob, fileName + fileExtension);
};
