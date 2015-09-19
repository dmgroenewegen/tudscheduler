import CourseCtrl from './CourseCtrl.js';
import _ from 'lodash';
import EventServer from './EventServer.js';

var Storage = {
    save() {
        var ids = _.pluck(CourseCtrl.added, 'id');
        localStorage.setItem('courses', JSON.stringify(ids));
        EventServer.emit('saved');
    },
    load(){
        var ids = localStorage.getItem('courses');
        CourseCtrl.added = CourseCtrl.flatten(function(course){
            return ids.indexOf(course.id) !== -1;
        });
        EventServer.emit('loaded');
    }
};

export default Storage;
