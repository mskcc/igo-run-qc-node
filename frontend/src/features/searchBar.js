import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = () => {
    return (
        <div className={'search-bar'}>
            <input></input>
            <button>
                <FaSearch />
            </button>
        </div>
    );
};

export default SearchBar;
