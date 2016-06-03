import React, {Component, PropTypes} from 'react';
import {Panel} from 'react-bootstrap';
import CourseTypes from '../constants/CourseTypes.js';
import {DropTarget} from 'react-dnd';

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
        var classes = [(isOver) ? '.item-hovering' : '', this.props.className].join(' ');
        return connectDropTarget(<div className={classes}>{this.props.children}</div>);
    }
}

SimpleDropTarget.propTypes = {
    isOver: PropTypes.bool.isRequired
};

export
default DropTarget(CourseTypes.COMPSULARY, fieldTarget, collect)(SimpleDropTarget);
