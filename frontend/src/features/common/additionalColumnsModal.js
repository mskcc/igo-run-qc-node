import React, { useState } from 'react';
import Modal from 'react-modal';
import { getColumnNamesFromIndices } from '../../resources/projectHelper';

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

export const AdditionalColumnsModal = ({isOpen, onModalClose, addColumns, hiddenColumns}) => {
    const [columnsToAdd, setColumnsToAdd] = useState([]);
    const columnsToSelect = getColumnNamesFromIndices(hiddenColumns);

    const handleModalClose = () => {
        setColumnsToAdd([]);
        onModalClose();
    };

    const handleSetColumns = () => {
        addColumns(columnsToAdd);
        handleModalClose();
    };

    const handleColumnChoice = (column) => {
        const columnIndex = columnsToAdd.indexOf(column);
        if (columnIndex === -1) {
            let newColumnList = [];
            newColumnList.push(column);
            newColumnList = newColumnList.concat(columnsToAdd);
            setColumnsToAdd(newColumnList);
        } else {
            const newColumnList = columnsToAdd.filter(colName => colName !== column);
            setColumnsToAdd(newColumnList);
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
                <button onClick={handleModalClose} className='modal-button'>X</button>
                <div className='modal-header'>
                    <div className='em5'>Add Additional Columns</div>
                </div>
                <div className='buttons-container'>
                    {hiddenColumns.length > 0 ? (
                        columnsToSelect.map((column, index) => {
                            const isSelected = columnsToAdd && columnsToAdd.indexOf(column) > -1;
                            return <button
                                    onClick={() => handleColumnChoice(column)}
                                    className={isSelected ? 'column-choice-button column-selected' : 'column-choice-button'}
                                    value={column}
                                    key={`${column}${index}`}
                                >
                                    {column}
                                </button>;
                        })
                )
                : 'No Additional Columns Available'
                }
                </div>
                <button onClick={handleSetColumns} className='ok-button'>Set Columns</button>
            </div>
        </Modal>
    );
};
