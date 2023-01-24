/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card } from '../common/card';
import { useSelector, useDispatch } from 'react-redux';
import DataGrid from './dataGrid';
import {
  selectFurtherSeqData,
  selectNeedsReviewData,
  selectPendingRequestsData,
  getSeqData
} from './homeSlice';

export const SeqAnalysis = () => {
  const dispatch = useDispatch();
  const needsReview = useSelector(state => selectNeedsReviewData(state));
  const requiresSequencing = useSelector(state => selectFurtherSeqData(state));
  const awaitingAction = useSelector(state => selectPendingRequestsData(state));

  useEffect(() => {
    if (!needsReview || !requiresSequencing || !awaitingAction) {
      dispatch(getSeqData());
    }
  });

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
