import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SeqAnalysis from './seqAnalysis';
import RecentDeliveries from './recentDeliveries';
import RecentRuns from './recentRuns';
import {
  getSeqData,
  getRecentDeliveries,
  getRecentRunsData,
  selectNeedsReviewData,
  selectFurtherSeqData,
  selectPendingRequestsData,
  selectRecentDeliveriesData,
  selectRecentRunsData
} from './homeSlice';

export const HomePage = () => {
  const dispatch = useDispatch();
  const needsReview = useSelector(state => selectNeedsReviewData(state));
  const requiresSequencing = useSelector(state => selectFurtherSeqData(state));
  const awaitingAction = useSelector(state => selectPendingRequestsData(state));
  const recentDeliveries = useSelector(state =>
    selectRecentDeliveriesData(state)
  );
  const recentRuns = useSelector(state => selectRecentRunsData(state));

  useEffect(() => {
    if (!needsReview || !requiresSequencing || !awaitingAction) {
      dispatch(getSeqData());
    }
    if (!recentDeliveries) {
      dispatch(getRecentDeliveries());
    }
    if (!recentRuns) {
      dispatch(getRecentRunsData());
    }
  });

  return (
    <div>
      <SeqAnalysis />
      <RecentDeliveries />
      <RecentRuns />
    </div>
  );
};
