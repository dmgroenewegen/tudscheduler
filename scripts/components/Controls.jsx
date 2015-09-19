import React from 'react/addons';
import {Button, ButtonGroup} from 'react-bootstrap';
import Storage from '../models/Storage.js';
import CourseCtrl from '../models/CourseCtrl.js';

export default React.createClass({
    render(){
        var save = <Button onClick={Storage.save} bsStyle="primary">Save</Button>;
        var reset = <Button onClick={CourseCtrl.reset} bsStyle="danger">Reset</Button>;
        var load = <Button onClick={Storage.load} bsStyle="primary">Load</Button>;
        var importBt = <Button bsStyle="primary">Import</Button>;
        var exportBt = <Button bsStyle="primary">Export</Button>;
        return <div className={'controls ' + this.props.className}>
                <ButtonGroup>{save}{load}</ButtonGroup>
                <ButtonGroup>{reset}</ButtonGroup>
                <ButtonGroup>{importBt}{exportBt}</ButtonGroup>
        </div>;
    }
});
