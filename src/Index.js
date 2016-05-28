import React from 'react';
import {render} from 'react-dom'
import SideBar from './components/SideBar.js';
import Main from './components/Main.js';
import Notifications from './components/Notifications.js';
import Header from './components/Header.js';

window.React = React;
// window.Perf = React.addons.Perf;

let App = React.createClass({
    render() {
        return (<div className="row">
            <Header className='col-xs-12'/>
            <Notifications/>
            <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
            <Main className="col-xs-12 col-md-7 col-lg-8"/>
        </div>);
    }
});

render(<App/>, document.getElementById('react'));
