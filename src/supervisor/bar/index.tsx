import React from 'react';
import { Icon } from 'rich/component/icon';
import { surface } from '../../surface';
import { PageRouter } from './router';
import { PageUsers } from './user';
import "./style.less";
export class Bar extends React.Component {
    render() {
        return <div className='shy-supervisor-bar'>
            <div className='shy-supervisor-bar-left'>
                <PageRouter></PageRouter>
                <PageUsers></PageUsers>
            </div>
            <div className='shy-supervisor-bar-right'>
                <Icon icon='favorite:sy' click={e => this.supervisor.onFavourite(e)}></Icon>
                <Icon icon='publish:sy' click={e => this.supervisor.onOpenPublish(e)}></Icon>
                <Icon icon='elipsis:sy' click={e => this.supervisor.onOpenPageProperty(e)}></Icon>
            </div>
        </div>
    }
    get supervisor() {
        return surface.supervisor;
    }
}