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

    useEffect(() => {
        if (failedStatusChangeSamples.length > 0) {
            setErrorMessage(`Failed Runs: ${failedStatusChangeSamples.join(', ')}`);
        } else {
            setErrorMessage('');
        }
        if (successStatusChangeSamples.length > 0) {
            setSuccessMessage(`Successfully set Samples [${successStatusChangeSamples.join(', ')}] to ${newStatus}`);
        } else {
            setSuccessMessage('');
        }
    }, [failedStatusChangeSamples, successStatusChangeSamples]);

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
     const submitStatusChange = async () => {
        if (newStatus && samplesSelected.length) {
            setIsLoading(true);
            setSuccessMessage('Loading...');
            
            const sample_fails = [];
            const sample_successes = [];
            for (const selected of samplesSelected) {
                await setRunStatus(selected.record, projectId, newStatus, recipe)
                    .then((resp) => {
                        if(resp.data && resp.data.statusResults && resp.data.statusResults.includes(newStatus)){
                            sample_successes.push(selected.sample);
                            setSuccessStatusChangeIds(sample_successes);
                        } else {
                            sample_fails.push(selected.sample);
                            setFailedStatusChangeIds(sample_fails);
                        }
                    })
                    .catch((err) => {
                        setErrorMessage(`Server Error: Failed to set status for ${selected.sample}. ${err}`);
                    });
            }
            setIsLoading(false);
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
                <div className={successMessage ? 'text-align-center mskcc-dark-green overflow-wrap status-set-text' : 'hidden'}>{successMessage}</div>
                <div className={errorMessage ? 'text-align-center mskcc-red overflow-wrap status-set-text' : 'hidden'}>{errorMessage}</div>
                <button onClick={submitStatusChange} className='ok-button' disabled={newStatus === ''}>Update</button>
            </div>
        </div>
    );
};
