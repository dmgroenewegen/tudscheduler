import React from 'react/addons';
import {Button, ButtonGroup} from 'react-bootstrap';

export default React.createClass({
    render(){
        var save = <Button bsStyle="primary">Save</Button>;
        var reset = <Button bsStyle="danger">Reset</Button>;
        var load = <Button bsStyle="primary">Load</Button>;
        var importBt = <Button bsStyle="primary">Import</Button>;
        var exportBt = <Button bsStyle="primary">Export</Button>;
        return <div className={'controls ' + this.props.className}>
            <ButtonGroup>{save}{load}</ButtonGroup>
            <ButtonGroup>{reset}</ButtonGroup>
            <ButtonGroup>{importBt}{exportBt}</ButtonGroup>
        </div>;
    }
});
