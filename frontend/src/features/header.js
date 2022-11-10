import React from 'react';

import logo from '../assets/logo.png';

function Header() {

  return (
    <div position='static' title={logo} className={'header'}>
      <div>
        <img alt='mskcc logo' src={logo} className={'header-logo'} />
        <h1 color='inherit' className={'header-title'}>
          IGO Run QC
        </h1>
      </div>
    </div>
  );
}

export default Header;
