import React from 'react';
import {Badge} from 'react-bootstrap';
import AddRemove from '../AddRemove.js';

/**
 * Used by YearView to render a course.
 */
export default React.createClass({
    propTypes: {
        course: React.PropTypes.object.isRequired
    },
    render(){
        var course = this.props.course;
        return <div {...this.props}>
            {course.name} {course.courseName}
            <Badge>EC {course.ects}</Badge>
            <AddRemove course={course} className=""/>
        </div>;
    }
});
