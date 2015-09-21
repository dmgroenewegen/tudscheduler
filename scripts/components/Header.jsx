import React from 'react';
import {Button, ButtonGroup, Tooltip, OverlayTrigger} from 'react-bootstrap';
import Storage from '../models/Storage.js';
import CourseCtrl from '../models/CourseCtrl.js';

export default React.createClass({
    render(){
        var save = <Button onClick={Storage.save} bsStyle="primary">Save</Button>;
        var reset = <Button onClick={CourseCtrl.reset} bsStyle="danger">Reset</Button>;
        var load = <Button onClick={Storage.load} bsStyle="primary">Load</Button>;
        return <div className={this.props.className + ' header'}>
            <div className='controls pull-left'>
                <ButtonGroup>{save}{load}</ButtonGroup>
                <ButtonGroup>{reset}</ButtonGroup>
            </div>
            <span className='pull-right'>
                This site is still work in progress. If you have any tips/suggestions or want to contribute, go the <a href="https://github.com/Pouja/tudscheduler">GitHub page</a>.
            <OverlayTrigger placement='left' overlay={<Tooltip>For issues/code</Tooltip>}>
                <a href="https://github.com/Pouja/tudscheduler">
                    <i className='fa fa-github fa-3x'/>
                </a>
            </OverlayTrigger>
            </span>
        </div>;
    }
});
