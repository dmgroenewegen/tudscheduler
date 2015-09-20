import CourseCtrl from './CourseCtrl.js';
import _ from 'lodash';
import EventServer from './EventServer.js';

var Storage = {
    /**
     * Saves to the localstorage of the browsers
     */
    save() {
        var ids = _.pluck(CourseCtrl.added, 'id');
        localStorage.setItem('courses', JSON.stringify(ids));
        EventServer.emit('saved');
    },
    /**
     * Loads all the courses from the localstorage
     */
    load(){
        var ids = localStorage.getItem('courses');
        CourseCtrl.added = CourseCtrl.flatten(function(course){
            return ids.indexOf(course.id) !== -1;
        });
        EventServer.emit('loaded');
    }
};

export default Storage;
