import _ from 'lodash';
import ISPField from './ISPField.js';
import EventServer from '../models/EventServer.js';
import CourseCtrl from './CourseCtrl.js';
const id = 'ISPCtrl';
var ISPCtrl = {
    unlisted: {},
    ispFields: [],
    fieldOptions: [],
    get(fieldId) {
        return ISPCtrl.ispFields.find(function(field) {
            return field.id === fieldId;
        });
    },
    init(ispFieldOptions) {
        ISPCtrl.fieldOptions = ispFieldOptions;
        ISPCtrl.ispFields = ispFieldOptions.map(function(ispField, index) {
            return new ISPField(ispField, index);
        });
        ISPCtrl.unlisted = new ISPField({
            name: 'Your selected courses'
        }, 'unlisted');
        CourseCtrl.added.forEach(function(course) {
            ISPCtrl.unlisted.add(course);
        });
        ISPCtrl.ispFields.push(ISPCtrl.unlisted);
        ISPCtrl.startListening();
    },
    updateAdded() {
        CourseCtrl.added.filter(function(course) {
            return !ISPCtrl.ispFields.some(function(ispCtrl) {
                return _.find(ispCtrl.getCourses(), {
                    id: course.id
                });
            });
        }).forEach(ISPCtrl.unlisted.add);
        EventServer.emit('isp.field.added::unlisted');
    },
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        ISPCtrl.ispFields.forEach(function(field) {
            var removeCourses = _.filter(field.getCourses(), function(course) {
                return !_.find(allCourses, {
                    id: course.id
                });
            });
            if (removeCourses.length > 0) {
                removeCourses.forEach(field.remove);
                EventServer.emit('isp.field.removed::' + field.getID());
            }
        });
    },
    reset() {
        ISPCtrl.ispFields.forEach(function(field) {
            field.reset();
            EventServer.emit('isp.field.added::' + field.getID());
        });
    },
    stopListening() {
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('reset', id);
        EventServer.remove('loaded', id);
    },
    startListening() {
        EventServer.on('added', ISPCtrl.updateAdded, id);
        EventServer.on('removed', ISPCtrl.updateRemoved, id);
        EventServer.on('reset', ISPCtrl.reset, id);
        EventServer.on('loaded', () => {
            ISPCtrl.reset();
            ISPCtrl.updateAdded()
        }, id);
    },
    move(course, fieldIdFrom, fieldIdTo) {
        var ispFieldFrom = (fieldIdFrom === 'unlisted') ? ISPCtrl.unlisted :
            _.find(ISPCtrl.ispFields, function(field) {
                return field.getID() === fieldIdFrom;
            });
        var ispFieldTo = (fieldIdTo === 'unlisted') ? ISPCtrl.unlisted : _.find(ISPCtrl.ispFields, function(field) {
            return field.getID() === fieldIdTo;
        });

        ispFieldTo.add(course);
        EventServer.emit('isp.field.added::' + fieldIdTo, course.id);

        if (!ispFieldTo.getOptions().duplicate) {
            ispFieldFrom.remove(course);
            EventServer.emit('isp.field.removed::' + fieldIdFrom, course.id);
        }
    }
};

export
default ISPCtrl;
