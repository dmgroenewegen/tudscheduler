import React from 'react';
import SideBar from './components/SideBar.jsx';
import Main from './components/Main.jsx';
import Controls from './components/Controls.jsx';
import Notifications from './components/Notifications.jsx';

window.React = React;

var App = React.createClass({
    render() {
        return (<div className="row">
            <Notifications/>
            <Controls className="col-xs-12"/>
            <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
            <Main className="col-xs-12 col-md-7 col-lg-8"/>
        </div>);
    }
});

React.render(<App/>, document.getElementById('react'));
