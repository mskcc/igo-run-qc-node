import React from 'react';
import logo from '../assets/logo.png';
import HomeButton from './homeButton';
import SearchBar from './searchBar';

function Header() {

  return (
    <div position='static' title={logo} className={'header'}>
      <div className={'header-content'}>
        <img alt='mskcc logo' src={logo} className={'header-logo'} />
        <h1 color='inherit' className={'header-title'}>
          IGO Run QC
        </h1>
        <HomeButton />
      </div>
      <SearchBar />
    </div>
  );
};

export default Header;
