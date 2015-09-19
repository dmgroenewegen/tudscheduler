import React from 'react';
import CourseCtrl from './CourseCtrl.js';
import EventServer from './EventServer.js';
import ReactGridLayout from 'react-grid-layout';
import {Badge, Panel} from 'react-bootstrap';
import CourseGridItem from './CourseGridItem.jsx';

var courseGrid = function(course){
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

export default React.createClass({
    componentDidMount(){
        EventServer.on('added::*', () => this.forceUpdate());
        EventServer.on('removed::*', () => this.forceUpdate());
    },
    render(){
        var panelHeader = <div className="row">{[1, 2, 3, 4].map(function(index){
                    var ects = CourseCtrl.periodEcts(index);
                    return <span key={index} className="col-xs-3">{'Q' + index}<br/><Badge>EC {ects}</Badge></span>;
                })}</div>;
        return <div className="col-xs-12 col-md-8 col-lg-8">
            Total ects: {CourseCtrl.addedEcts()}
            <Panel header={panelHeader}>
                <div className="row">
                    <ReactGridLayout
                        isResizable={false}
                        isDraggable={false}
                        cols={4}>
                        {CourseCtrl.added.map(function(course){
                            return <CourseGridItem _grid={courseGrid(course)}
                                key={course.id} course={course}/>;
                        })}
                    </ReactGridLayout>
                </div>
            </Panel>
        </div>;
    }
});
