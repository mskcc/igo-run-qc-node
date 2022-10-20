import { Card } from '../common/card';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectFurtherSeqData, selectNeedsReviewData, selectPendingRequestsData } from './homeSlice';

export const SeqAnalysis = () => {
    // const { needsReview, requiresSequencing, awaitingAction } = state;
    const needsReview = useSelector((state) => selectNeedsReviewData(state));
    const requiresSequencing = useSelector((state) => selectFurtherSeqData(state));
    const awaitingAction = useSelector((state) => selectPendingRequestsData(state));

    return (
        <div>
            <Card>
                <h3>Sequence Analysis</h3>
                <h4>Needs Review</h4>
                {/* {JSON.stringify(needsReview)} */}
                <h4>Requires Further Sequencing</h4>
                {/* {JSON.stringify(requiresSequencing)} */}
                <h4>Awaiting Further Action</h4>
                {/* {JSON.stringify(awaitingAction)} */}
            </Card>
        </div>
    )
}

export default SeqAnalysis;
