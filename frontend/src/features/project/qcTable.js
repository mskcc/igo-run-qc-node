/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { textRenderer } from 'handsontable/renderers/textRenderer';
import 'handsontable/dist/handsontable.full.min.css';
import { UpdateStatus } from './updateStatus';
import { BehaviorSubject } from 'rxjs';
import { isHighUnmapped } from '../../resources/projectHelper';
import { NO_NGS_STATS_LABEL } from '../../resources/constants';
import { webSummaryShortLabel, webSummaryLabel, webSummaryHref } from '../../resources/webSummaries';

registerAllModules();

export const WEB_SUMMARY_HEADER = 'Web Summary';

/**
 * webSummaryLinks: one entry per row of qcSamplesData (webSummaryRowLinks). When any row has a
 * published summary, the table shows a Web Summary column after Sample with each row's links.
 * The column is the table's own: qcSamplesData, tableHeaders and columnsToHide (and so the Excel
 * download and Set Columns) don't include it.
 */
export const QcTable = ({qcSamplesData: sampleRows, columnsToHide: hiddenDataColumns, tableHeaders: dataHeaders, recipe, webSummaryLinks = []}) => {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [customCells, setCustomCells] = useState([]);
    const [selectionSubject] = useState(new BehaviorSubject([])); // Observable that can emit updates of user-selection
    const [tableRef] = useState(React.createRef());
    const webSummaryLinksRef = useRef(webSummaryLinks);
    webSummaryLinksRef.current = webSummaryLinks;

    // The Web Summary column goes after Sample, as a copy of the rows with one more cell: the
    // row's link labels ('Temporal FB'), which the column's filter and sort use. Everything below
    // works on these display headers and rows, by header name, so it needs no other change.
    const hasWebSummaries = webSummaryLinks.some(links => links && links.published.length > 0);
    const dataSampleColumn = dataHeaders.indexOf('Sample');
    const webSummaryColumn = hasWebSummaries && dataSampleColumn >= 0 ? dataSampleColumn + 1 : -1;
    const tableHeaders = useMemo(() => webSummaryColumn < 0 ? dataHeaders
      : [...dataHeaders.slice(0, webSummaryColumn), WEB_SUMMARY_HEADER, ...dataHeaders.slice(webSummaryColumn)],
      [dataHeaders, webSummaryColumn]);
    const qcSamplesData = useMemo(() => webSummaryColumn < 0 ? sampleRows
      : sampleRows.map((row, i) => {
          const links = webSummaryLinks[i];
          const labels = links ? links.published.map(webSummaryShortLabel).join(', ') : '';
          return [...row.slice(0, webSummaryColumn), labels, ...row.slice(webSummaryColumn)];
        }),
      [sampleRows, webSummaryLinks, webSummaryColumn]);
    const columnsToHide = webSummaryColumn < 0 ? hiddenDataColumns
      : hiddenDataColumns.map(i => (i >= webSummaryColumn ? i + 1 : i));

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
    // ONT fields
    const readsColumn = tableHeaders.indexOf('Reads');
    const basesColumn = tableHeaders.indexOf('Bases');
    const n50Column = tableHeaders.indexOf('N50');
    const medianReadLengthColumn = tableHeaders.indexOf('Median Read Length');
    const estimatedCoverageColumn = tableHeaders.indexOf('Estimated Coverage');
    // target coverage columns (for css highlighting)
    const coverageTargetColumn = tableHeaders.indexOf('Coverage Target');
    const sumMeanTargetCoverageColumn = tableHeaders.indexOf('Sum Mean Target Coverage');
    // rows the backend's QC_STATS_SOURCE=ngs-stats found no stats for (css greying)
    const statsVersionColumn = tableHeaders.indexOf('Stats Version');
    const hasNoStatsRows = statsVersionColumn >= 0 && qcSamplesData.some(row => row[statsVersionColumn] === NO_NGS_STATS_LABEL);

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
        totalGenesColumn,
        readsColumn,
        basesColumn,
        n50Column,
        medianReadLengthColumn,
        estimatedCoverageColumn,
        sumMeanTargetCoverageColumn
    ].filter((index) => index >= 0);

    // Whole-number display columns (no decimal places) across request types.
    const integerDecimalNumericColumns = [
        readsColumn,
        n50Column,
        medianReadLengthColumn,
        sumReadsColumn,
        requestedReadsColumn,
        examinedReadsColumn,
        unpairedReadsColumn,
        unmappedReadsColumn,
        estNumofCellsColumn,
        meanReadsPerCellColumn,
        medianGenesColumn,
        medianUMIColumn,
        numOfReadsColumn,
    ].filter((index) => index >= 0);

    useEffect(() => {
      let cells = [];
      const numOfRows = qcSamplesData.length;

      for (let i = 0; i < numOfRows; i++) {
        // qc status row css
        cells.push({
          row: i,
          col: 0,
          className: 'qc-status-row',
        });
        
        // sum reads row css
        // const reqNumReads = parseInt(tableRef.current.hotInstance.getDataAtCell(i, requestedReadsColumn)) * 1000000;
        // const sumReads = parseInt(tableRef.current.hotInstance.getDataAtCell(i, sumReadsColumn)) || qcSamplesData[i][3];
        // if (sumReads < reqNumReads) {
        //   cells.push({
        //     row: i,
        //     col: sumReadsColumn,
        //     className: 'red-highlight',
        //   });
        // }

        // sum mean target coverage css
        // const coverageTarget = parseInt(tableRef.current.hotInstance.getDataAtCell(i, coverageTargetColumn)) || qcSamplesData[i][5];
        // const sumMeanCoverageTarget = parseInt(tableRef.current.hotInstance.getDataAtCell(i, sumMeanTargetCoverageColumn)) || parseInt(qcSamplesData[i][6]);
        // if (sumMeanCoverageTarget < coverageTarget) {
        //   cells.push({
        //     row: i,
        //     col: sumMeanTargetCoverageColumn,
        //     className: 'red-highlight',
        //   });
        // }
      }

      setCustomCells(cells);
    }, [qcSamplesData]);

    // The Web Summary cell: a link to each of the row's web summaries.
    // Handsontable passes the visual row; the links are in the data's (physical) order.
    function webSummaryRenderer(instance, td, row, col, prop, value, cellProperties) {
      textRenderer.call(this, instance, td, row, col, prop, '', cellProperties);
      const links = webSummaryLinksRef.current[instance.toPhysicalRow(row)];
      if (!links || !links.published.length) {
        return td;
      }
      const container = document.createElement('span');
      container.className = 'web-summary-links';
      // A click on a link opens it, without selecting the cell under it.
      container.addEventListener('mousedown', event => event.stopPropagation());
      links.published.forEach(summary => {
        const a = document.createElement('a');
        a.className = 'web-summary-link';
        a.href = webSummaryHref(summary);
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.title = `Open ${webSummaryLabel(summary)} for ${links.name}`;
        a.textContent = `${webSummaryShortLabel(summary)} ↗`;
        container.appendChild(a);
      });
      td.appendChild(container);
      return td;
    }

    // Unmapped Reads cell css when too many of the run's read pairs didn't map, e.g. a contaminated library.
    // Handsontable passes physical indexes, so the highlight stays with its sample when the table is sorted.
    // Always set className on this column: the meta is kept, so a stale highlight would otherwise stick.
    // A row with no ngs-stats is greyed in every cell but QC Status (column 0 keeps its own css).
    const highlightHighUnmapped = (row, col) => {
      const rowData = qcSamplesData[row] || [];
      const noStats = hasNoStatsRows && col !== 0 && rowData[statsVersionColumn] === NO_NGS_STATS_LABEL;
      if (col !== unmappedReadsColumn) {
        if (!hasNoStatsRows || col === 0) {
          return undefined;
        }
        return { className: noStats ? 'no-ngs-stats' : '' };
      }
      const high = isHighUnmapped(rowData[examinedReadsColumn], rowData[unpairedReadsColumn], rowData[unmappedReadsColumn]);
      return { className: [high ? 'high-unmapped' : '', noStats ? 'no-ngs-stats' : ''].filter(Boolean).join(' ') };
    };

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
      let recipeColumn;
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
	if (columnHeader === 'Recipe') {
          recipeColumn = i;
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
        if(i<0)
        {
            continue;
        }
          const entry = {
              'record': tableRef.current.hotInstance.getDataAtCell(i, recordIdColumn),
              'sample': tableRef.current.hotInstance.getDataAtCell(i, sampleNameColumn),
	      'recipe': tableRef.current.hotInstance.getDataAtCell(i, recipeColumn)
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
                const isNumeric = numericColumnIndexes.includes(index);
                const useIntegerPattern = integerDecimalNumericColumns.includes(index);
                const col = {
                  type: isNumeric ? 'numeric' : 'text',
                };
                if (isNumeric) {
                  col.numericFormat = {
                    pattern: useIntegerPattern ? '0,0' : '0,0.00',
                  };
                }
                if (index === webSummaryColumn) {
                  col.renderer = webSummaryRenderer;
                }
                return col;
            }}
            cell={customCells}
            cells={highlightHighUnmapped}
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
