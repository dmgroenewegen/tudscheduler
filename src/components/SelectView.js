import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CSISPFields from '../constants/CSISPFields.js';
import ISPField from './ISPField.js';
import ISPCtrl from '../models/ISPCtrl.js';

var SelectView = React.createClass({
    componentWillMount(){
        ISPCtrl.init(CSISPFields);
    },
    render(){
        return <div>
            <ISPField className="col-xs-12 col-md-6" ispCtrl={ISPCtrl.unlisted}>
                <span className="empty">Add a course from the bar on the left to start creating your ISP</span>
            </ISPField>
            <div className="col-xs-12 col-md-6">
                {ISPCtrl.ispFields.
                    filter(function(ispCtrl){
                        return ispCtrl.getID() !== 'unlisted';
                    }).map(function(ispCtrl, index){
                    return <ISPField key={index} ispCtrl={ispCtrl}>
                        <span className="empty">Drag 'n drop a course here</span>
                    </ISPField>;
                })}
            </div>
        </div>;
    }
});

module.exports = DragDropContext(HTML5Backend)(SelectView);

