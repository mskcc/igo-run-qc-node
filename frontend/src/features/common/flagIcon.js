import React from 'react';
import { BsFillExclamationCircleFill, BsFillExclamationTriangleFill, BsCheckLg } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { CROSSCHECK_METRICS_FLAG_ERROR, CROSSCHECK_METRICS_FLAG_WARNING } from '../../resources/constants';

export const getFlagIcon = (flagField, key) => {
    if(flagField && Object.keys(flagField).length > 0){
        const flags = Object.keys(flagField);
        const errorFlags = flags.filter((f) => {return flagField[f] === CROSSCHECK_METRICS_FLAG_ERROR;});
        const warningFlags = flags.filter((f) => {return flagField[f] === CROSSCHECK_METRICS_FLAG_WARNING;});

        if(errorFlags.length > 0){
            // ERROR
            return <div className={'flag-container tooltip em5 mskcc-red'}>
                <BsFillExclamationCircleFill />
                <span className={'tooltiptext'}>Checks failed</span>
                { flags.map((flagType) => {
                    return <p key={key}>{flagType}</p>;
                }) }
            </div>;
        } else if (warningFlags.length > 0){
            // WARNING
            return <div className={'flag-container tooltip em5 mskcc-dark-yellow'}>
                <BsFillExclamationTriangleFill />
                <span className={'tooltiptext'}>Inconclusive results</span>
                { flags.map((flagType) => {
                    return <p key={key}>{flagType}</p>;
                }) }
            </div>;
        } else {
            // Quality Checks Passed
            return <div className={'flag-container tooltip em5 mskcc-dark-green'} key={key}>
                <BsCheckLg />
                <span className={'tooltiptext'}>Passed</span>
            </div>;
        }
    }
    // Waiting for results
    return <div className={'flag-container tooltip em5 mskcc-medium-blue'} key={key}>
        <FaEllipsisH />
        <span className={'tooltiptext'}>No data</span>
    </div>;
};
