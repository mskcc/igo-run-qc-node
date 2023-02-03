import React from 'react';
import Modal from 'react-modal';
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

export const QualityChecksModal = ({onModalClose, isOpen}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onModalClose}
            style={customStyles}
            contentLabel='Quality Checks'
            ariaHideApp={false}
        >
            <div className='modal-fingerprinting-container'>
                <button onClick={onModalClose} className='modal-button em5'>
                    <MdClose />
                </button>
                <div className='modal-header'>
                    <div className='em5'>Fingerprinting Information</div>
                </div>
                <div>
                    <div className={'check-description'}>
                        <div>
                            <p>
                                <span className={'font-bold black-color'}>LOD Score</span>
                                <a href={'http://genomics.broadinstitute.org/data-sheets/POS_DetectionSampleSwapsContaminantsPedigrees_AGBT_2017.pdf'}> (Link)</a>:
                                Numerical result for determining identity created from the logarithm of odds scores combined across a set of selected SNPs.
                                Higher scores indicate greater likelihood of being from the same subject
                            </p>
                            <p>
                                <span className={'font-bold black-color '}>LOD Score, Tumor Aware</span>
                                <a href={'https://gatk.broadinstitute.org/hc/en-us/articles/360036482352-CrosscheckFingerprints-Picard-#--CALCULATE_TUMOR_AWARE_RESULTS'}> (Link)</a>:
                                Assesses identity in the presence of loss-of-heterozygosity (LOH)
                            </p>
                            <p>
                                <span className={'font-bold'}>Result</span>: Result of Fingerprinting
                            </p>
                            <div className={'margin-left-10'}>
                                <p>
                                    <span className={'underline'}>Expected Match</span>: Same sample yielded LOD greater than threshold, <span className={'underline'}>Unexpected Match</span>: Different sample yielded LOD greater than threshold
                                </p>
                                <p>
                                    <span className={'underline'}>Expected Mismatch</span>: Different sample yielded LOD less than threshold, <span className={'underline'}>Unexpected Mismatch</span>: Same sample yielded LOD less than threshold
                                </p>
                                <p>
                                    <span className={'underline'}>Inconclusive</span>: LOD score is less than the absolute value of the threshold
                                </p>
                            </div>
                            <p><span className={'font-bold'}>Current Threshold: </span>3 (Any absolute value lodScore less than this is considered inconclusive)</p>
                            <p><span className={'font-bold'}>More Information</span>: <a href={'https://github.com/broadinstitute/picard/blob/master/docs/fingerprinting/main.pdf'}>Sample Swap</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
