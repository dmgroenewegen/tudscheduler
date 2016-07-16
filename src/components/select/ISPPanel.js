import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import classnames from 'classnames';
import ISPPanelBody from './ISPPanelBody.js';
import ISPPanelHeader from './ISPPanelHeader.js';

export
default React.createClass({
    propTypes:{
        ispModel: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            searchValue: '',
            isOver: false
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            isOver: nextProps.isOver
        });
    },
    /**
     * Toggles if the panel body should be shown or not
     * @param  {Bool} nextState Value to be set
     */
    toggleView(nextState) {
        this.setState({
            collapsed: nextState
        });
    },
    /**
     * Sets the search Value
     * @param {String} searchValue The search value
     */
    setSearch(searchValue){
        this.setState({
            searchValue: searchValue
        });
    },
    render() {
        const ispModel = this.props.ispModel;
        const bodyClasses = classnames({'hide':this.state.collapsed});
        const header = <ISPPanelHeader
            ispModel={this.props.ispModel}
            options={this.props.options}
            setSearch={this.setSearch}
            toggleView={this.toggleView}/>;
        return <div className='panel panel-default'>
            {header}
            <ISPPanelBody className={bodyClasses}
                ispModel={this.props.ispModel}
                isOver={this.state.isOver}
                options={this.props.options}
                filter={this.state.searchValue}/>
        </div>;
    }
});
