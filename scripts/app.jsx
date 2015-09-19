import React from 'react';
import SideBar from './SideBar.jsx';
import Main from './Main.jsx';
import Controls from './Controls.jsx';

window.React = React;

var App = React.createClass({
    render() {
        return (
            <div className="row">
                    <Controls className="col-xs-12"/>
                    <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
                    <Main className="col-xs-12 col-md-7 col-lg-8"/>
                </div>);
    }
});

React.render(<App/>, document.getElementById('react'));
