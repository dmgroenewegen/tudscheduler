import React from 'react';
import EventServer from '../models/EventServer.js';
import CourseDnD from './CourseDnD.js'
import {
    Panel, OverlayTrigger, Tooltip
}
from 'react-bootstrap';
import SimpleDropTarget from './SimpleDropTarget.js';
import ISPCtrl from '../models/ISPCtrl.js';
import classnames from 'classnames';

let hasError = function hasError(mapping, errors) {
    return errors.indexOf(mapping.attribute) !== -1;
};

const optionMapping = [{
    attribute: 'minEC',
    text: 'Min EC: '
}, {
    attribute: 'maxEC',
    text: 'Max EC: '
}, {
    attribute: 'minCourses',
    text: 'Min #courses: '
}, {
    attribute: 'maxCourses',
    text: 'Max #courses: '
}];

export
default React.createClass({
    getInitialState() {
        return {
            showRules: false,
            collapsed: false
        }
    },
    componentDidMount() {
        this.startListening();
    },
    startListening() {
        const id = this.props.ispCtrl.getID();
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id);
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id);
    },
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules
        })
    },
    toggleView() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    },
    renderRules() {
        const options = this.props.ispCtrl.getOptions();
        const errors = this.props.ispCtrl.getErrors();
        const rules = optionMapping.
        filter(function(mapping) {
            return options[mapping.attribute] !== null && options[mapping.attribute] !== undefined;
        }).map(function(mapping, index) {
            const classes = classnames('col-xs-6', 'option', {
                'has-error': hasError(mapping, errors)
            });
            return <span key={index} className={classes}>{mapping.text + options[mapping.attribute]}</span>
        });
        if (!this.state.collapsed && this.state.showRules) {
            return <div><hr/>{rules}</div>;
        }
        return null;
    },
    renderControl() {
        var overlayRules = null;
        var overlayMM = null;

        const options = this.props.ispCtrl.getOptions();
        const rules = optionMapping.filter(function(mapping) {
            return options[mapping.attribute] !== null && options[mapping.attribute] !== undefined;
        });

        if (rules.length > 0 && this.state.showRules) {
            const tooltip = <Tooltip id="show-rules">Hide rules</Tooltip>
            overlayRules = <OverlayTrigger placement='top' overlay={tooltip}>
                <i className='fa fa-cog fa-lg' onClick={this.toggleRules}/>
            </OverlayTrigger>;
        } else if (rules.length > 0 && !this.state.showRules) {
            const tooltip = <Tooltip id="show-rules">Show rules</Tooltip>
            overlayRules = <OverlayTrigger placement='top' overlay={tooltip}>
                <i className='fa fa-cog fa-lg' onClick={this.toggleRules}/>
            </OverlayTrigger>;
        }

        if (this.state.collapsed) {
            const tooltip = <Tooltip id="show-rules">Maximize</Tooltip>
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-plus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        } else {
            const tooltip = <Tooltip id="show-rules">Minimize</Tooltip>
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-minus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        }

        return <span className='pull-right'>{overlayRules}{overlayMM}</span>;
    },
    renderHeader() {
        const options = this.props.ispCtrl.getOptions();
        const header = options.name;
        return <div>{header}{this.renderControl()}{this.renderRules()}</div>
    },
    renderBody() {
        const ispCtrl = this.props.ispCtrl;
        const rows = _(ispCtrl.getCourses())
            .orderBy('name')
            .map(function(child) {
                return <CourseDnD key={child.nr} field={ispCtrl.getID()} course={child}/>;
            })
            .value();
        if (this.state.collapsed) {
            return null;
        } else if (rows.length > 0) {
            return rows
        }
        return this.props.children;
    },
    render() {
        const ispCtrl = this.props.ispCtrl;
        return <SimpleDropTarget className={this.props.className} id={ispCtrl.getID()}>
            <Panel header={this.renderHeader()}>
                {this.renderBody()}
            </Panel>
        </SimpleDropTarget>
    }
});
