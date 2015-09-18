import React from 'react';
import {Badge} from 'react-bootstrap';
import AddRemove from './AddRemove.jsx';

export default React.createClass({
    render(){
        var course = this.props.course;
        return <div {...this.props}>
            {course.courseName} <Badge>EC {course.ects}</Badge>
                <AddRemove course={course} className=""/>
        </div>;
    }
});
