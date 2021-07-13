import React from 'react';
import { surface } from '../surface';
export function SlideUserFooter(props) {
    return <div className='sy-slide-user'>
        <img src={surface.user.avatar?.url} />
        <div className='sy-slide-user-profile'>
            <span>{surface.user.name}</span>
        </div>
    </div>
}