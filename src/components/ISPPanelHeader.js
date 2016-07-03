import React from 'react';
import DebounceInput from 'react-debounce-input';
import classnames from 'classnames';
import {
    OverlayTrigger, Tooltip
}
from 'react-bootstrap';
import EventServer from '../models/EventServer.js';
import _ from 'lodash';

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
            collapsed: false,
            showRules: false,
            search: false,
            searchValue: ''
        };
    },
    componentDidMount() {
        this.startListening();
    },
    startListening() {
        const id = this.props.ispCtrl.getID();
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id + 'header');
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id + 'header');
    },
    toggleView() {
        const collapsed = !this.state.collapsed;
        this.setState({
            collapsed: collapsed
        }, () => this.props.toggleView(collapsed));
    },
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules
        });
    },
    toggleSearch() {
        const search = !this.state.search
        this.setState({
            search: !this.state.search
        }, ()=>{
            if(!search){
                this.props.setSearch(null);
            }
        });
    },
    onChange(event) {
        const nextSearch = event.target.value;
        this.setState({
            searchValue: nextSearch
        }, this.props.setSearch(nextSearch));
    },
    renderRules() {
        if (this.state.collapsed || !this.state.showRules) {
            return null;
        }
        const options = this.props.ispCtrl.getOptions();
        const errors = this.props.ispCtrl.getErrors();
        const rules = optionMapping.
        filter(function(mapping) {
            return options[mapping.attribute] !== null && options[mapping.attribute] !== undefined;
        })
            .map(function(mapping, index) {
                const classes = classnames('col-xs-6', 'option', {
                    'has-error': hasError(mapping, errors)
                });
                return <span key={index} className={classes}>{mapping.text + options[mapping.attribute]}</span>
            });
        return [<hr key={1}/>, <div className='row' key={2}>{rules}</div>];
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

        if (this.props.options.search) {
            const tooltip = <Tooltip id="show-search">Search</Tooltip>
            search = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-search fa-lg' onClick={this.toggleSearch}/>
            </OverlayTrigger>;
        }

        return <span className='pull-right'>{search}{overlayRules}{overlayMM}</span>;
    },
    renderSearch() {
        if (this.state.search) {
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
    render() {
        const options = this.props.ispCtrl.getOptions();
        const header = options.name;
        return <div className={classnames(this.props.className, 'panel-heading')}>
            <h3 className='panel-title'>{header}{this.renderControl()}</h3>
            {this.renderRules()}{this.renderSearch()}</div>
    }
});
