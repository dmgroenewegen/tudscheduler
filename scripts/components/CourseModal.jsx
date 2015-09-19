import React from 'react';
import {Modal} from 'react-bootstrap';

export default React.createClass({
    getInitialState(){
        return {
            show: this.props.show
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            show: nextProps.show
        });
    },
    close(){
        this.setState({
            show: false
        });
    },
    render(){
        var course = this.props.course;
        var filterKeys = ['depth', 'nr', 'parent', 'children', 'id'];
        return <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{course.name} {course.courseName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <dl>
                {Object.keys(course).map(function(key){
                    if (filterKeys.indexOf(key) !== -1){
                        return null;
                    }
                    return [<dt>{key}</dt>, <dd>{course[key]}</dd>];
                })}
                </dl>
            </Modal.Body>
        </Modal>;
    }
});
