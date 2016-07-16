import React, {PropTypes} from 'react';
import ISPModalForm from './ISPModalForm.js';
import ISPModalOverview from './ISPModalOverview.js';

/**
 * Renders the modal which is invoked when a user is done organising his isp fields.
 */
export default React.createClass({
    propTypes:{
        show: PropTypes.bool.isRequired,
        closeModal: PropTypes.func.isRequired
    },
    getInitialState(){
        return {
            edit: true,
            show: this.props.show,
            data: {}
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            show: nextProps.show
        });
    },
    edit(){
        this.setState({
            edit: true
        });
    },
    overview(inputedData){
        this.setState({
            edit: false,
            data: inputedData
        });
    },
    render(){
        return (this.state.edit) ? <ISPModalForm closeModal={this.props.closeModal} overview={this.overview} show={this.state.show}/> :
            <ISPModalOverview edit={this.edit} closeModal={this.props.closeModal} show={this.state.show} data={this.state.data}/>;
    }
});
