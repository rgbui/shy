
import React from 'react';
import { surface } from '../surface';
export function User(props) {
    return <div className='sy-slide-user'>
        <img src={surface.user.profile_photo} />
        <div className='sy-slide-user-profile'>
            <span>{surface.user.account}</span>
        </div>
    </div>
}