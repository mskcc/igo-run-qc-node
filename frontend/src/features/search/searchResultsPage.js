import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Card } from '../common/card';
import { searchQc } from '../../services/igo-qc-service';
import SearchResultsTable from './SearchResultsTable';
import SearchPagination from './SearchPagination';

export const SearchResultsPage = () => {
    const { searchTerm } = useParams();
    const history = useHistory();
    const location = useLocation();
    
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [showSkeletonRows, setShowSkeletonRows] = useState(true);
    
    const resultsPerPage = 100;

    const handleProjectClick = useCallback((requestId) => {
        history.push(`/projects/${requestId}`);
    }, [history]);

    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams();
        if (newPage > 1) {
            params.set('page', newPage.toString());
        }
        
        const newUrl = newPage > 1 ? `/search/${searchTerm}?${params.toString()}` : `/search/${searchTerm}`;
        history.push(newUrl);
    }, [history, searchTerm]);

    const handleRetry = useCallback(() => {
        fetchPageResults(currentPage);
    }, [currentPage]);

    const fetchPageResults = async (page) => {
        setIsLoading(true);
        setHasError(false);
        setShowSkeletonRows(true);
        
        try {
            const offset = (page - 1) * resultsPerPage;
            const response = await searchQc(searchTerm, resultsPerPage, offset);
            
            if (response.data && response.data.searchResults) {
                setShowSkeletonRows(false);
                setResults(response.data.searchResults.results || []);
                setTotalResults(response.data.searchResults.total || 0);
            }
        } catch (error) {
            setHasError(true);
            setShowSkeletonRows(false);
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        setCurrentPage(page);
        
        setShowSkeletonRows(true);
        setResults([]);
        
        fetchPageResults(page);
    }, [searchTerm, location.search]);

    const getSubtitle = () => {
        if (isLoading) {
            return `Searching for "${searchTerm}"...`;
        }
        if (hasError) {
            return `Search failed for "${searchTerm}"`;
        }
        if (totalResults === 0 && !isLoading) {
            return `No results found for "${searchTerm}"`;
        }
        
        const startResult = totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0;
        const endResult = Math.min(currentPage * resultsPerPage, totalResults);
        return `Results for "${searchTerm}" (${startResult}-${endResult} of ${totalResults} projects)`;
    };

    return (
        <Card>
            <h2 className="title">Search Results</h2>
            <h3 className="sub-title">{getSubtitle()}</h3>
            
            <SearchResultsTable
                results={results}
                showSkeletonRows={showSkeletonRows}
                resultsPerPage={resultsPerPage}
                onProjectClick={handleProjectClick}
                isLoading={isLoading}
                hasError={hasError}
                onRetry={handleRetry}
            />

            {!isLoading && !hasError && (
                <SearchPagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onPageChange={handlePageChange}
                />
            )}
        </Card>
    );
};

export default SearchResultsPage;