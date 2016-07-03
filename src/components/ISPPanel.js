import React from 'react';
import CourseDnD from './CourseDnD.js'
import {
    Panel
}
from 'react-bootstrap';
import classnames from 'classnames';
import ISPPanelBody from './ISPPanelBody.js';
import ISPPanelHeader from './ISPPanelHeader.js';

export
default React.createClass({
    getInitialState() {
        return {
            collapsed: false,
            searchValue: '',
            isOver: false
        }
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            isOver: nextProps.isOver
        })
    },
    toggleView(nextState) {
        this.setState({
            collapsed: nextState
        });
    },
    setSearch(searchValue){
        this.setState({
            searchValue: searchValue
        });
    },
    render() {
        const ispCtrl = this.props.ispCtrl;
        const bodyClasses = classnames({'hide':this.state.collapsed});
        const header = <ISPPanelHeader
            ispCtrl={this.props.ispCtrl}
            options={this.props.options}
            setSearch={this.setSearch}
            toggleView={this.toggleView}/>
        return <div className='panel panel-default'>
            {header}
            <ISPPanelBody className={bodyClasses}
                ispCtrl={this.props.ispCtrl}
                isOver={this.state.isOver}
                options={this.props.options}
                filter={this.state.searchValue}/>
        </div>
    }
});
