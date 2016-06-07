import React from 'react';
import ISPModalForm from './ISPModalForm.js';
import ISPModalOverview from './ISPModalOverview.js';

export default React.createClass({
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
            <ISPModalOverview edit={this.edit} closeModal={this.props.closeModal} show={this.state.show} data={this.state.data}/>
    }
});
