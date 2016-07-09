import React, {
    PropTypes
}
from 'react';
import {
    ListGroup
}
from 'react-bootstrap';
import CourseCtrl from '../models/CourseCtrl.js';
import EventServer from '../models/EventServer.js';
import CourseTree from './CourseTree.js';
import SearchInput from './SearchInput.js';
import _ from 'lodash';
/**
 * @param  {String}  needle The search term
 * @param  {Object}  courseTree The course tree object
 * @return {Boolean} true iff the courseName or name contains the needle
 * and needle is not null/undefined/0.
 */
var hasNeedle = function(needle, courseTree) {
    if (!needle) {
        return false;
    }
    const course = CourseCtrl.get(courseTree.id);
    return course.name.toLowerCase().indexOf(needle) !== -1 || (!!course.courseName &&
        course.courseName.toLowerCase().indexOf(needle) !== -1);
};

export
default React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getInitialState() {
        return {
            search: '',
            tree: []
        };
    },
    componentDidMount() {
        CourseCtrl.init();
        EventServer.on('loaded', ()=> this.setState({
            tree: CourseCtrl.flatten(null, null, 'nr')
        }));
    },
    setSearch(nextSearch) {
        this.setState({
            search: nextSearch
        });
    },
    render() {
        var courses = this.state.tree;
        var search = this.state.search.toLowerCase();
        if (search.length > 0) {
            courses = _(courses)
                .filter(function(course) {
                    return hasNeedle(search, course);
                })
                .uniqBy(function(course) {
                    return course.id;
                })
                .value();
        }
        const rows = courses
            .map(function(child) {
                const visible = child.parent === 1;
                return <CourseTree key={child.nr}
                    search={search}
                    visible={visible}
                    course={child}/>;
            });
        const classes = [this.props.className, 'sidebar'].join(' ');
        return <div className={classes}>
                    <ListGroup>
                        <SearchInput setSearch={this.setSearch}/>
                        {rows}
                    </ListGroup></div>;
    }
});
