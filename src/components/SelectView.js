import React, {
    Component
}
from 'react';
import {
    Button
}
from 'react-bootstrap';
import {
    DragDropContext
}
from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CSISPFields from '../constants/CSISPFields.js';
import ISPField from './ISPField.js';
import ISPCtrl from '../models/ISPCtrl.js';
import ISPModal from './ISPModal.js';

const SelectView = React.createClass({
    componentWillMount() {
        ISPCtrl.init(CSISPFields);
    },
    getInitialState() {
        return {
            showModal: false
        };
    },
    openModal() {
        this.setState({
            showModal: true
        });
    },
    closeModal() {
        this.setState({
            showModal: false
        })
    },
    render() {
        const unlistedOptions = {
            search: true,
            hideExpand: true,
            onEmpty: 'Add a course from the bar on the left to start creating your ISP',
            onHover: 'Drop'
        };
        const fieldOptions = {
            hideExpand: true,
            onEmpty: 'Drag \'n drop a course here',
            onHover: 'Drop'
        };
        return <div id="select-view">
            <ISPField className="col-xs-12 col-md-6" ispCtrl={ISPCtrl.unlisted}
                options={unlistedOptions}>
            </ISPField>
            <div className="col-xs-12 col-md-6">
                <Button bsStyle="primary" onClick={this.openModal}><i className="fa fa-file-pdf-o"/>Generate</Button>
                {ISPCtrl.ispFields.
                    filter(function(ispCtrl){
                        return ispCtrl.getID() !== 'unlisted';
                    }).map(function(ispCtrl, index){
                    return <ISPField key={index} ispCtrl={ispCtrl} options={fieldOptions}></ISPField>;
                })}
            </div>
            <ISPModal show={this.state.showModal} closeModal={this.closeModal}/>
        </div>;
    }
});

module.exports = DragDropContext(HTML5Backend)(SelectView);
