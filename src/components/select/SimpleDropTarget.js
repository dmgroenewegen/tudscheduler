import React, {Component, PropTypes} from 'react';
import {Panel} from 'react-bootstrap';
import CourseTypes from '../../constants/CourseTypes.js';
import {DropTarget} from 'react-dnd';
import classnames from 'classnames';

/**
 * Required by react-dnd, contains the functionality which is used by other react-dnd components to interect.
 * @type {Object}
 */
const fieldTarget = {
    /**
     * Called when a DragSource aka CourseDnD is dropped on the container.
     * Returns the id of the ispfield for this DropTarget component.
     * @param  {Object} props The properties of SimpleDropTarget
     * @return {Object}       Object which identifies the DropTarget.
     */
    drop(props) {
        return {id: props.id};
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

/**
 * Renders a simple drop target for react-dnd.
 */
class SimpleDropTarget extends Component {
    render() {
        const {connectDropTarget, isOver} = this.props;
        const classes = classnames(this.props.className, {'item-hovering': isOver});
        return connectDropTarget(<div className={classes}>
            {React.cloneElement(this.props.children, {isOver: isOver})}
        </div>);
    }
}

SimpleDropTarget.propTypes = {
    isOver: PropTypes.bool.isRequired
};

export
default DropTarget(CourseTypes.COMPULSORY, fieldTarget, collect)(SimpleDropTarget);
