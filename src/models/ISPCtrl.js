import _ from 'lodash';
import ISPField from './ISPFieldModel.js';
import EventServer from '../models/EventServer.js';
import CourseCtrl from './CourseCtrl.js';
const id = 'ISPCtrl';

/**
 * The ISP controller.
 * Controlls all the ispFieldModels which are generated based on the CSISPFields (or possible another in the future).
 * When changing an ispfield it should be done through this class.
 * Since this class emits the events when a change happends in any ispfield.
 * It also listens to the changes regarding adding/removing a course and reset/load events.
 * @type {Object}
 */
var ISPCtrl = {
    unlisted: {},
    ispFieldModels: [],
    fieldOptions: [],
    /**
     * Returns a ISPField
     * @param  {String|Number} fieldId The ISPField identifier.
     * @return {Object}         An ISPField
     */
    get(fieldId) {
        return ISPCtrl.ispFieldModels.find(function(field) {
            return field.getID() === fieldId;
        });
    },
    /**
     * Should be called when ISPCtrl is being used for the first time.
     * @param  {Object} ispFieldOptions The options on which the ispFieldModels are generated.
     */
    init(ispFieldOptions) {
        ISPCtrl.fieldOptions = ispFieldOptions;
        ISPCtrl.ispFieldModels = ispFieldOptions.map(function(ispField, index) {
            return new ISPField(ispField, index);
        });
        ISPCtrl.unlisted = new ISPField({
            name: 'Your selected courses'
        }, 'unlisted');
        CourseCtrl.added.forEach(function(course) {
            ISPCtrl.unlisted.add(course);
        });
        ISPCtrl.ispFieldModels.push(ISPCtrl.unlisted);
        ISPCtrl.startListening();
    },
    /**
     * Called when a course is selected by an user.
     * Adds all the courses which are not currently in the selection to the unlisted ISPField.
     */
    updateAdded() {
        CourseCtrl.added.filter(function(course) {
            return !ISPCtrl.ispFieldModels.some(function(ispCtrl) {
                return _.find(ispCtrl.getCourses(), {
                    id: course.id
                });
            });
        }).forEach(ISPCtrl.unlisted.add);
        EventServer.emit('isp.field.added::unlisted');
    },
    /**
     * Called when an user removes a course from the selection.
     * Removes the course in the ISPField which currently holds it.
     */
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        ISPCtrl.ispFieldModels.forEach(function(field) {
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
    /**
     * Called when reset event is emitted.
     * Resets all the ispFieldModels.
     */
    reset() {
        ISPCtrl.ispFieldModels.forEach(function(field) {
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
            ISPCtrl.updateAdded();
        }, id);
    },
    /**
     * Moves a course from one ispfield to another
     * @param  {Object} course      The course object
     * @param  {String} fieldIdFrom The ispfield identifier from it is being moved.
     * @param  {String} fieldIdTo   The ispfield to which is should be moved
     */
    move(course, fieldIdFrom, fieldIdTo) {
        var ispFieldFrom = (fieldIdFrom === 'unlisted') ? ISPCtrl.unlisted :
            _.find(ISPCtrl.ispFieldModels, function(field) {
                return field.getID() === fieldIdFrom;
            });
        var ispFieldTo = (fieldIdTo === 'unlisted') ? ISPCtrl.unlisted : _.find(ISPCtrl.ispFieldModels, function(field) {
            return field.getID() === fieldIdTo;
        });

        ispFieldTo.add(course);
        EventServer.emit('isp.field.added::' + fieldIdTo, course.id);

        if (!ispFieldTo.getOptions().duplicate) {
            ispFieldFrom.remove(course);
            EventServer.emit('isp.field.removed::' + fieldIdFrom, course.id);
        }
    },
    /**
     * Checks if all ispfieldmodels are valid.
     * @return {Boolean} true iff all ispfieldmodels except unlisted are valid.
     */
    allValid() {
        return ISPCtrl.ispFieldModels.filter(function(model){
            return model.getID() !== 'unlisted';
        }).every(function(model){
            return model.isValid();
        });
    }
};

export
default ISPCtrl;
