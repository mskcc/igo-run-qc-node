import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../common/card';
import RunsDataGrid from './runsDataGrid';
import { selectRecentRunsData, getRecentRunsData } from './homeSlice';
import { getPicardRunExcel } from '../../services/ngs-stats-service';

export const RecentRuns = () => {
    const dispatch = useDispatch();
    const recentRuns = useSelector(state => selectRecentRunsData(state));
    const [runsWithPicard, setRunsWithPicard] = useState(null);

    useEffect(() => {
      const fetchPicardStats = async () => {
        setRunsWithPicard([]);
        const runNames = recentRuns.map((run) => {return run.runName.split('_laneBarcode.html')[0];});
        
        const runsWithStats = [];
        for( const name of runNames ) {
          await getPicardRunExcel(name)
              .then((resp) => {
                  runsWithStats.push(name);
              })
              .catch((err)=> {
                  console.log(`Picard Stats not available: ${name}`);
              });
        }
        setRunsWithPicard(runsWithStats);
      };

      if (!recentRuns) {
        dispatch(getRecentRunsData());
      } else {
        // Check for runs that have picard stats if recentRuns have been returned, but runsWithPicard has not been set
        if(!runsWithPicard && recentRuns.length > 0){
          // fetchPicardStats();
        }
      }
    });

    return (
        <div>
          <Card>
            <h2 className={'title'}>Recent Runs</h2>
            <div className={'data-container'}>
                <RunsDataGrid runs={recentRuns} runsWithPicard={runsWithPicard}/>
            </div>
          </Card>
        </div>
      );
};

export default RecentRuns;
