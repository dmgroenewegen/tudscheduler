import React, {
    PropTypes
}
from 'react';
import {
    Modal, Button, Table, Col
}
from 'react-bootstrap';
import ISPCtrl from '../../models/ISPCtrl.js';
import CourseCtrl from '../../models/CourseCtrl.js';
import _ from 'lodash';

/**
 * Renders the modal form that shows all the isp fields with the selected courses and shows the user credentials.
 */
export
default React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired,
        edit: PropTypes.func.isRequired,
        closeModal: PropTypes.func.isRequired,
        show: PropTypes.bool.isRequired
    },
    /**
     * Sums all the ects of all the courses
     * @return {Number} The total ects of all the selected courses.
     */
    totalEcts() {
        return CourseCtrl.sumEcts(ISPCtrl.ispFieldModels
            .filter(function(field) {
                return field.getID() !== 'unlisted';
            }).reduce(function(acc,field) {
                return acc.concat(field.getCourses());
            }, []));
    },
    /**
     * Renders a course, showing the course id, name and ects
     * @param  {Object} courseTree A course tree object
     * @param  {Number} index  The key of the element
     * @return {React}        A react component
     */
    renderCourse(courseTree, index) {
        const course = CourseCtrl.get(courseTree.id);
        return <tr key={index}><td>{course.name}</td>
            <td>{course.courseName}</td><td>{course.ects}</td><td></td></tr>;
    },
    /**
     * Renders a ISP field
     * @param  {Object} field An ISP model
     * @param  {Number} index The key of the element.
     * @return {React}       A react component
     */
    renderField(field, index) {
        return (<tbody><tr key={index} className="header blue">
            <td colSpan="4">{field.getOptions().name}</td>
        </tr>{field.getCourses().map(this.renderCourse)}
        <tr>
            <td></td><td className="text-bold text-right">Subtotal</td>
            <td>{CourseCtrl.sumEcts(field.getCourses())}</td>
            <td></td>
        </tr></tbody>);
    },
    /**
     * Renders all the fields
     * @return {Array} An array of react components.
     */
    renderFields() {
        return ISPCtrl.ispFieldModels.filter(function(field) {
            return field.getID() !== 'unlisted';
        }).map(this.renderField);
    },
    render() {
        return <Modal id="isp-form" className="print" show={this.props.show} bsSize="large"
        onHide={this.props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title><Button onClick={this.props.edit}>Edit</Button></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="isp-form">
                    <div id="header">
                        <div id="left">
                            <p>APPLICATION FORM MSc STUDY PROGRAMMA<br/>
                            2015 - 2016</p>
                            <h3>COMPUTER SCIENCE</h3><br/>
                            TRACK SOFTWARE TECHNOLOGY
                        </div>
                        <div id="right">
                            <img src="src/images/tudelft.jpg"/>
                            <hr/>
                            <p>Delft University of Technology<br/>
                            Faculty of Electrical Engineering,<br/>
                            Mathematics and Computer Science</p>
                        </div>
                    </div>
                    <Table condensed className="clean"><tbody>
                        <tr>
                            <td>Student number</td><td>{this.props.data.studentNumber}</td>
                            <td>Name</td><td>{this.props.data.name}</td>
                        </tr>
                        <tr>
                            <td>Phone number</td><td>{this.props.data.phone}</td>
                            <td>Date 1st register. Msc.</td><td>{this.props.data.dateRegister}</td>
                        </tr>
                        <tr>
                            <td>Special program</td><td>{this.props.data.specialProgram}</td>
                        </tr>
                        <tr>
                            <td>BSc. programme</td><td>{this.props.data.bscProgram}</td>
                        </tr>
                    </tbody></Table>
                    <Table condensed bordered><tbody>
                        <tr className="header">
                            <td>Code</td><td>Course</td><td>EC</td><td>Remarks</td>
                        </tr></tbody>
                        {this.renderFields()}
                        <tbody><tr className="blue header">
                            <td></td>
                            <td className="text-right">TOTAL</td>
                            <td>{this.totalEcts()}</td>
                            <td></td>
                        </tr>
                    </tbody></Table>
                    <Table id="footer" condensed className="clean">
                        <thead>
                            <tr><td width="33%">Master Coordinator</td>
                            <td width="33%">Responsible Full or Associate Professor</td>
                            <td width="33%">Borad of Examiners</td></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name:</td><td>Name:</td><td>Name:</td>
                            </tr>
                            <tr>
                                <td>Date and signature:</td>
                                <td>Date and signature:</td>
                                <td>Date and signature:</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>;
    }
});
