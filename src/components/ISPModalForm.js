import React from 'react';
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
export default React.createClass({
    handleInputChange(event, field){
        data[field] = event.target.value;
    },
    renderInput(field){
        return <FormGroup controlId="formHorizontalEmail">
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
