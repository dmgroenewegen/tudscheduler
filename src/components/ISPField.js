import React, {PropTypes} from 'react';
import SimpleDropTarget from './SimpleDropTarget.js';
import ISPPanel from './ISPPanel.js';

/**
 * Renders an ISPField which is turn a drop target for CourseDnD.
 */
export
default React.createClass({
    propType:{
        ispCtrl: PropTypes.object.isRequired,
        className: PropTypes.string
    },
    render() {
        const ispCtrl = this.props.ispCtrl;
        return <SimpleDropTarget className={this.props.className} id={ispCtrl.getID()}>
            <ISPPanel {...this.props}/>
        </SimpleDropTarget>
    }
});
