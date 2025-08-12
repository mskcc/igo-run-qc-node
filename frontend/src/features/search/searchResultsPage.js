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
    
    // State management
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [showSkeletonRows, setShowSkeletonRows] = useState(true);
    
    const resultsPerPage = 100;  // Match backend's optimized performance

    // Handle project navigation - memoized for performance
    const handleProjectClick = useCallback((requestId) => {
        console.log(`🔄 [${new Date().toISOString()}] Navigating to project: ${requestId}`);
        history.push(`/projects/${requestId}`);
    }, [history]);

    // Handle pagination - memoized for performance
    const handlePageChange = useCallback((newPage) => {
        const pageChangeStart = performance.now();
        console.log(`📄 [${new Date().toISOString()}] Changing to page ${newPage}`);
        
        const params = new URLSearchParams();
        if (newPage > 1) {
            params.set('page', newPage.toString());
        }
        
        const newUrl = newPage > 1 ? `/search/${searchTerm}?${params.toString()}` : `/search/${searchTerm}`;
        history.push(newUrl);
        
        const pageChangeTime = (performance.now() - pageChangeStart).toFixed(2);
        console.log(`📄 [${new Date().toISOString()}] Page change navigation completed in ${pageChangeTime}ms`);
    }, [history, searchTerm]);

    // Handle retry on error - memoized for performance
    const handleRetry = useCallback(() => {
        fetchPageResults(currentPage, performance.now());
    }, [currentPage]);

    // Fetch results for a specific page
    const fetchPageResults = async (page, componentStartTime) => {
        setIsLoading(true);
        setHasError(false);
        setShowSkeletonRows(true);
        
        try {
            const offset = (page - 1) * resultsPerPage;
            console.log(`📡 [${new Date().toISOString()}] Loading page ${page} (${resultsPerPage} results per page, offset: ${offset})`);
            
            const response = await searchQc(searchTerm, resultsPerPage, offset);
            
            if (response.data && response.data.searchResults) {
                setShowSkeletonRows(false);
                setResults(response.data.searchResults.results || []);
                setTotalResults(response.data.searchResults.total || 0);
                
                const totalTime = (performance.now() - componentStartTime).toFixed(2);
                console.log(`🏁 [${new Date().toISOString()}] Page ${page} loaded in ${totalTime}ms`);
                console.log(`✅ Loaded ${response.data.searchResults.results?.length || 0} results of ${response.data.searchResults.total || 0} total`);
            }
        } catch (error) {
            console.error(`❌ [${new Date().toISOString()}] Page ${page} failed:`, error);
            setHasError(true);
            setShowSkeletonRows(false);
        }
        
        setIsLoading(false);
    };

    // Initialize page from URL and fetch results
    useEffect(() => {
        const componentStartTime = performance.now();
        console.log(`🚀 [${new Date().toISOString()}] SearchResultsPage component mounted for "${searchTerm}"`);
        
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        setCurrentPage(page);
        
        setShowSkeletonRows(true);
        setResults([]);
        
        fetchPageResults(page, componentStartTime);
    }, [searchTerm, location.search]);

    // Generate subtitle based on current state
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