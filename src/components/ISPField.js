import React from 'react';
import SimpleDropTarget from './SimpleDropTarget.js';
import ISPPanel from './ISPPanel.js';
export
default React.createClass({
    render() {
        const ispCtrl = this.props.ispCtrl;
        return <SimpleDropTarget className={this.props.className} id={ispCtrl.getID()}>
            <ISPPanel {...this.props}/>
        </SimpleDropTarget>
    }
});
