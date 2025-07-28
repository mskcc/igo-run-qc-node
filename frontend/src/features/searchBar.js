// features/searchBar.js - Enhanced with immediate feedback

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch, FaSpinner } from 'react-icons/fa';

export const SearchBar = () => {
    const history = useHistory();
    const [projectSearch, setProjectSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleOnChange = (e) => {
        const query = e.target.value || '';
        setProjectSearch(query.toUpperCase().trim());
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!projectSearch) return;

        // Show immediate loading feedback
        setIsSearching(true);

        // Smart detection: Check if it looks like a project ID
        const projectIdPatterns = [
            /^\d{4,6}$/,           // 4-6 digits like "17447"
            /^\d{4,6}_[A-Z]$/,     // digits_letter like "17503_B"
            /^\d{5}_[A-Z]{2}$/,    // digits_letters like "06000_QV"
        ];
        
        // Check if it looks like a recipe (based on your actual data patterns)
        const recipePatterns = [
            /^SC_/i,               // Most common - SC_Chromium patterns  
            /^WGS_/i,              // WGS_Deep
            /CHROMIUM/i,           // SC_Chromium variants
            /NANOPORE/i,           // Nanopore variants
            /^ST_/i,               // ST_Visium-HD
            /^WES_/i,              // WES_Human
            /^NANOPORE_/i,         // Nanopore_Long-DNA, Nanopore_cDNA, Nanopore_Short-DNA
            /^USER_/i,             // User_Chromium, User_Amplicon, User_ERIL
            /^DNA_/i,              // DNA_CRISPR, DNA_Amplicon
            /^TCR_/i,              // TCR_IGO
            /VISIUM/i,             // ST_Visium-HD
            /MULTIOME/i,           // SC_Chromium-Multiome
            /AMPLICON/i,           // User_Amplicon, DNA_Amplicon
            /CRISPR/i,             // DNA_CRISPR
            /DLP/i,                // SC_DLP
            /_/                    // Contains underscore (most recipes have underscores)
        ];
        
        const isProjectId = projectIdPatterns.some(pattern => pattern.test(projectSearch));
        const isRecipe = recipePatterns.some(pattern => pattern.test(projectSearch));
        
        // Use setTimeout to ensure loading state is visible, then navigate
        setTimeout(() => {
            if (isProjectId) {
                // Navigate to specific project page
                history.push(`/projects/${projectSearch}`);
            } else if (isRecipe) {
                // Search by recipe - navigate to recipe search results
                history.push(`/search?recipe=${encodeURIComponent(projectSearch)}`);
            } else {
                // Search by PI name - navigate to PI search results
                history.push(`/search?pi=${encodeURIComponent(projectSearch)}`);
            }
            setIsSearching(false);
        }, 100); // Small delay to show loading state
    };

    return (
        <div className={'search-bar'}>
            <input
                id='ProjectInput'
                name='ProjectInput'
                value={projectSearch}
                type='text'
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
                disabled={isSearching}
                style={{ 
                    opacity: isSearching ? 0.7 : 1,
                    cursor: isSearching ? 'wait' : 'text'
                }}
            />
            <button onClick={handleSubmit} disabled={isSearching}>
                {isSearching ? <FaSpinner className="fa-spin" /> : <FaSearch />}
            </button>
        </div>
    );
};

export default SearchBar;