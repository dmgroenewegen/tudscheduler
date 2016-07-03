import React, {PropTypes} from 'react';
import DebounceInput from 'react-debounce-input';

/**
 * Search input being used by the sidebar
 */
export default React.createClass({
    propTypes:{
        setSearch: PropTypes.func.isRequired
    },
    getInitialState(){
        return {
            value: ''
        };
    },
    /**
     * Called when an input changes
     * @param  {Object} event The event object
     */
    onChange(event){
        const nextSearch = event.target.value;
        this.setState({
            value: nextSearch
        }, () => this.props.setSearch(nextSearch));
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
