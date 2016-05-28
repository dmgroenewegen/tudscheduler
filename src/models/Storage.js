import CourseCtrl from './CourseCtrl.js';
import _ from 'lodash';
import EventServer from './EventServer.js';

var Storage = {
    /**
     * Saves to the localstorage of the browsers
     * @returns {void}
     */
    save() {
        var ids = _.map(CourseCtrl.added, 'id');
        localStorage.setItem('courses', JSON.stringify(ids));
        EventServer.emit('saved');
    },
    /**
     * Loads all the courses from the localstorage
     * @returns {void}
     */
    load() {
        var ids = JSON.parse(localStorage.getItem('courses'));
        if (ids === null || ids.length === 0) {
            EventServer.emit('load.error.nosave');
        } else {
            EventServer.emit('loaded');
            CourseCtrl.added = CourseCtrl.flatten(function(course) {
                return ids.indexOf(course.id) !== -1;
            });
        }

    }
};

export
default Storage;
