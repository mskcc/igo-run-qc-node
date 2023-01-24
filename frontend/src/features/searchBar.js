import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = () => {
    const history = useHistory();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const handleSubmit = () => {
        const projectId = document.getElementById('ProjectInput').value;
        history.push(`/projects/${projectId}`);
    };

    return (
        <div className={'search-bar'}>
            <input id='ProjectInput' name='ProjectInput' type='text' onKeyDown={handleKeyDown}></input>
            <button onClick={handleSubmit}>
                <FaSearch />
            </button>
        </div>
    );
};

export default SearchBar;
