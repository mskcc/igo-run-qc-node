import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getColumnNamesFromIndices } from '../../resources/projectHelper';
import { MdClose } from 'react-icons/md';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

// Modal.setAppElement('#App');

export const AdditionalColumnsModal = ({isOpen, onModalClose, setColumns, allColumns, hiddenColumns}) => {
    const columnsToSelect = getColumnNamesFromIndices(hiddenColumns, allColumns);
    const [currentHiddenNamesList, setCurrentHiddenNamesList] = useState(columnsToSelect);

    useEffect(() => {
        const columnsHidden = getColumnNamesFromIndices(hiddenColumns, allColumns);
        setCurrentHiddenNamesList(columnsHidden);
    }, [isOpen]);

    const handleModalClose = () => {
        onModalClose();
    };

    const handleSetColumns = () => {
        setColumns(currentHiddenNamesList);
        handleModalClose();
    };

    const handleColumnChoice = (column) => {
        // column is hidden, and they click to add column
        if (currentHiddenNamesList.includes(column)) {
            const newColumnList = currentHiddenNamesList.filter(colName => colName !== column);
            setCurrentHiddenNamesList(newColumnList);
        } else {
        // column is shown, and they click to hide it
            let newColumnList = [];
            newColumnList.push(column);
            newColumnList = newColumnList.concat(currentHiddenNamesList);
            setCurrentHiddenNamesList(newColumnList);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleModalClose}
            style={customStyles}
            contentLabel='Add Additional Columns'
            ariaHideApp={false}
        >
            <div className='modal-content-container'>
                <button onClick={handleModalClose} className='modal-button em5'>
                    <MdClose />
                </button>
                <div className='modal-header'>
                    <div className='em5'>Add Additional Columns</div>
                </div>
                <div className='buttons-container'>
                {
                    allColumns.map((column, index) => {
                        //dont allow them to hide qc status
                        if (index === 0) {
                            return '';
                        }
                        const isHidden = currentHiddenNamesList.includes(column);
                        return <button
                                onClick={() => handleColumnChoice(column)}
                                className={isHidden ? 'column-choice-button' : 'column-choice-button column-selected'}
                                value={column}
                                key={`${column}${index}`}
                            >
                                {column}
                            </button>;
                    })
                }
                </div>
                <button onClick={handleSetColumns} className='ok-button'>Set Columns</button>
            </div>
        </Modal>
    );
};
