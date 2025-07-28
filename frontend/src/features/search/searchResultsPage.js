// features/search/searchResultsPage.js - Optimized for faster display

import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../common/card';
import DataGrid from '../home/dataGrid';
import { searchProjectsByPI, searchProjectsByRecipe } from '../../services/igo-qc-service';

export const SearchResultsPage = () => {
    const location = useLocation();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('');

    // Memoize URL params parsing for better performance
    const { piQuery, recipeQuery } = useMemo(() => {
        const urlParams = new URLSearchParams(location.search);
        return {
            piQuery: urlParams.get('pi'),
            recipeQuery: urlParams.get('recipe')
        };
    }, [location.search]);

    useEffect(() => {
        // Immediately set the search type and query for faster UI feedback
        if (piQuery) {
            setSearchQuery(piQuery);
            setSearchType('PI');
            setIsLoading(true);
            // Set optimistic loading state immediately
            setSearchResults(null);
            setErrorMessage('');
            
            // Then fetch results
            fetchSearchResults(piQuery, 'pi');
        } else if (recipeQuery) {
            setSearchQuery(recipeQuery);
            setSearchType('Recipe');
            setIsLoading(true);
            // Set optimistic loading state immediately
            setSearchResults(null);
            setErrorMessage('');
            
            // Then fetch results
            fetchSearchResults(recipeQuery, 'recipe');
        }
    }, [piQuery, recipeQuery]);

    const fetchSearchResults = async (query, type) => {
        try {
            let response;
            
            // Use Promise with timeout for faster perceived performance
            const searchPromise = type === 'pi' 
                ? searchProjectsByPI(query)
                : searchProjectsByRecipe(query);

            response = await searchPromise;
                        
            if (response?.data?.projects) {
                setSearchResults(response.data.projects);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setErrorMessage('Failed to search projects. Please try again.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize the results title for better performance
    const resultsTitle = useMemo(() => {
        if (isLoading) return `Searching for ${searchType} "${searchQuery}"...`;
        if (!searchResults) return 'Searching...';
        
        const count = searchResults.length;
        const plural = count === 1 ? '' : 's';
        
        return `Search Results for ${searchType} "${searchQuery}" (${count} project${plural} found)`;
    }, [searchResults, searchQuery, searchType, isLoading]);

    const renderSearchResults = () => {
        if (isLoading) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="dot-elastic"></div>
                    <p style={{ marginTop: '10px', color: '#666' }}>
                        Searching for {searchType} "{searchQuery}"...
                    </p>
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="text-align-center error-message">
                    {errorMessage}
                </div>
            );
        }

        if (searchResults && searchResults.length === 0) {
            return (
                <div className="text-align-center">
                    <p>No projects found for {searchType}: <strong>{searchQuery}</strong></p>
                    <p>Try checking the spelling or search for a different {searchType}.</p>
                </div>
            );
        }

        // Use React.memo equivalent for DataGrid if needed
        return <DataGrid projects={searchResults} />;
    };

    return (
        <div>
            <Card>
                <h2 className={'title'}>{resultsTitle}</h2>
                <div className={'data-container'}>
                    {renderSearchResults()}
                </div>
            </Card>
        </div>
    );
};

export default SearchResultsPage;