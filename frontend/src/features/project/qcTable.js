import React, { useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { UpdateStatus } from './updateStatus';
import { BehaviorSubject } from 'rxjs';

registerAllModules();

export const QcTable = ({qcSamplesData, columnsToHide, tableHeaders, recipe}) => {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [customCells, setCustomCells] = useState([]);
    const [selectionSubject] = useState(new BehaviorSubject([])); // Observable that can emit updates of user-selection
    const [tableRef] = useState(React.createRef());

    // recordIdColumn needed for status update
    let recordColumn = tableHeaders.indexOf('QC Record Id');

    // numeric columns - needed in order to sort table correctly
    const examinedReadsColumn = tableHeaders.indexOf('Examined Reads');
    const unmappedReadsColumn = tableHeaders.indexOf('Unmapped Reads');
    const requestedReadsColumn = tableHeaders.indexOf('Requested Reads (Millions)');
    const sumReadsColumn = tableHeaders.indexOf('Sum Reads');
    const unpairedReadsColumn = tableHeaders.indexOf('Unpaired Reads');
    // 10X fields
    const estNumofCellsColumn = tableHeaders.indexOf('Estimated # of Cells');
    const meanReadsPerCellColumn = tableHeaders.indexOf('Mean Reads Per Cell');
    const medianGenesColumn = tableHeaders.indexOf('Median Genes Per Cell');
    const medianUMIColumn = tableHeaders.indexOf('Median UMI Counts Per Cell');
    const numOfReadsColumn = tableHeaders.indexOf('# of Reads');
    const totalGenesColumn = tableHeaders.indexOf('Total Genes Detected');
    // target coverage columns (for css highlighting)
    const coverageTargetColumn = tableHeaders.indexOf('Coverage Target');
    const sumMeanTargetCoverageColumn = tableHeaders.indexOf('Sum Mean Target Coverage');

    const numericColumnIndexes = [
        examinedReadsColumn,
        unmappedReadsColumn,
        requestedReadsColumn,
        sumReadsColumn,
        unpairedReadsColumn,
        estNumofCellsColumn,
        meanReadsPerCellColumn,
        medianGenesColumn,
        medianUMIColumn,
        numOfReadsColumn,
        totalGenesColumn
    ];

    useEffect(() => {
      let cells = [];
      const numOfRows = qcSamplesData.length;
      console.log(qcSamplesData);
      for (let i = 0; i < numOfRows; i++) {
        // qc status row css
        cells.push({
          row: i,
          col: 0,
          className: 'qc-status-row',
        });
        
        // sum reads row css
        const reqNumReads = parseInt(tableRef.current.hotInstance.getDataAtCell(i, requestedReadsColumn)) * 1000000;
        const sumReads = parseInt(tableRef.current.hotInstance.getDataAtCell(i, sumReadsColumn));
        if (sumReads < reqNumReads) {
          cells.push({
            row: i,
            col: sumReadsColumn,
            className: 'red-highlight',
          });
        }

        // sum mean target coverage css
        const coverageTarget = parseInt(tableRef.current.hotInstance.getDataAtCell(i, coverageTargetColumn));
        const sumMeanCoverageTarget = parseInt(tableRef.current.hotInstance.getDataAtCell(i, sumMeanTargetCoverageColumn));
        if (sumMeanCoverageTarget < coverageTarget) {
          cells.push({
            row: i,
            col: sumReadsColumn,
            className: 'red-highlight',
          });
        }
      }

      setCustomCells(cells);
    }, [qcSamplesData]);

    const handleCloseModal = () => {
      setShowModal(false);
    };

    /**
     * WARNING - Do not propogate events to parent OR modify state. Updating the state will re-render the grid
     * and lose any sorting that the user has done
     */
     const afterSelection = (r1, c1, r2, c2) => {
      const column = tableRef.current.hotInstance.getColHeader(c1);
      if (column !== 'QC Status') {
        return;
      }
      setShowModal(true);
      // get column info to properly set records
      let recordIdColumn;
      let sampleNameColumn;
      const row = tableRef.current.hotInstance.getDataAtRow([r1]);
      for (let i = 0; i < row.length; i++) {
        const columnHeader = tableRef.current.hotInstance.getColHeader(i);
        if (columnHeader === 'QC Record Id') {
          recordIdColumn = i;
          // just in case user moved this column (recordColumn used to update table after status change without reloading the whole table data)
          recordColumn = i;
        }
        if (columnHeader === 'Sample') {
          sampleNameColumn = i;
        }
      }

      // CHILD COMPONENT - Determine if action should be taken on the table
      // Only one column allows user to set the status
      const setStatusIdx = 0;
      if(c1 !== setStatusIdx || c2 !== setStatusIdx) {
          selectionSubject.next([]);
          return;
      };
      const [min, max] = r1 < r2 ? [r1,r2] : [r2, r1];
      const selected = [];
      for(let i = min; i<=max; i++){
          const entry = {
              'record': tableRef.current.hotInstance.getDataAtCell(i, recordIdColumn),
              'sample': tableRef.current.hotInstance.getDataAtCell(i, sampleNameColumn)
          };
          selected.push(entry);
      }
      const unique_selected = selected.filter((run, idx) => selected.indexOf(run) === idx);
      selectionSubject.next(unique_selected);
    };

    // Update data in the grid without having to reload page
    const handleGridUpdate = (newStatus, recordIds) => {
      for (let i = 0; i <= qcSamplesData.length; i++) {
        const rowRecordId = tableRef.current.hotInstance.getDataAtCell(i, recordColumn);
        if (recordIds.includes(rowRecordId)) {
          tableRef.current.hotInstance.setDataAtCell(i, 0, newStatus);
        }
      }
      handleCloseModal();
    };
    // Show error message if getting error when updating status
    const handleGridUpdateError = (samples) => {
      if (samples.length) {
        setErrorMessage(`${samples.toString()}`);
      } else {
        setErrorMessage(null);
      }
    };

    return (
      <div>
        {showModal && <UpdateStatus handleModalClose={handleCloseModal} selectionSubject={selectionSubject} recipe={recipe} handleGridUpdate={handleGridUpdate} handleGridUpdateError={handleGridUpdateError} />}
        {errorMessage && <div className='status-update-error'>Error updating statuses for the following samples:<br></br>{errorMessage}</div>}
        <HotTable
            ref={tableRef}
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
            cell={customCells}
            multiColumnSorting={true}
            manualColumnMove={true}
            readOnly={true}
            readOnlyCellClassName={'project-table-row'}
            filters={true}
            dropdownMenu={['filter_by_value', 'filter_action_bar']}
            fixedColumnsStart={0}
            selectionMode={'multiple'}
            outsideClickDeselects={true}
            afterSelection={afterSelection}
            licenseKey='non-commercial-and-evaluation' // for non-commercial use only
        />
        </div>
    );
};
