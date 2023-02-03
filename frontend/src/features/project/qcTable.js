import React from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

export const QcTable = ({qcSamplesData, columnsToHide, tableHeaders}) => {  

    // numeric columns - needed in order to sort table correctly
    const examinedReadsColumn = tableHeaders.indexOf('Examined Reads');
    const unmappedReadsColumn = tableHeaders.indexOf('Unmapped Reads');
    const requestedReadsColumn = tableHeaders.indexOf('Requested Reads (Millions)');
    const sumReadsColumn = tableHeaders.indexOf('Sum Reads');
    // 10X fields
    const estNumofCellsColumn = tableHeaders.indexOf('Estimated # of Cells');
    const meanReadsPerCellColumn = tableHeaders.indexOf('Mean Reads Per Cell');
    const medianGenesColumn = tableHeaders.indexOf('Median Genes Per Cell');
    const medianUMIColumn = tableHeaders.indexOf('Median UMI Counts Per Cell');
    const numOfReadsColumn = tableHeaders.indexOf('# of Reads');
    const totalGenesColumn = tableHeaders.indexOf('Total Genes Detected');

    const numericColumnIndexes = [
        examinedReadsColumn,
        unmappedReadsColumn,
        requestedReadsColumn,
        sumReadsColumn,
        estNumofCellsColumn,
        meanReadsPerCellColumn,
        medianGenesColumn,
        medianUMIColumn,
        numOfReadsColumn,
        totalGenesColumn
    ];

    return (
        <HotTable
            data={qcSamplesData}
            colHeaders={tableHeaders}
            rowHeaders={true}
            height='auto'
            hiddenColumns={{
                columns: columnsToHide
              }}
            columns={(index) => {
                return {
                  type: (numericColumnIndexes.includes(index)) ? 'numeric': 'text',
                  numericFormat: {
                    pattern: '0,0'
                  }
                };
              }}
            columnSorting={true}
            manualColumnMove={true}
            readOnly={true}
            readOnlyCellClassName={'project-table-row'}
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
    );
};
