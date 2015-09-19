import React from 'react';
import {ListGroup} from 'react-bootstrap';
import CourseCtrl from '../models/CourseCtrl.js';
import EventServer from '../models/EventServer.js';
import CourseTree from './CourseTree.jsx';
import SearchInput from './SearchInput.jsx';

export default React.createClass({
    getInitialState(){
        return {search: ''};
    },
    componentDidMount(){
        EventServer.onAny(() => this.forceUpdate());
    },
    setSearch(nextSearch){
        this.setState({
            search: nextSearch
        });
    },
    render(){
        var search = this.state.search.toLowerCase();
        var filterId = (search !== '') ? 'id' : 'nr';
        var rows = CourseCtrl
            .flatten(function(){
                return true;
            }, null, filterId)
            .map(function(child){
                var visible = child.parent === 1;
                return <CourseTree key={child.nr}
                    search={search}
                    visible={visible}
                    course={child}/>;
            });
        return <div {...this.props}>
                <ListGroup>
                    <SearchInput setSearch={this.setSearch}/>
                    {rows}
                </ListGroup>
            </div>;
    }
});
