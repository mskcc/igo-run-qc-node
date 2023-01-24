import React from 'react';
import SeqAnalysis from './seqAnalysis';
import RecentDeliveries from './recentDeliveries';
import RecentRuns from './recentRuns';

export const HomePage = () => {

  return (
    <div>
      <SeqAnalysis />
      <RecentDeliveries />
      <RecentRuns />
    </div>
  );
};
