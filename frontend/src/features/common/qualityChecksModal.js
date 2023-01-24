import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

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

export const QualityChecksModal = ({projectId, entries, onModalClose, isOpen}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onModalClose}
            style={customStyles}
            contentLabel='Quality Checks'
            ariaHideApp={false}
        >
            <div className='modal-fingerprinting-container'>
                <button onClick={onModalClose} className='modal-button'>X</button>
                <div className='modal-header'>
                    <div className='em5'>Fingerprinting</div>
                </div>
                <div className='buttons-container'>
                    {entries && entries.length > 0 ? `${entries}`
                : `No data available for Project ${projectId}`
                }
                </div>
            </div>
        </Modal>
    );
};
