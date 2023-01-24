import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import config from '../config';

export const HomeButton = () => {
    return (
        <div className={'home-button'}>
            <a href={`${config.SITE_HOME}`}>
                <AiFillHome />
            </a>
        </div>
    );
};

export default HomeButton;
