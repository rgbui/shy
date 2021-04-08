
import React from 'react';


import ReactDOM from "react-dom";
import { surface } from '../../view/surface';
import { DocView } from './doc.view';

export class Docs extends React.Component {

    render() {
        var pages = [surface.pageData];
        return <div className='sy-docs'>{
            pages.map(page => {
                return <DocView key={page.id} pageData={page}></DocView>
            })
        }
        </div>
    }
}