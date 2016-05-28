import CourseCtrl from '../models/CourseCtrl.js';
import React from 'react';
import {
    ListGroupItem, Badge
}
from 'react-bootstrap';
import EventServer from '../models/EventServer.js';
import AddRemove from './AddRemove.js';

var CourseTree = React.createClass({
    getInitialState() {
        return {
            childVisible: false,
            visible: this.props.visible
        };
    },
    componentDidMount() {
        var $self = this;
        var id = 'course::' + this.props.course.nr;

        if(this.props.visible){
            this.startListening();
        }

        EventServer.on('visible::' + this.props.course.parent, function(toggle) {
            var nextState = {
                visible: toggle
            };
            if (!toggle) {
                $self.stopListening();
                EventServer.emit('visible::' + $self.props.course.nr, toggle);
                nextState.childVisible = false;
            } else {
                $self.startListening()
            }
            $self.setState(nextState);
        }, 'coursetree');
    },
    /**
     * Toggle the visibility of the children
     * @returns {void}
     */
    toggle() {
        var nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit('visible::' + this.props.course.nr, nextVisibility);
    },
    startListening() {
        var id = 'course::' + this.props.course.nr;
        EventServer.on('added', () => this.forceUpdate(), id);
        EventServer.on('removed', () => this.forceUpdate(), id);
        EventServer.on('reset', () => this.forceUpdate(), id);
        EventServer.on('loaded', () => this.forceUpdate(), id);
    },
    stopListening() {
        var id = 'course::' + this.props.course.nr;
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('reset', id);
        EventServer.remove('loaded', id);
    },

    renderChevron() {
        if (this.props.search.length > 0 || this.props.course.children.length === 0) {
            return null;
        }
        const chevronClass = 'fa fa-chevron-' + ((this.state.childVisible) ? 'down' : 'right');
        return <i key={1} className={chevronClass}/>;
    },
    renderBadge() {
        const course = this.props.course;
        const totalEcts = CourseCtrl.totalEcts(course);
        const subEcts = CourseCtrl.addedEcts(course);
        if (course.children.length === 0) {
            return (<span className="label label-pill label-default" key={2}>EC {totalEcts}</span>);
        }
        return (<span className="label label-pill label-default" key={2}>EC {subEcts}/{totalEcts}</span>);
    },
    render() {
        var visible = this.state.visible;

        var course = this.props.course;
        var isSearching = this.props.search.length > 0;

        var style = {
            marginLeft: (isSearching) ? 0 : (course.depth - 1) * 10
        };
        if (!visible && !isSearching) {
            style.display = 'none';
        }
        return <ListGroupItem className='row' key={course.nr} style={style}>
            <span key={4} onClick={this.toggle} className='col-xs-10'>
                {this.renderChevron()} {course.name} {course.courseName} {this.renderBadge()}
            </span>
            <AddRemove key={5} course={course} className='col-xs-2 pull-right'/></ListGroupItem>;
    }
});

export
default CourseTree;
