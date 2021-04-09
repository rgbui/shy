
import React from 'react';
import { Icon } from 'rich/src/component/icon';


export class DocBar extends React.Component {
    render() {
        return <div className='sy-doc-bar'>

            <div className='sy-doc-bar-right'>
                <Icon icon='favorite:sy'></Icon>
                <Icon icon='publish:sy'></Icon>
                <Icon icon='elipsis:sy'></Icon>
            </div>
        </div>
    }
}