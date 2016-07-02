import React from 'react';
import EventServer from '../models/EventServer.js';
import CourseDnD from './CourseDnD.js'
import {
    Panel, OverlayTrigger, Tooltip
}
from 'react-bootstrap';
import ISPCtrl from '../models/ISPCtrl.js';
import classnames from 'classnames';
import DebounceInput from 'react-debounce-input';

let hasError = function hasError(mapping, errors) {
    return errors.indexOf(mapping.attribute) !== -1;
};

let hasNeedle = function hasNeedle(course, needle){
    if (!needle || needle.length === 0) {
        return true;
    }
    return course.name.toLowerCase().indexOf(needle) !== -1 || (!!course.courseName &&
        course.courseName.toLowerCase().indexOf(needle) !== -1);
}

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
            collapsed: false,
            search: false,
            searchValue: '',
            isOver: false
        }
    },
    componentDidMount() {
        this.startListening();
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            isOver: nextProps.isOver
        })
    },
    startListening() {
        const id = this.props.ispCtrl.getID();
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id);
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id);
    },
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules
        });
    },
    toggleView() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    },
    toggleSearch() {
        this.setState({
            search: !this.state.search
        });
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
        var search = null;

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
            const tooltip = <Tooltip id="show-all">Maximize</Tooltip>
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-plus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        } else {
            const tooltip = <Tooltip id="hide-all">Minimize</Tooltip>
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-minus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        }

        if (this.props.options.search){
            const tooltip = <Tooltip id="show-search">Search</Tooltip>
            search = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-search fa-lg' onClick={this.toggleSearch}/>
            </OverlayTrigger>;
        }

        return <span className='pull-right'>{search}{overlayRules}{overlayMM}</span>;
    },
    onChange(event){
        const nextSearch = event.target.value;
        this.setState({
            searchValue: nextSearch
        });
    },
    renderSearch(){
        if(this.state.search){
            return <div><hr/>
            <DebounceInput
                    minLength={2}
                    debounceTimeout={200}
                    type='text'
                    value={this.state.searchValue}
                    className='form-control'
                    placeholder='search on code or name, atleast 2 characters'
                    onChange={this.onChange}/>
            </div>
        }
        return null;
    },
    renderHeader() {
        const options = this.props.ispCtrl.getOptions();
        const header = options.name;
        return <div>{header}{this.renderControl()}{this.renderRules()}{this.renderSearch()}</div>
    },
    renderBody() {
        let self = this;
        const ispCtrl = this.props.ispCtrl;
        const rows = _(ispCtrl.getCourses())
            .orderBy('name')
            .filter(function(child){
                return !self.state.search || hasNeedle(child, self.state.searchValue);
            })
            .map(function(child) {
                return <CourseDnD key={child.nr} field={ispCtrl.getID()} course={child}/>;
            })
            .value();
        if (this.state.collapsed) {
            return null;
        } else if (rows.length > 0) {
            return rows
        } else if (this.state.isOver){
            return <span className="empty">{this.props.options.onHover}</span>
        }
        return <span className="empty">{this.props.options.onEmpty}</span>;
    },
    render() {
        const ispCtrl = this.props.ispCtrl;
        return <Panel header={this.renderHeader()}>
            {this.renderBody()}
        </Panel>
    }
});
