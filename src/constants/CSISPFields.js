// The fields for the ISP of the computer science master
// group selection
//      type: 'any' the course should have the group 'type'
//      type: 'single' only one of this type in all fields can be picked and the course should have that selecte group type and value
//      type: 'multiple' the type should be the same in the field, but the same type with another value can be used in another field
//      type: value the course should have the type and value
const fields = [{
    name: 'Compulsory Courses',
    minEC: 25,
    minCourses: 5,
    groups: {
        track: 'single',
        compulsory: true
    }
}, {
    name: 'Research Group',
    minEC: 15,
    groups: {
        'research-group': 'single'
    }
}, {
    name: 'Homolagation courses',
    maxEC: 15
}, {
    name: 'Free electives',
    maxEC: 25
}, {
    name: 'Seminar',
    minEC: 5,
    maxCourses: 1,
    minCourses: 1
}];
export
default fields;
