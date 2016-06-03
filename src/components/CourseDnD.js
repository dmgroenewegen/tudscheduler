import CourseCtrl from '../models/CourseCtrl.js';
import React, { Component, PropTypes } from 'react';
import CourseTypes from '../constants/CourseTypes.js';
import {DragSource} from 'react-dnd';
import {ListGroupItem} from 'react-bootstrap';
import ISPCtrl from '../models/ISPCtrl.js';

const courseSource = {
    beginDrag(props) {
        return {
            currentFieldId: props.field,
            course: props.course
        }
    },
    endDrag(props, monitor){
        var item = monitor.getItem();
        var dropResult = monitor.getDropResult();
        if(!monitor.didDrop() || item.currentFieldId === dropResult.id){
            return;
        }
        ISPCtrl.move(item.course, item.currentFieldId, dropResult.id);
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class CourseDnD extends Component{
    render() {
        const course = this.props.course;
        const { connectDragSource, isDragging } = this.props;
        return connectDragSource(
            <div className="list-item">
                {course.name} {course.courseName}
            </div>
        );
    }
}

CourseDnD.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

export default DragSource(CourseTypes.COMPSULARY, courseSource, collect)(CourseDnD);
