import React, { useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SiMicrosoftexcel } from 'react-icons/si';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { filterDuplicatePairs } from '../../resources/projectHelper';
import { QualityChecksModal } from '../common/qualityChecksModal';
import { selectCrosscheckMetrics } from '../home/homeSlice';
import { downloadExcel } from '../../utils/other-utils';

const types = {
    NUMERIC: 'NUMERIC',
    STRING: 'STRING'
};

const HEADERS = {
    'result': types.STRING,
    'lodScore': types.NUMERIC,
    'lodScoreTumorNormal': types.NUMERIC,
    'lodScoreNormalTumor': types.NUMERIC,
    'igoIdA': types.STRING,
    'igoIdB': types.STRING,
    "tumorNormalA": types.STRING,
    "tumorNormalB": types.STRING,
    "patientIdA": types.STRING,
    "patientIdB": types.STRING
};

export const FingerprintingTable = () => {
    const { projectId } = useParams();
    const selectCrosscheckMetricsData = useSelector(state => selectCrosscheckMetrics(state));
    const [tableData, setTableData] = useState(null);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [columns, setColumns] = useState([]);
    const [colHeaders, setColHeaders] = useState([]);

    useEffect(() => {
        if (projectId && selectCrosscheckMetricsData)  {
            const rawData = selectCrosscheckMetricsData[projectId.toString()];
            if (rawData) {
                const data = filterDuplicatePairs(rawData.entries);
                setTableData(data);
                setColHeaders(Object.keys(HEADERS));
                const cols = getColumns();
                setColumns(cols);
            }
        }
    }, [selectCrosscheckMetricsData]);

    const getColumns = () => {
        return Object.keys(HEADERS).map((header)=>{
            const col = { data: header };
            if(HEADERS[header] === types.NUMERIC){
                col.type = 'numeric';
                col.numericFormat = {pattern: '0,0'};
            }
            return col;
        });
    };

    const handleQualityCheckModalClose = () => {
        setShowDescriptionModal(false);
    };
    const handleQualityCheckModalOpen = () => {
        setShowDescriptionModal(true);
    };
    
    const handleExcel = () => {
        const entries = selectCrosscheckMetricsData[projectId.toString()].entries;
        downloadExcel(entries, null, `${projectId}_fingerprinting`);
    };

    return (
        <div>
            <QualityChecksModal isOpen={showDescriptionModal} onModalClose={handleQualityCheckModalClose} />
            <div className='fingerprint-title'>
                Fingerprinting
            </div>
            <div className='fingerprint-subtitle'>{projectId}</div>
            {tableData ? (
                <div className='icons-container em5 '>
                    <div onClick={handleQualityCheckModalOpen}>
                        <IoInformationCircleOutline />
                    </div>
                    <div onClick={handleExcel}>
                        <SiMicrosoftexcel />
                    </div>
                </div>
                ) :
                    <div className='text-align-center'>No data available for Project {projectId}</div>
                }
                <HotTable
                    licenseKey="non-commercial-and-evaluation"
                    id="fingerprintTable"
                    colHeaders={colHeaders}
                    data={tableData}
                    columns={columns}
                    rowHeaders={true}
                    filters="true"
                    dropdownMenu={['filter_by_value', 'filter_action_bar']}
                    columnSorting={true}
                    manualColumnMove={true}
                />
        </div>
    );
};

export default FingerprintingTable;
