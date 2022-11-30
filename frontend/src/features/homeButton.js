import React from 'react';
import { AiFillHome } from 'react-icons/ai';

export const HomeButton = () => {
    return (
        <div className={'home-button'}>
            <a href='/'>
                <AiFillHome />
            </a>
        </div>
    );
};

export default HomeButton;
