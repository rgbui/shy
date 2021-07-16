
import React from 'react';

import { PageItem } from '../../solution/item';
import { DocBar } from './bar';
import { DocView } from './content';

export class DocPage extends React.Component<{ item: PageItem }> {
    get item() {
        return this.props.item;
    }
    render() {
        console.log('page..',this.item);
        return <div className='sy-doc'>
            <DocBar></DocBar>
            <DocView item={this.item}></DocView>
        </div>
    }
}