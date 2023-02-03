/* eslint-disable no-unused-vars */
import React from 'react';
import { Card } from '../common/card';
import { useSelector } from 'react-redux';
import DataGrid from './dataGrid';
import {
  selectFurtherSeqData,
  selectNeedsReviewData,
  selectPendingRequestsData
} from './homeSlice';

export const SeqAnalysis = () => {
  const needsReview = useSelector(state => selectNeedsReviewData(state));
  const requiresSequencing = useSelector(state => selectFurtherSeqData(state));
  const awaitingAction = useSelector(state => selectPendingRequestsData(state));

  return (
    <div>
      <Card>
        <h2 className={'title'}>Sequence Analysis</h2>
        <div className={'data-container'}>
          <h3 className={'title sub-title'}>Needs Review</h3>
          <DataGrid projects={needsReview} />
          <h3 className={'title sub-title'}>Requires Further Sequencing</h3>
          <DataGrid projects={requiresSequencing} />
          <h3 className={'title sub-title'}>Awaiting Further Action</h3>
          <DataGrid projects={awaitingAction} />
        </div>
      </Card>
    </div>
  );
};

export default SeqAnalysis;
