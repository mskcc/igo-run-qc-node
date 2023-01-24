import React from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

export const QcTable = ({qcSamplesData, columnsToHide, tableHeaders}) => {
    
    return (
        <HotTable
            data={qcSamplesData}
            colHeaders={tableHeaders}
            rowHeaders={true}
            height='auto'
            hiddenColumns={{
                columns: columnsToHide
              }}
            readOnly={true}
            readOnlyCellClassName={'project-table-row'}
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
    );
};
