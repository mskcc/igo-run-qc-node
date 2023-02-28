import React from 'react';
import { useHistory } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
// import config from '../config';

export const HomeButton = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/`);
    };

    return (
        <div className={'home-button'} onClick={handleClick}>
            <AiFillHome />
        </div>
    );
};

export default HomeButton;
