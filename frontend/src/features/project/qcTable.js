import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { UpdateStatus } from './updateStatus';
import { BehaviorSubject } from 'rxjs';

registerAllModules();

export const QcTable = ({qcSamplesData, columnsToHide, tableHeaders, recipe}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectionSubject] = useState(new BehaviorSubject([])); // Observable that can emit updates of user-selection
    const [tableRef] = useState(React.createRef());

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

    const handleCloseModal = () => {
      setShowModal(false);
    };

    /**
     * WARNING - Do not propogate events to parent OR modify state. Updating the state will re-render the grid
     * and lose any sorting that the user has done
     */
     const afterSelection = (r1, c1, r2, c2) => {
      setShowModal(true);
      // get column info to properly set records
      let recordIdColumn;
      let sampleNameColumn;
      const row = tableRef.current.hotInstance.getDataAtRow([r1]);
      for (let i = 0; i < row.length; i++) {
        const columnHeader = tableRef.current.hotInstance.getColHeader(i);
        if (columnHeader === 'QC Record Id') {
          recordIdColumn = i;
        }
        if (columnHeader === 'Sample') {
          sampleNameColumn = i;
        }
      }

      // PARENT COMPONENT - propogate event up
      // this.props.onSelect(this.state.displayedData[r1]);

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

    return (
      <div>
        {showModal && <UpdateStatus handleModalClose={handleCloseModal} selectionSubject={selectionSubject} recipe={recipe}/>}
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
            columnSorting={true}
            manualColumnMove={true}
            readOnly={true}
            readOnlyCellClassName={'project-table-row'}
            filters='true'
            dropdownMenu={['filter_by_value', 'filter_action_bar']}
            selectionMode={'multiple'}
            outsideClickDeselects={true}
            afterSelection={afterSelection}
            licenseKey='non-commercial-and-evaluation' // for non-commercial use only
        />
        </div>
    );
};
