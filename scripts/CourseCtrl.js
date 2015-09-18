import AllCourses from './AllCourses.js';
import _ from 'lodash';
import EventServer from './EventServer.js';

var Model = {
    tree: AllCourses,
    flattenTree: [],
    added: [],
    isAdded: function(course) {
        if (course.children.length === 0) {
            return _.find(Model.added, {
                id: course.id
            });
        }
        return _.every(course.children, Model.isAdded);
    },
    flatten(filter, node, unique) {
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
    totalEcts(course) {
        course = course || Model.tree;
        var flatten = Model.flatten(function() {
            return true
        }, course, 'id');
        return _.sum(flatten, function(course) {
            return (course.ects === undefined) ? 0 : parseInt(course.ects);
        });
    },
    add(course) {
        EventServer.emit('added::' + course.id, course);
        if (course.children.length !== 0) {
            course.children.forEach(Model.add);
        } else {
            if (_.find(Model.added, {
                id: course.id
            }) === undefined) {
                Model.added.push(course);
            }
        }
    },
    remove(course) {
        EventServer.emit('removed::' + course.id, course);
        if (course.children.length !== 0) {
            course.children.forEach(Model.remove);
        } else {
            _.remove(Model.added, {
                id: course.id
            });
        }
    },
};

(function setDepth(node, depth) {
    depth = depth || 0;
    node.depth = depth;
    node.children.forEach((child) => setDepth(child, depth + 1));
})(Model.tree);

export
default Model;
