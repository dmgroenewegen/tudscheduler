import React from 'react';
import SideBar from './SideBar.jsx';
import Main from './Main.jsx';
window.React = React;

var App = React.createClass({
    render() {
        return (<div className="row">
                    <SideBar className="col-md-5 col-lg-4"/>
                    <Main className="col-md-7 col-lg-8"/>
                </div>);
    }
});

React.render(<App/>, document.getElementById('react'));
