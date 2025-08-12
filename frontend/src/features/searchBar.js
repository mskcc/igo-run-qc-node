import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = () => {
    const history = useHistory();
    const [projectSearch, setProjectSearch] = useState('');

    const handleOnChange = (e) => {
        const query = e.target.value || '';
        setProjectSearch(query);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    
    const handleSubmit = () => {
        const query = projectSearch.trim();
        if (!query) return;

        // Numbers or numbers_letters = Project ID → Navigate to project page
        if (/^\d+(_[A-Z]+)?$/i.test(query)) {
            history.push(`/projects/${query.toUpperCase()}`);
        } else {
            // Everything else = Search query → Navigate to search results
            history.push(`/search/${encodeURIComponent(query)}`);
        }
        
        setProjectSearch(''); 
    };

    return (
        <div className={'search-bar'}>
            <input
                id='ProjectInput'
                name='ProjectInput'
                value={projectSearch}
                type='text'
                placeholder="Search projects, PI name, Recent Runs..."
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}>
            </input>
            <button onClick={handleSubmit} disabled={!projectSearch.trim()}>
                <FaSearch />
            </button>
        </div>
    );
};

export default SearchBar;