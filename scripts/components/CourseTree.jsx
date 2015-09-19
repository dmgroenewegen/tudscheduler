import CourseCtrl from '../models/CourseCtrl.js';
import React from 'react';
import {
    ListGroupItem, Badge
}
from 'react-bootstrap';
import EventServer from '../models/EventServer.js';
import AddRemove from './AddRemove.jsx';

var hasNeedle = function(needle, course){
    if (!needle){
        return false;
    }
    return course.name.toLowerCase().indexOf(needle) !== -1
        || (!!course.courseName &&
            course.courseName.toLowerCase().indexOf(needle) !== -1);
};

var CourseTree = React.createClass({
    getInitialState() {
        return {
            childVisible: false,
            visible: this.props.visible
        };
    },
    toggle() {
        var nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit('visible::' + this.props.course.nr, nextVisibility);
    },
    componentDidMount() {
        var $self = this;
        EventServer.on('visible::' + this.props.course.parent, function(toggle) {
            var nextState = {
                visible: toggle
            };
            if (!toggle) {
                EventServer.emit('visible::' + $self.props.course.nr, toggle);
                nextState.childVisible = false;
            }
            $self.setState(nextState);
        });
    },
    renderSingle() {
        var course = this.props.course;
        var totalEcts = CourseCtrl.totalEcts(course);
        var subEcts = CourseCtrl.addedEcts(course);
        var isSearching = this.props.search.length > 0;

        var chevronClass = 'fa fa-chevron-' + ((this.state.childVisible) ? 'right' : 'down');
        var chevron = (course.children.length && !isSearching) ? <i key={1} className={chevronClass}/> : null;

        var badge = <Badge key={2}>EC {subEcts}/{totalEcts}</Badge>;
        if (course.children.length === 0) {
            badge = <Badge key={2}>EC {totalEcts}</Badge>;
        }

        var style = {
            marginLeft: (isSearching) ? 0 : (course.depth - 1) * 10
        };

        return <ListGroupItem className='row' key={course.nr} style={style}>
            <span key={4} onClick={this.toggle} className='col-xs-10'>
                {chevron} {course.name} {course.courseName} {badge}
            </span>
            <AddRemove key={5} course={course} className='col-xs-2 pull-right'/></ListGroupItem>;
    },
    render() {
        var visible = this.state.visible;
        if (this.props.search.length > 0){
            visible = hasNeedle(this.props.search, this.props.course);
        }
        return (visible) ? this.renderSingle() : null;
    }
});

export
default CourseTree;
