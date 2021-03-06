import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import _ from 'lodash';
import classnames from 'classnames';
import EventServer from '../../models/EventServer.js';
import CourseCtrl from '../../models/CourseCtrl.js';
/**
 * Searches in the course code and name if the needle is present
 * TODO move this to CourseCtrl
 * @param  {Object}  courseTree The course tree object
 * @param  {String}  needle The needle to be search
 * @return {Boolean}        true iff needle is false or needle is present in the course code/name
 */
let hasNeedle = function hasNeedle(courseTree, needle) {
    const course = CourseCtrl.get(courseTree.id);
    if (!needle || needle.length === 0) {
        return true;
    }
    return course.name.toLowerCase().indexOf(needle) !== -1 || (!!course.courseName &&
        course.courseName.toLowerCase().indexOf(needle) !== -1);
};

/**
 * Renders the isp panel body.
 */
export
default React.createClass({
    propTypes:{
        isOver: PropTypes.bool.isRequired,
        filter: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired,
        className: PropTypes.string,
        ispModel: PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            isOver: false,
            filter: null
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            isOver: nextProps.isOver,
            filter: nextProps.filter
        });
    },
    componentDidMount() {
        this.startListening();
    },
    /**
     * Starts listening to events for the given ISP Controller
     */
    startListening() {
        const id = this.props.ispModel.getID();
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id + 'body');
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id + 'body');
    },
    render() {
        const ispModel = this.props.ispModel;
        const classes = classnames(this.props.className, 'panel-body');
        const rows = _(ispModel.getCourses())
            .orderBy('name')
            .filter((child) => hasNeedle(child, this.state.filter))
            .map(function(child) {
                return <CourseDnD key={child.nr} field={ispModel.getID()} course={child}/>;
            })
            .value();
        if (rows.length > 0) {
            return <div className={classes}>{rows}</div>;
        }
        return <span className={classnames(classes, 'empty')}>
            {(this.state.isOver) ? this.props.options.onHover : this.props.options.onEmpty}
        </span>;
    }
});
