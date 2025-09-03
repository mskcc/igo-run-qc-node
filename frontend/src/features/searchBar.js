import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';


export const SearchBar = () => {
    const history = useHistory();
    const [projectSearch, setProjectSearch] = useState('');
    const [searchField, setSearchField] = useState('Request ID');
    const searchFields = [ 'Request ID','PI Name', 'Recipe', 'Type', 'Recent Run'];
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

 

    const handleOnChange = (e) => {
        const query = e.target.value || '';
        setProjectSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    const handleSubmit = async () => {
        const query = projectSearch.trim();
        if (!query) return;

        setIsLoading(true);

        // Check if it's a direct project ID (digits with optional suffix)
        if (/^\d+(_[A-Z]+)?$/i.test(query)) {
            history.push(`/projects/${query.toUpperCase()}`);
        } else {
            // Build URL with proper field parameter
            const params = new URLSearchParams();
            
            // Always include the field parameter (use 'field' to match SearchResultsPage expectation)
            params.set('field', searchField);
            
            const searchUrl = `/search/${encodeURIComponent(query)}?${params.toString()}`;
            
           
            
            history.push(searchUrl);
        }

        setProjectSearch('');
        setIsLoading(false);
    };

    const handleFieldSelect = (field) => {
        setSearchField(field);
        setIsDropdownOpen(false);
        
        // Optional: Focus back to input after selection
        setTimeout(() => {
            const input = document.getElementById('ProjectInput');
            if (input) input.focus();
        }, 100);
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const getPlaceholderText = () => {
        switch (searchField) {
            case 'PI Name':
                return 'Search by PI name ...';
            case 'Recipe':
                return 'Search by Recipe ...';
            case 'Type':
                return 'Search by Type ...';
            case 'Recent Run':
                return 'Search by Recent Run ...';
            case 'Request ID':
                return 'Search by Request ID ...';
            default:
                return 'Search projects, PI name, Recent Runs...';
        }
    };

    const getFieldDisplayName = (field) => {
        
        switch (field) {
            case 'PI Name': return 'PI Name';
            case 'Recipe': return 'Recipe';
            case 'Type': return 'Type';
            case 'Recent Run': return 'Recent Run';
            case 'Request ID': return 'Request ID';
            default: return field;
        }
    };

    
    useEffect(() => {
        const handleClickOutside = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isDropdownOpen]);

    return (
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Search Field Dropdown */}
            <div style={{ position: 'relative', marginRight: '6px' }}>
                <button
                    onClick={toggleDropdown}
                    onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '120px',
                        height: '34px',
                        padding: '0 10px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#3a3a39',
                        transition: 'all 0.2s ease',
                        boxShadow: isDropdownOpen ? '0 0 0 2px rgba(64, 180, 229, 0.3)' : 'none'
                    }}
                    type="button"
                    onMouseEnter={(e) => {
                        if (!isDropdownOpen) {
                            e.target.style.borderColor = '#40b4e5';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isDropdownOpen) {
                            e.target.style.borderColor = '#ccc';
                        }
                    }}
                >
                    <span style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        marginRight: '6px'
                    }}>
                        {getFieldDisplayName(searchField)}
                    </span>
                    <FaChevronDown 
                        style={{ 
                            fontSize: '10px', 
                            color: '#666',
                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }} 
                    />
                </button>
                
                {isDropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '160px',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                    >
                        {searchFields.map((field) => (
                            <button
                                key={field}
                                onClick={() => handleFieldSelect(field)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    backgroundColor: searchField === field ? '#e6f3ff' : 'transparent',
                                    color: searchField === field ? '#006098' : '#3a3a39',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textAlign: 'left',
                                    fontWeight: searchField === field ? '600' : 'normal',
                                    transition: 'background-color 0.1s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (searchField !== field) {
                                        e.target.style.backgroundColor = '#f0f8ff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (searchField !== field) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                                type="button"
                            >
                                {field}
                                {searchField === field && (
                                    <span style={{ float: 'right', color: '#40b4e5' }}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Search Input */}
            <input
                id="ProjectInput"
                name="ProjectInput"
                value={projectSearch}
                type="text"
                placeholder={getPlaceholderText()}
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
                disabled={isLoading}
                style={{
                    width: '300px',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '13px',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: isLoading ? '#f5f5f5' : 'white'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#40b4e5';
                    e.target.style.boxShadow = '0 0 0 2px rgba(64, 180, 229, 0.2)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                }}
            />

            {/* Search Button */}
            <button 
                onClick={handleSubmit} 
                disabled={!projectSearch.trim() || isLoading}
                style={{
                    marginLeft: '4px',
                    width: '34px',
                    height: '34px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: (projectSearch.trim() && !isLoading) ? '#40b4e5' : '#d5d4c7',
                    color: 'white',
                    cursor: (projectSearch.trim() && !isLoading) ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    fontSize: '12px'
                }}
                onMouseEnter={(e) => {
                    if (projectSearch.trim() && !isLoading) {
                        e.target.style.backgroundColor = '#007cba';
                    }
                }}
                onMouseLeave={(e) => {
                    if (projectSearch.trim() && !isLoading) {
                        e.target.style.backgroundColor = '#40b4e5';
                    }
                }}
            >
                {isLoading ? (
                    <div className="dot-elastic" style={{ transform: 'scale(0.5)' }} />
                ) : (
                    <FaSearch />
                )}
            </button>

            
        </div>
    );
};

export default SearchBar;