import React from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import EventServer from '../models/EventServer.js';
import ReactGridLayout from 'react-grid-layout';
import {
    Badge, Panel
}
from 'react-bootstrap';
import CourseGridItem from './CourseGridItem.js';

/**
 * Creates the grid properties for the course
 * @param  {Object} course
 * @return {Object} Grid properties
 */
var courseGrid = function(course) {
    var start = course['Start Education'];
    var periods = course['Education Period'];
    var x = start ? parseInt(start) - 1 : 0;
    var w = periods ? periods.split(',').length : 1;
    return {
        static: true,
        x: x,
        y: 0,
        w: w,
        h: 1
    };
};

export
default React.createClass({
    componentDidMount() {
        EventServer.on('added', () => this.forceUpdate(), 'main');
        EventServer.on('removed', () => this.forceUpdate(), 'main');
        EventServer.on('reset', () => this.forceUpdate(), 'main');
        EventServer.on('loaded', () => this.forceUpdate(), 'main');
    },
    render() {
        var panelHeader = <div className="row">
            {[1, 2, 3, 4].map(function(index){
                var ects = CourseCtrl.periodEcts(index);
                return <span key={index} className="col-xs-3">
                    {'Q' + index}<br/><Badge>EC {ects}</Badge>
                </span>;
            })}
        </div>;

        var gridItems = CourseCtrl.added.map(function(course, index) {
            return <CourseGridItem _grid={courseGrid(course, index)}
                key={course.id} course={course}/>;
        });

        return <div className="col-xs-12 col-md-8 col-lg-8">
            Total ects: {CourseCtrl.addedEcts()}
            <Panel header={panelHeader}>
                <div className="row">
                    <ReactGridLayout
                        isResizable={false}
                        isDraggable={false}
                        rowHeight={100}
                        cols={4}>
                        {gridItems}
                    </ReactGridLayout>
                </div>
            </Panel>
        </div>;
    }
});
