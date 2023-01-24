import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaChartBar, FaDna } from 'react-icons/fa';
import { AiFillFileText } from 'react-icons/ai';
import { MdOutlineDoNotDisturb } from "react-icons/md";
import config from '../../config';
import { getRecentRunsData } from './homeSlice';

export const RunsDataGrid = ({runs, runsWithPicard}) => {
    const dispatch = useDispatch();
    const [numDays, setNumDays] = useState(7);
    const [tempNumDays, setTempNumDays] = useState(numDays);

    const formatRunName = (htmlName) =>{
        if(!htmlName) return '';
        const name = htmlName.split('_laneBarcode.html')[0];
        return name;
    };

    const isValidRange = (n) => {
        const num = parseInt(n);
        if(!Number.isInteger(num)) return false;
        if(num < 1) return false;
        return true;
    };

    const updateRecentRuns = (newDays) => {
      dispatch(getRecentRunsData(newDays));
    };

    const renderRunUpdateBtn = () => {
        const showUpdateBtn = isValidRange(tempNumDays) && (numDays !== tempNumDays);
        if(showUpdateBtn){
            return <div className={'btn-info btn-update width-65px pos-rel inline-block float-right text-align-center hover'}
                 onClick={() => {
                    //TODO SET LOADING STATE!
                     setNumDays(tempNumDays);
                     updateRecentRuns(tempNumDays);
                 }}>
                <p>Update</p>
            </div>;
        }
        return <div></div>;
    };

    const renderHeaders = () => {
        const headers = ['Run Name', 'Date', 'Lane Summary', 'Run Stats', 'Picard Stats'];

        return <thead><tr className='fill-width'>
            { headers.map( (field) =>
                <th className='project-field light-blue-border' key={field}>
                    <p className='font-size-16 font-bold'>{field}</p>
                </th>)
            }
        </tr></thead>;
    };

    const renderRuns = () => {
        const runElements = [];
        for( const run of runs ){
            const name = formatRunName(run.runName);
            const element = <tr className='fill-width project-row' key={run['runName']}>
                <td className='project-field field-header text-align-center light-blue-border' key={`${name}-href`}>
                    <p>{ name }</p>
                </td>
                <td className='project-field field-header text-align-center light-blue-border' key={`${run['runName']}-date`}>
                    <p>{run.date}</p>
                </td>
                <td className='project-field field-header text-align-center light-blue-border' key={`${name}-lane-summary`} target='_blank'>
                    <a href={`/seq-qc/${run.path}`} target='_blank'>
                        <button className='table-btn run-info-button em5'>
                            <AiFillFileText />
                        </button>
                    </a>
                </td>
                <td className={'text-align-center light-blue-border'}>
                    <a href={`${config.SITE_HOME}/${run['runStats']}`}>
                        <button className='table-btn run-info-button em5'>
                            <FaChartBar />
                        </button>
                    </a>
                </td>
                <td className={'text-align-center light-blue-border'}>
                { runsWithPicard && runsWithPicard.has(name) ?
                    <a href={`${config.NGS_STATS}/ngs-stats/get-picard-run-excel/${name}`} target="_blank">
                        <button className="table-btn run-info-button em5">
                            <FaDna />
                        </button>
                    </a>
                        :
                    <div className='no-picard-stats em5'>
                        <MdOutlineDoNotDisturb />
                    </div>
                }
                </td>
            </tr>;
            runElements.push(element);
        }
        return <tbody>{runElements}</tbody>;
    };

    const renderTable = () => {
        if(runs && runs.length !== 0){
            return <table className='project-table border-collapse fill-width'>
                {renderHeaders()}
                {renderRuns()}
            </table>;
        } else {
            return <div><p className={'text-align-center'}>No Runs available</p></div>;
        }
    };

    return (
        <div>
            <div className={'box height-50px inline-block'}>
                <div className={'width-250px pos-rel inline-block text-align-center'}>
                    <label className={'inline-block'}>
                        <p className={'inline-block'}>Runs from past</p>
                        <input className={'width-30px inline-block margin-left-10'}
                               type='text'
                               value={tempNumDays}
                               onChange={(evt) => setTempNumDays(evt.target.value)}
                               />
                        <p className={'inline-block margin-left-10'}>days:</p>
                    </label>
                </div>
                { renderRunUpdateBtn() }
            </div>
            {renderTable()}
        </div>
    );
};

export default RunsDataGrid;
