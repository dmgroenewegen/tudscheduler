import React from 'react';
import {render} from 'react-dom'
import SideBar from './components/SideBar.js';
import YearView from './components/YearView.js';
import Notifications from './components/Notifications.js';
import Header from './components/Header.js';
import SelectView from './components/SelectView.js';

window.React = React;
// window.Perf = React.addons.Perf;

let App = React.createClass({
    render() {
        return (<div className="row">
            <Header className='col-xs-12'/>
            <Notifications/>
            <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
            <SelectView className="col-xs-12 col-md-5 col-lg-8"/>
        </div>);
    }
});

render(<App/>, document.getElementById('react'));
