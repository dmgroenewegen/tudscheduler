import React, {PropTypes} from 'react';
import SimpleDropTarget from './SimpleDropTarget.js';
import ISPPanel from './ISPPanel.js';

/**
 * Renders an ISPField which is turn a drop target for CourseDnD.
 */
export
default React.createClass({
    propType:{
        ispModel: PropTypes.object.isRequired,
        className: PropTypes.string
    },
    render() {
        const ispModel = this.props.ispModel;
        return <SimpleDropTarget className={this.props.className} id={ispModel.getID()}>
            <ISPPanel {...this.props}/>
        </SimpleDropTarget>
    }
});
