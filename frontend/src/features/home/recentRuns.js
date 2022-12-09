import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../common/card';
import RunsDataGrid from './runsDataGrid';
import { selectRecentRunsData } from './homeSlice';

export const RecentRuns = () => {
    const recentRuns = useSelector(state => selectRecentRunsData(state));
    
    return (
        <div>
          <Card>
            <h2 className={'title'}>Recent Runs</h2>
            <div className={'data-container'}>
                <RunsDataGrid runs={recentRuns}/>
            </div>
          </Card>
        </div>
      );
};

export default RecentRuns;
