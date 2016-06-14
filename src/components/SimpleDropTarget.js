import React, {Component, PropTypes} from 'react';
import {Panel} from 'react-bootstrap';
import CourseTypes from '../constants/CourseTypes.js';
import {DropTarget} from 'react-dnd';
import classnames from 'classnames';
const fieldTarget = {
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

class SimpleDropTarget extends Component {
    render() {
        const {connectDropTarget, isOver} = this.props;
        const classes = classnames(this.props.className, {'item-hovering': isOver});
        return connectDropTarget(<div className={classes}>{this.props.children}</div>);
    }
}

SimpleDropTarget.propTypes = {
    isOver: PropTypes.bool.isRequired
};

export
default DropTarget(CourseTypes.COMPSULARY, fieldTarget, collect)(SimpleDropTarget);
