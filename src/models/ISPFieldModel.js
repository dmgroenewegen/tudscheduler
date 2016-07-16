import _ from 'lodash';
import CourseCtrl from './CourseCtrl.js';
/**
 * ISPFieldModel to describe a field in the ISP
 * Should not be used directly. When whishing to add/remove, then it should be done through ISPCtrl.
 * @param {Object} options The options
 * @param {Number} options.maxEC The maximum amount of EC allowed
 * @param {Number} options.minEC The minimum amount of EC
 * @param {Number} options.maxCourses The maximum amount of courses allowed
 * @param {Number} options.minCourses The minimum amount of courses
 * @param {String|Number} id The identifier of the field.
 * @returns {Object} [description]
 */
function ISPFieldModel(options, id) {
    var courses = [];
    var model = {};
    const modelOptions = options;
    const modelId = id;
    const groups = {};

    model.getCourses = function() {
        return courses;
    };
    model.getOptions = function() {
        return modelOptions;
    };
    model.getID = function() {
        return modelId;
    };
    model.reset = function() {
        courses = [];
    };
    model.getGroups = function() {
        return groups;
    };
    /**
     * Removes a single course
     * @param  {Object} course The course to be removed
     */
    model.remove = function remove(course) {
        _.remove(courses, {
            id: course.id
        });
    };
    /**
     * Adds a course if it is not present already.
     * @param {Object} course The course object
     * @return {Boolean} true iff a course is added.
     */
    model.add = function add(course) {
        if (!courses.some(function(c) {
            return c.id === course.id;
        })) {
            courses.push(course);
            return true;
        }
        return false;
    };
    model.isInGroups = function(courseTree) {
        const course = CourseCtrl.get(courseTree.id);
        return Object.keys(groups).every(function(key) {
            return course.groups !== undefined &&
                course.groups[key] !== undefined &&
                course.groups[key] === groups[key];
        });
    };
    /**
     * Returns all the errors indicating which rules are not met.
     * @return {Array} A list of constraints which are not met.
     */
    model.getErrors = function getErrors() {
        const errors = [];
        if (courses.length === 0 || modelId === 'unlisted') {
            return errors;
        }
        if (Object.keys(groups).length > 0 && !courses.every(model.isInGroups)) {
            errors.push('group');
        }
        if (_.isNumber(options.maxEC) && CourseCtrl.sumEcts(courses) > modelOptions.maxEC) {
            errors.push('maxEC');
        }
        if (_.isNumber(modelOptions.minEC) && CourseCtrl.sumEcts(courses) < modelOptions.minEC) {
            errors.push('minEC');
        }
        if (_.isNumber(modelOptions.maxCourses) &&
            courses.length > modelOptions.maxCourses) {
            errors.push('maxCourses');
        }
        if (_.isNumber(modelOptions.minCourses) &&
            courses.length < modelOptions.minCourses) {
            errors.push('minCourses');
        }
        return errors;
    };
    /**
     * Gives a list of messages indicating the restrictions and if the restrictions are not met.
     * @return {Array} A list of message objects.
     * @return {String} info The restrictions
     * @return {String} selected The number of courses/EC currently are selected
     * @return {Boolean} error true iff the restriction is not met.
     */
    model.infoMessages = function() {
        const errors = model.getErrors();
        const selectedCourses = courses.length;
        const totalEcts = CourseCtrl.sumEcts(courses);
        let pretty = [];
        if (options.minCourses === options.maxCourses && _.isNumber(options.maxCourses)) {
            pretty.push({
                info: `Exact ${options.minCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('maxCourses') !== -1 || errors.indexOf('minCourses') !== -1
            });
        } else if (_.isNumber(modelOptions.minCourses)) {
            pretty.push({
                info: `At least ${options.minCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('minCourses') !== -1
            });
        } else if (_.isNumber(modelOptions.maxCourses)) {
            pretty.push({
                info: `At most ${options.maxCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('maxCourses') !== -1
            });
        }
        if (options.minEC === options.maxEC && _.isNumber(options.maxEC)) {
            pretty.push({
                info: `Exact ${options.maxEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('minEC') !== -1 || errors.indexOf('maxEC') !== -1
            });
        } else if (_.isNumber(options.minEC)) {
            pretty.push({
                info: `At least ${options.minEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('minEC') !== -1
            });
        } else if (_.isNumber(options.maxEC)) {
            pretty.push({
                info: `At most ${options.maxEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('maxEC') !== -1
            });
        }
        return pretty;
    };
    /**
     * Gives a list of group error messages which are not met.
     * So if a given isp field has the selected groups: compulsory: true and the course has not.
     * It will return 'Is not a compulsory course'
     * @param  {Object} course   The course object
     * @return {Array}          A list of messages indicating which group restrictions are not met.
     */
    model.groupErrMsg = function(course) {
        const isA = [];
        const belongsTo = [];
        const groupsCourse = course.groups;
        Object.keys(groups)
            .filter(function(key) {
                return groupsCourse === undefined ||
                    groupsCourse[key] === undefined ||
                    groupsCourse[key] !== groups[key];
            })
            .forEach(function(key) {
                if (_.isString(groups[key])) {
                    belongsTo.push(groups[key]);
                } else {
                    isA.push(key);
                }
            });
        return isA.map(function(typeCourse) {
            return `Is not a ${typeCourse} course`;
        }).concat(belongsTo.map(function(parent) {
            return `Does not fall under ${parent}`;
        }));
    };
    /**
     * Checks if with the given courses all the constraints are met.
     * @return {Boolean} iff all the constraints are met.
     */
    model.isValid = function isValid() {
        return model.getErrors().length === 0;
    };
    return model;
}

export
default ISPFieldModel;
