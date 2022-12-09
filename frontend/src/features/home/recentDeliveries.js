import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../common/card';
import DataGrid from './dataGrid';
import { selectRecentDeliveriesData } from './homeSlice';

export const RecentDeliveries = () => {
    const recentDeliveries = useSelector(state => selectRecentDeliveriesData(state));

    return (
        <div>
          <Card>
            <h2 className={'title'}>Recent Deliveries</h2>
            <div className={'data-container'}>
                <DataGrid projects={recentDeliveries}/>
            </div>
          </Card>
        </div>
      );
};

export default RecentDeliveries;
