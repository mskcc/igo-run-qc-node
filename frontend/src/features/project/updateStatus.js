import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import Select from 'react-dropdown-select';
import { getProjectQC, setRunStatus } from '../../services/igo-qc-service';
import { setProjectQCData } from './projectSlice';

const availableStatuses = [
    { 
        value: 'Failed',
        label: 'Failed'
    },
    {
        value:  'IGO-Complete',
        label: 'IGO-Complete'
    },
    {
        value:  'New-Library-Needed',
        label: 'New-Library-Needed'
    },
    {
        value:  'Passed',
        label: 'Passed'
    },
    {
        value:  'Recapture-Sample',
        label: 'Recapture-Sample'
    },
    {
        value:  'Repool-Sample',
        label: 'Repool-Sample'
    },
    {
        value:  'Resequence-Pool',
        label: 'Resequence-Pool'
    },
    {
        value:  'Under-Review',
        label: 'Under-Review'
    }
  ];

export const UpdateStatus = ({selectionSubject, handleModalClose, recipe }) => {
    const dispatch = useDispatch();
    const { projectId } = useParams();
    const [newStatus, setNewStatus] = useState('');
    const [samplesSelected, setSamplesSelected] = useState([]); // [ { 'record': '', 'sample': '' }, ...  ]
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [failedStatusChangeSamples, setFailedStatusChangeIds] = useState([]);
    const [successStatusChangeSamples, setSuccessStatusChangeIds] = useState([]);

    // Subscribe to parent's updater for when user selects a sample. Should only happen once
    useEffect(() => {
        selectionSubject.subscribe((update) => {
            if(update.length !== samplesSelected.length || update.length === 0) {
                setSamplesSelected(update);
            }
        });
    }, []);

    const loadNewProjectData = async () => {
        const response = await getProjectQC(projectId);
        if (response.status === 500) {
            setErrorMessage(response.message);
        } else {
            setErrorMessage('');
            const { projectQc } = response.data;
            dispatch(setProjectQCData(projectQc, projectId));
        }
    };

    /**
     * Sends request to submit status change
     */
     const submitStatusChange = () => {
        if (newStatus && samplesSelected.length) {
            setIsLoading(true);
            // const samples = samplesSelected.map((record) => record['sample']).join(', ');
            // const selectedString = records.join(',');
            setSuccessMessage('Loading...');
            
            const sample_fails = [];
            const sample_successes = [];
            for (const selected of samplesSelected) {
                setRunStatus(selected.record, projectId, newStatus, recipe)
                    .then((resp) => {
                        if(resp.data && resp.data.statusResults && resp.data.statusResults.includes(newStatus)){
                            sample_successes.push(selected.sample);
                        } else {
                            sample_fails.push(selected.sample);
                        }
                    })
                    .catch((err) => {
                        setErrorMessage(`Server Error: Failed to set status for ${selected.sample}. ${err}`);
                    });
            }
            setFailedStatusChangeIds(sample_fails);
            setSuccessStatusChangeIds(sample_successes);
            // setRunStatus(selectedString, projectId, newStatus, recipe)
            //     .then((resp) => {
            //         if(resp.data && resp.data.statusResults && resp.data.statusResults.includes(newStatus)){
            //             // Update project info to re-render project table
            //             loadNewProjectData(projectId);
            //             setIsLoading(false);
            //             setSuccessMessage(`Successfully set Samples [${samples}] to ${newStatus}`);
            //             clearSelection();
            //         } else {
            //             const status = 'ERROR';
            //             const failedRuns = resp.data.failedRequests || '';
            //             setIsLoading(false);
            //             setErrorMessage(`${status}: Failed Runs: ${failedRuns}`);
            //         }
            //     })
            //     .catch((err) => {
            //         setSuccessMessage('');
            //         setErrorMessage(`Failed to set Request. ${err}`);
            //     });

            setIsLoading(false);

            if (sample_fails.length > 0) {
                setErrorMessage(`Failed Runs: ${sample_fails.join(', ')}`);
            } else {
                setErrorMessage('');
            }
            if (sample_successes.length > 0) {
                setSuccessMessage(`Successfully set Samples [${sample_successes.join(', ')}] to ${newStatus}`);
            } else {
                setSuccessMessage('');
            }
        
            // setNewStatus('');
            // setSamplesSelected([]);
        }
    };

    const clearSelection = () => {
        setSamplesSelected([]);
        setNewStatus('');
        handleModalClose();
    };

    const handleStatusChoice = (selectChoice) => {
        setNewStatus(selectChoice[0].value);
    };

    return (
        <div className='pos-rel'>
            <div className={'status-change'}>
                <button onClick={clearSelection} className='status-modal-button em5'>
                    <MdClose />
                </button>

                <div className='selected-samples-modal-container'>
                    <div className='selected-title-text'>Selected Samples</div>
                    <div className='samples-container'>
                        {
                            samplesSelected.map((id) => {
                                return <div className={'black-border-bottom'} key={`${id['sample']}-sample`}>
                                    <p className={'padding-for-margin'}>{id['sample']}</p>
                                </div>;
                            })
                        }
                    </div>
                </div>
                <div className='new-status-selection-container'>
                    <span className='status-title-text'>New Status</span>
                    <Select options={availableStatuses} onChange={(choice) => handleStatusChoice(choice)} />
                </div>
                {isLoading && <div className="dot-elastic"></div>}
                <div className='text-align-center mskcc-dark-green overflow-wrap'>{successMessage}</div>
                <div className={'text-align-center mskcc-red overflow-wrap'}>{errorMessage}</div>
                <button onClick={submitStatusChange} className='ok-button' disabled={newStatus === ''}>Update</button>
            </div>
        </div>
    );
};
