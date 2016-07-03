import CourseCtrl from '../models/CourseCtrl.js';
import React, { Component, PropTypes } from 'react';
import CourseTypes from '../constants/CourseTypes.js';
import {DragSource} from 'react-dnd';
import {ListGroupItem} from 'react-bootstrap';
import ISPCtrl from '../models/ISPCtrl.js';
import classnames from 'classnames';

const courseSource = {
    /**
     * Called by react-dnd when a DragSource starts to being dragged.
     * Should return an object with the necessary values to make a drop and to identify this DragSource.
     * @param  {Object} props The props of the react component bind to the DragSource
     * @return {Object}       Object containing values to identify the DragSource.
     */
    beginDrag(props) {
        return {
            currentFieldId: props.field,
            course: props.course
        }
    },
    /**
     * Called by react-dnd when a DragSource stops being dragged by the user.
     * Handles the drop if it is not dropped already.
     * It moves the course to another ISPField.
     * @param  {Object} props   The props of the react component binded to the DragSource
     * @param  {Object} monitor The monitor object retuned by react-dnd. See react-dnd for more info.
     */
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

/**
 * The drag and drop list item in the select view.
 */
class CourseDnD extends Component{
    /**
     * Called when clicking on the undo element.
     * Moves the course back to 'unlisted'
     */
    undo() {
        ISPCtrl.move(this.props.course, this.props.field, 'unlisted');
    }
    /**
     * Renders the undo icon.
     * @return {React} A react component
     */
    renderUndo(){
        if(this.props.field !== 'unlisted'){
            return <i className='fa fa-undo fa-lg pull-right' onClick={this.undo.bind(this)}/>;
        }
        return null;
    }
    render() {
        const course = this.props.course;
        const { connectDragSource, isDragging } = this.props;
        const classes = classnames('list-item', {'is-dragging': isDragging});
        return connectDragSource(
            <div className={classes}>
                {course.name} {course.courseName} {this.renderUndo()}
            </div>
        );
    }
}

/**
 * The expected prop types of CourseDnD.
 * @type {Object}
 */
CourseDnD.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

export default DragSource(CourseTypes.COMPSULARY, courseSource, collect)(CourseDnD);
