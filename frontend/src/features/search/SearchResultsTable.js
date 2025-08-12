import React, { memo, useCallback } from 'react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

export const SearchResultsTable = memo(({ 
    results, 
    showSkeletonRows, 
    resultsPerPage,
    onProjectClick,
    isLoading,
    hasError,
    onRetry
}) => {
    // Utility function for date formatting - memoized for performance
    const formatDate = useCallback((dateStr) => {
        if (!dateStr || dateStr === 'No QC data') return '';
        try {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch {
            return dateStr;
        }
    }, []);

    // Table headers
    const renderHeaders = () => (
        <thead>
            <tr className="fill-width">
                <th className="light-blue-border" scope="col"></th>
                <th className="light-blue-border" scope="col">PI</th>
                <th className="light-blue-border" scope="col">Type</th>
                <th className="light-blue-border" scope="col">Recipe</th>
                <th className="light-blue-border" scope="col">Request Id</th>
                <th className="light-blue-border" scope="col">Recent Runs</th>
                <th className="light-blue-border" scope="col">Date of Latest Stats</th>
            </tr>
        </thead>
    );

    // Skeleton loading rows
    const renderSkeletonRows = () => (
        <tbody>
            {[...Array(resultsPerPage)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="project-row">
                    <td className="text-align-center light-blue-border">
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s ease-in-out infinite',
                            animationDelay: `${i * 0.05}s`,
                            margin: '0 auto'
                        }}></div>
                    </td>
                    {[...Array(6)].map((_, j) => (
                        <td key={`skeleton-${i}-${j}`} className="text-align-center light-blue-border">
                            <div style={{
                                height: '16px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${(i * 0.05) + (j * 0.02)}s`,
                                margin: '8px 4px',
                                width: `${60 + (j * 10)}%`
                            }}></div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );

    // Real result rows
    const renderResultRows = () => (
        <tbody>
            {results.map((result, index) => (
                <tr 
                    key={`${result.requestId}-${index}`} 
                    className="project-row"
                    style={{ 
                        animation: 'fadeIn 0.3s ease-in',
                        animationDelay: `${index * 0.02}s`,
                        animationFillMode: 'both'
                    }}
                >
                    <td className="text-align-center light-blue-border">
                        <div 
                            className="project-row-link"
                            onClick={() => onProjectClick(result.requestId)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <BsFillArrowRightCircleFill 
                                style={{
                                    fontSize: '24px',
                                    color: '#40b4e5'
                                }}
                            />
                        </div>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p>{result.pi}</p>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p>{result.type}</p>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p>{result.recipe}</p>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p 
                            className="project-row-link hover"
                            onClick={() => onProjectClick(result.requestId)}
                            style={{ color: '#40b4e5', cursor: 'pointer' }}
                        >
                            {result.requestId}
                        </p>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p>{result.recentRuns === 'No runs' ? '' : (result.recentRuns || '')}</p>
                    </td>
                    <td className="text-align-center light-blue-border">
                        <p>{formatDate(result.dateOfLatestStats)}</p>
                    </td>
                </tr>
            ))}
        </tbody>
    );

    // Error display
    const renderError = () => (
        <tbody>
            <tr>
                <td colSpan="7" className="text-align-center light-blue-border">
                    <div style={{ padding: '40px' }}>
                        <p style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '10px' }}>
                            Search failed. Please try again.
                        </p>
                        <button 
                            onClick={onRetry} 
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#40b4e5', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Retry Search
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    );

    // Loading indicator
    const renderLoadingIndicator = () => (
        isLoading && (
            <div className="text-align-center" style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                <div className="dot-elastic" style={{ display: 'inline-block', marginRight: '10px' }}></div>
                <span style={{ animation: 'fadeIn 1s ease-in-out infinite alternate' }}>
                    Searching database...
                </span>
            </div>
        )
    );

    return (
        <>
            <div className="data-container">
                <table className="project-table border-collapse fill-width">
                    {renderHeaders()}
                    {hasError ? renderError() : (showSkeletonRows ? renderSkeletonRows() : renderResultRows())}
                </table>
            </div>
            {renderLoadingIndicator()}
        </>
    );
});

export default SearchResultsTable;