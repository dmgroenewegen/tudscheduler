import React from 'react';
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
 * @param  {Object}  course
 * @return {Boolean}        true iff the courseName or name contains the needle
 * and needle is not null/undefined/0.
 */
var hasNeedle = function(needle, course) {
    if (!needle) {
        return false;
    }
    return course.name.toLowerCase().indexOf(needle) !== -1 || (!!course.courseName &&
        course.courseName.toLowerCase().indexOf(needle) !== -1);
};

export
default React.createClass({
        getInitialState() {
            return {
                search: ''
            };
        },
        setSearch(nextSearch) {
            this.setState({
                search: nextSearch
            });
        },
        render() {
            var courses = CourseCtrl.flattenTree;
            var search = this.state.search.toLowerCase();
            if (search.length > 0) {
                courses = _(courses)
                    .filter(function(course) {
                        return hasNeedle(search, course);
                    })
                    .unique(function(course) {
                        return course.id;
                    })
                    .value();
            }

            var rows = courses
                .map(function(child) {
                    var visible = child.parent === 1;
                    return <CourseTree key={child.nr}
                    search={search}
                    visible={visible}
                    course={child}/>;
                });

            return <div {...this.props} >
                <ListGroup>
                    <SearchInput setSearch={this.setSearch}/>
                    {rows}
                </ListGroup> </div>;
    }
});
