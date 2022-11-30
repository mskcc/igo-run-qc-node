/* eslint-disable no-unused-vars */
import { Card } from '../common/card';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectFurtherSeqData,
  selectNeedsReviewData,
  selectPendingRequestsData
} from './homeSlice';

export const SeqAnalysis = () => {
  // const { needsReview, requiresSequencing, awaitingAction } = state;
  const needsReview = useSelector(state => selectNeedsReviewData(state));
  const requiresSequencing = useSelector(state => selectFurtherSeqData(state));
  const awaitingAction = useSelector(state => selectPendingRequestsData(state));

  return (
    <div>
      <Card>
        <h2 className={'title'}>Sequence Analysis</h2>
        <h3 className={'title'}>Needs Review</h3>
        {/* {JSON.stringify(needsReview)} */}
        <h3 className={'title'}>Requires Further Sequencing</h3>
        {/* {JSON.stringify(requiresSequencing)} */}
        <h3 className={'title'}>Awaiting Further Action</h3>
        {/* {JSON.stringify(awaitingAction)} */}
      </Card>
    </div>
  );
};

export default SeqAnalysis;
