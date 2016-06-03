import React from 'react';
import EventServer from '../models/EventServer.js';
import CourseDnD from './CourseDnD.js'
import {
    Panel
}
from 'react-bootstrap';
import SimpleDropTarget from './SimpleDropTarget.js';
import ISPCtrl from '../models/ISPCtrl.js';

const optionMapping = [{
    attribute: 'minEC',
    text: 'Min EC: '
},{
    attribute: 'maxEC',
    text: 'Max EC: '
},{
    attribute: 'minCourses',
    text: 'Min #courses: '
},{
    attribute: 'minEC',
    text: 'Max #courses: '
}];

export
default React.createClass({
    componentDidMount() {
        this.startListening();
    },
    startListening() {
        const id = this.props.ispCtrl.getID();
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id);
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id);
    },
    renderHeader(){
        const options = this.props.ispCtrl.getOptions();
        const header = options.name;
        let rules = optionMapping.
            filter(function(mapping){
                return options[mapping.attribute] !== null && options[mapping.attribute] !== undefined;
            }).map(function(mapping, index){
                return <span key={index} className="col-xs-6 option">{mapping.text + options[mapping.attribute]}</span>
            });
        if(rules.length === 0){
            return header;
        }
        return <div>{header}<hr/>{rules}</div>
    },
    render() {
        const ispCtrl = this.props.ispCtrl;
        const rows = ispCtrl.getCourses()
            .map(function(child) {
                return <CourseDnD key={child.nr} field={ispCtrl.getID()} course={child}/>;
            });
        return <SimpleDropTarget className={this.props.className} id={ispCtrl.getID()}>
            <Panel header={this.renderHeader()}>
                {rows.length === 0 ? this.props.children : rows}
            </Panel>
        </SimpleDropTarget>
    }
});
