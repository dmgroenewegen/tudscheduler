import React from 'react';
import DebounceInput from 'react-debounce-input';

export default React.createClass({
    getInitialState(){
        return {
            value: ''
        };
    },
    onChange(nextValue){
        this.setState({
            value: nextValue
        }, () => this.props.setSearch(nextValue));
    },
    render(){
        var searchAddon = <i className="fa fa-search"></i>;
        return <div className='form-group'>
            <div className='input-group'>
                <span className="input-group-addon">{searchAddon}</span>
                <DebounceInput
                    minLength={2}
                    debounceTimeout={200}
                    type='text'
                    value={this.state.value}
                    className='form-control'
                    placeholder='search on code or name, atleast 2 characters'
                    onChange={this.onChange}/>
            </div>
        </div>;
    }
});
