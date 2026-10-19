import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../common/card';
import RunsDataGrid from './runsDataGrid';
import { selectRecentRunsData, selectTemporalRunsData, getRecentRunsData } from './homeSlice';
import { reportRunName } from '../../resources/runReports';
import { getPicardRunExcel } from '../../services/ngs-stats-service';

export const RecentRuns = () => {
    const dispatch = useDispatch();
    const recentRuns = useSelector(state => selectRecentRunsData(state));
    const temporalRuns = useSelector(state => selectTemporalRunsData(state)) || [];
    const [runsWithPicard, setRunsWithPicard] = useState(null);

    useEffect(() => {
      const fetchPicardStats = async () => {
        setRunsWithPicard([]);
        // Both sections' runs; a run in both is looked up once.
        const runNames = [...new Set([...recentRuns, ...temporalRuns].map((run) => reportRunName(run.runName)))];
        
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
        if(!runsWithPicard && (recentRuns.length > 0 || temporalRuns.length > 0)){
          fetchPicardStats();
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
          <Card>
            <h2 className={'title'}>Temporal Pipeline Runs</h2>
            <div className={'data-container'}>
                <RunsDataGrid runs={temporalRuns} runsWithPicard={runsWithPicard} showRange={false}/>
            </div>
          </Card>
        </div>
      );
};

export default RecentRuns;
