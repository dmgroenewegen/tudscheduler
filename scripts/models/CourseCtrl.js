import AllCourses from './AllCourses.js';
import _ from 'lodash';
import EventServer from './EventServer.js';

/**
 * In the tree of all the courses, the 'id' attribute is not unique,
 * but the 'nr' attribute is. This was necessary for hiding/showing courses
 * under a specific program, since a course can reside in multiple programs.
 */

var Model = {
    tree: AllCourses,
    flattenTree: [],
    added: [],
    /**
     * @param  {Object}  course
     * @return {Boolean} true iff all the children of the course and the course
     * itself are added.
     */
    isAdded: function(course) {
        if (course.children.length === 0) {
            return _.find(Model.added, {
                id: course.id
            });
        }
        return _.every(course.children, Model.isAdded);
    },
    /**
     * Creates a flatten representation of the course tree
     * @param  {Function} filter Additional filter to apply
     * @param  {Object} node   A course, default root of tree
     * @param  {String} unique Identifier which indicates the uniquenis, default 'id'
     * @return {Array}        Flatten representation of the course tree.
     */
    flatten(filter, node, unique) {
        filter = filter || function() {
            return true;
        };
        unique = unique || 'id';
        node = node || Model.tree;
        var children = _(node.children)
            .map(function(child) {
                return Model.flatten(filter, child, unique);
            })
            .filter(Boolean)
            .flatten()
            .unique(unique)
            .value();

        if (filter(node)) {
            children.unshift(node);
        }
        return children;
    },
    /**
     * Calculates the added ects for a certain quarter/period
     * @param  {Number} period The period/quarter
     * @return {Number}        The total ects
     */
    periodEcts(period) {
        return _.sum(Model.added, function(course) {
            var courseEcts = (course.ects === undefined) ? 0 : parseInt(course.ects);
            var periods = course['Education Period'];
            var start = course['Start Education'] ? parseInt(course['Start Education']) : 0;
            var nPeriods = (periods ? periods.split(',').length : 1);
            var end = start + nPeriods - 1;
            if (start <= period && end >= period) {
                return courseEcts / nPeriods;
            } else {
                return 0;
            }
        });
    },
    /**
     * @param  {Object} course (Optional) defaults to root
     * @return {Number} The sum of all the ects of all the children and itself that
     * are added of the given course.
     */
    addedEcts(course) {
        course = course || Model.tree;
        var flatten = Model.flatten(function(course) {
            return _.find(Model.added, {
                id: course.id
            });
        }, course, 'id');
        return _.sum(flatten, function(course) {
            return (course.ects === undefined) ? 0 : parseInt(course.ects);
        })
    },
    /**
     * @param  {Object} course (Optional) defaults to root
     * @return {Number} total ects of the course and all of his children
     */
    totalEcts(course) {
        course = course || Model.tree;
        var flatten = Model.flatten(function() {
            return true
        }, course, 'id');
        return _.sum(flatten, function(course) {
            return (course.ects === undefined) ? 0 : parseInt(course.ects);
        });
    },
    /**
     * Adds the course and all the children to the added list
     * @param {Object} course
     */
    add(course) {
        EventServer.emit('added', course);
        Model._add(course);
    },
    _add(course) {
        if (course.children.length !== 0) {
            course.children.forEach(Model._add);
        } else {
            if (_.find(Model.added, {
                id: course.id
            }) === undefined) {
                Model.added.push(course);
            }
        }
    },
    /**
     * Removes the course and all the chilren from added list
     * @param  {Object} course
     */
    remove(course) {
        EventServer.emit('removed', course);
        Model._remove(course);
    },
    _remove(course) {
        if (course.children.length !== 0) {
            course.children.forEach(Model._remove);
        } else {
            _.remove(Model.added, {
                id: course.id
            });
        }
    },
    /**
     * Resets the added courses.
     */
    reset() {
        Model.added = [];
        EventServer.emit('reset');
    }
};

// Add depth, necessary for css styling
(function setDepth(node, depth) {
    depth = depth || 0;
    node.depth = depth;
    node.children.forEach((child) => setDepth(child, depth + 1));
})(Model.tree);

// Get the flatten representation before hand
Model.flattenTree = Model.flatten(null, null, 'nr');

export
default Model;
