import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../common/card';
import DataGrid from './dataGrid';
import { selectRecentDeliveriesData, getRecentDeliveries } from './homeSlice';

export const RecentDeliveries = () => {
    const dispatch = useDispatch();
    const recentDeliveries = useSelector(state => selectRecentDeliveriesData(state));
    
    useEffect(() => {
      if (!recentDeliveries) {
        dispatch(getRecentDeliveries());
      }
    });

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
