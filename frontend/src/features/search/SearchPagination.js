import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const SearchPagination = ({
    currentPage,
    totalResults,
    resultsPerPage,
    onPageChange
}) => {
    // Calculate pagination data
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const startResult = totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0;
    const endResult = Math.min(currentPage * resultsPerPage, totalResults);

    if (totalPages <= 1) return null;

    const buttonStyle = (disabled) => ({
        backgroundColor: disabled ? '#ccc' : '#40b4e5',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '4px',
        cursor: disabled ? 'default' : 'pointer',
        margin: '0 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
    });

    return (
        <div className="text-align-center" style={{ marginTop: '20px' }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={buttonStyle(currentPage <= 1)}
            >
                <FaChevronLeft /> Previous
            </button>
            
            <span style={{
                margin: '0 20px',
                fontWeight: 'bold',
                color: '#3a3a39',
                fontSize: '14px'
            }}>
                Page {currentPage} of {totalPages}
            </span>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={buttonStyle(currentPage >= totalPages)}
            >
                Next <FaChevronRight />
            </button>
            
            <div style={{
                marginTop: '10px',
                fontSize: '12px',
                color: '#666'
            }}>
                Showing {startResult}-{endResult} of {totalResults} results
            </div>
        </div>
    );
};

export default SearchPagination;