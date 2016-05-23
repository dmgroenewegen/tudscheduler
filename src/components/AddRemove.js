import React from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import CourseModal from './CourseModal.js';

export default React.createClass({
    getInitialState(){
        return {
            showModal: false
        };
    },
    openModal(){
        this.setState({
            showModal: true
        });
    },
    render(){
        var infoTip = <Tooltip>More info</Tooltip>;
        var infoRemove = <Tooltip>Remove</Tooltip>;
        var infoAdd = <Tooltip>Add</Tooltip>;
        var course = this.props.course;

        var add = <OverlayTrigger placement="top" overlay={infoAdd}>
                <Button key={1} bsSize="xsmall" bsStyle="success"
                    onClick={() => CourseCtrl.add(course)}>
                    <i className="fa fa-plus"></i>
                </Button>
            </OverlayTrigger>;

        var remove = <OverlayTrigger placement="top" overlay={infoRemove}>
                <Button key={1} bsSize="xsmall" bsStyle="danger"
                    onClick={() => CourseCtrl.remove(course)}>
                    <i className="fa fa-minus"></i>
                </Button>
            </OverlayTrigger>;

        var button = (CourseCtrl.isAdded(course)) ? remove : add;

        var info = <OverlayTrigger placement="top" overlay={infoTip}>
                <i key={3} className="fa fa-info-circle" onClick={this.openModal}/>
            </OverlayTrigger>;

        var classes = ['button-group', this.props.className].join(' ');
        return <div className={classes}>
            {info}
            {button}
            <CourseModal show={this.state.showModal} course={course}/>
        </div>;
    }
});
