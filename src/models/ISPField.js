import _ from 'lodash';

/**
 * ISPFieldModel to describe a field in the ISP
 * @param {Object} options The options
 * @param {Number} options.maxEC The maximum amount of EC allowed
 * @param {Number} options.minEC The minimum amount of EC
 * @param {Number} options.maxCourses The maximum amount of courses allowed
 * @param {Number} options.minCourses The minimum amount of courses
 * @param {String|Number} id The identifier of the field.
 * @returns {Object} [description]
 */
function ISPField(options, id) {
    var courses = []
    var model = {};
    const modelOptions = options;
    const modelId = id;

    model.getCourses = function(){
        return courses;
    }

    model.getOptions = function(){
        return modelOptions;
    }

    model.getID = function(){
        return modelId;
    }
    model.reset = function(){
        courses = []
    }
    model.remove = function remove(course){
        _.remove(courses, {id: course.id});
    }
    model.add = function add(course) {
        if (!courses.some(function(c) {
            return c.id === course.id
        })) {
            courses.push(course);
            return true;
        }
        return false;
    }
    model.getErrors = function getErrors() {
        var errors = [];
        if (_.isNumber(options.maxEC) &&
            _.sumBy(courses, function(course) {
                return parseInt(course.ects, 10);
            }) >= modelOptions.maxEC) {
            errors.push('maxEC');
        }
        if (_.isNumber(modelOptions.minEC) &&
            _.sumBy(courses, function(course) {
                return parseInt(course.ects, 10);
            }) <= modelOptions.minEC) {
            errors.push('minEC');
        }
        if (_.isNumber(modelOptions.maxCourses) &&
            courses.length >= modelOptions.maxCourses) {
            errors.push('maxCourses');
        }
        if (_.isNumber(modelOptions.minCourses) &&
            courses.length <= modelOptions.minCourses) {
            errors.push('minCourses');
        }
        return errors;
    }
    model.isValid = function isValid() {
        return model.getErrors().length === 0;
    }
    return model;
}

export default ISPField;
