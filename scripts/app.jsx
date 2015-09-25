import React from 'react/addons';
import SideBar from './components/SideBar.jsx';
import Main from './components/Main.jsx';
import Notifications from './components/Notifications.jsx';
import Header from './components/Header.jsx';

window.React = React;
// window.Perf = React.addons.Perf;

var App = React.createClass({
    render() {
        return (<div className="row">
            <Header className='col-xs-12'/>
            <Notifications/>
            <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
            <Main className="col-xs-12 col-md-7 col-lg-8"/>
        </div>);
    }
});

React.render(<App/>, document.getElementById('react'));
