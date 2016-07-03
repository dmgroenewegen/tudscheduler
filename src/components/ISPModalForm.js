import React, {PropTypes} from 'react';
import {Modal, Button, Form, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

let data = {};
const fields = [{
    label: 'name',
    field: 'name'
},{
    label: 'Phonenumber',
    field: 'phone'
},{
    label: 'Student number',
    field: 'studentNumber'
},{
    label: 'Date 1st register. Msc.',
    field: 'dateRegister'
},{
    label: 'Special program',
    field: 'specialProgram'
},{
    label: 'BSc. programme',
    field: 'bscProgram'
}];
/**
 * Renders the modal form in which the user submits his credentials which should be rendered on the isp form that is being send/printed.
 */
export default React.createClass({
    propTypes:{
        show: PropTypes.bool.isRequired,
        closeModal: PropTypes.func.isRequired,
        overview: PropTypes.func.isRequired
    },
    /**
     * Called when a input field is changed
     * @param  {Object} event Contains information about the event that trigged the change.
     * @param  {String} field The field that is changed.
     */
    handleInputChange(event, field){
        data[field] = event.target.value;
    },
    /**
     * Renders an input.
     * @param  {String} field The field name
     * @param  {Number} index The key that should be set
     * @return {React}       A react component.
     */
    renderInput(field, index){
        return <FormGroup key={index} controlId="formHorizontalEmail">
            <ControlLabel>{field.label}</ControlLabel>
            <FormControl type="text" onChange={(e) => this.handleInputChange(e, field.field)}
                placeholder={field.label} />
        </FormGroup>
    },
    render(){
        return <Modal show={this.props.show}
        onHide={this.props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title><Button onClick={() => this.props.overview(data)}>Overview</Button></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                {fields.map(this.renderInput)}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>;
    }
});
