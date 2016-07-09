import React from 'react';
import {Badge} from 'react-bootstrap';
import AddRemove from '../AddRemove.js';
import CourseCtrl from '../../models/CourseCtrl.js';
/**
 * Used by YearView to render a course.
 */
export default React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },
    render(){
        const course = CourseCtrl.get(this.props.course.id);
        return <div {...this.props}>
            {course.name} {course.courseName}
            <Badge>EC {course.ects}</Badge>
            <AddRemove course={this.props.course} className=""/>
        </div>;
    }
});
