import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = () => {
    const history = useHistory();
    const [projectSearch, setProjectSearch] = useState('');

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
        history.push(`/projects/${projectSearch}`);
    };

    return (
        <div className={'search-bar'}>
            <input
                id='ProjectInput'
                name='ProjectInput'
                value={projectSearch}
                type='text'
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}>
            </input>
            <button onClick={handleSubmit}>
                <FaSearch />
            </button>
        </div>
    );
};

export default SearchBar;
