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
    const [searchField, setSearchField] = useState('All Fields');
    
    const resultsPerPage = 100;

    const handleProjectClick = useCallback((requestId) => {
        history.push(`/projects/${requestId}`);
    }, [history]);

    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams(location.search);
        
        if (newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }
        
        // Preserve the searchField parameter
        if (searchField && searchField !== 'All Fields') {
            params.set('field', searchField);
        }
        
        const queryString = params.toString();
        const newUrl = queryString ? `/search/${searchTerm}?${queryString}` : `/search/${searchTerm}`;
        
        history.push(newUrl);
    }, [history, searchTerm, location.search, searchField]);

    const fetchPageResults = useCallback(async (page, field) => {
       
        
        setIsLoading(true);
        setHasError(false);
        setShowSkeletonRows(true);
        
        try {
            const offset = (page - 1) * resultsPerPage;
          
            
            const response = await searchQc(searchTerm, field, resultsPerPage, offset);
           
            
            
            let searchData = null;
            
            if (response && response.data && response.data.searchResults) {
               
                searchData = response.data.searchResults;
            } else if (response && response.searchResults) {
                
                searchData = response.searchResults;
            } else if (response && response.results) {
              
                searchData = response;
            } else if (response && response.data && response.data.results) {
              
                searchData = response.data;
            } else {
               
                console.warn('Response keys:', Object.keys(response || {}));
                searchData = response;
            }
            
          
            
            if (searchData && searchData.results) {
               
              
                setShowSkeletonRows(false);
                setResults(searchData.results || []);
                setTotalResults(searchData.total || 0);
            } else {
               
                setResults([]);
                setTotalResults(0);
                setShowSkeletonRows(false);
            }
        } catch (error) { 
            setHasError(true);
            setShowSkeletonRows(false);
        }
        
        setIsLoading(false);
    }, [searchTerm, resultsPerPage]);

    const handleRetry = useCallback(() => {
        fetchPageResults(currentPage, searchField);
    }, [fetchPageResults, currentPage, searchField]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        
       
        const field = params.get('field') || params.get('searchField') || 'All Fields';
        
       
        
        setCurrentPage(page);
        setSearchField(field);
        
        setShowSkeletonRows(true);
        setResults([]);
        
       
        fetchPageResults(page, field);
    }, [searchTerm, location.search, fetchPageResults]);

    const getSubtitle = () => {
        const fieldDisplay = searchField !== 'All Fields' ? ` in ${searchField}` : '';
        
        if (isLoading) {
            return `Searching for "${searchTerm}"${fieldDisplay}...`;
        }
        if (hasError) {
            return `Search failed for "${searchTerm}"${fieldDisplay}`;
        }
        if (totalResults === 0 && !isLoading) {
            return `No results found for "${searchTerm}"${fieldDisplay}`;
        }
        
        const startResult = totalResults > 0 ? (currentPage - 1) * resultsPerPage + 1 : 0;
        const endResult = Math.min(currentPage * resultsPerPage, totalResults);
        return `Results for "${searchTerm}"${fieldDisplay} (${startResult}-${endResult} of ${totalResults} projects)`;
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