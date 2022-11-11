import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr"
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { getAddressTypes } from '../../../store/Administrator/PartyRedux/action';
import AddressDetailsTable from './Table';
import { AvField, AvInput } from 'availity-reactstrap-validation';

function AddressDetails_Tab(props) {

    const [address, setAddress] = useState('');
    const [FSSAINo, setFSSAINo] = useState('');
    const [FSSAIExipry, setFSSAIExipry] = useState('');
    const [PIN, setPIN] = useState('');
    const [IsDefault, setIsDefault] = useState(false);

    const FSSAIExipryHandler = (e, date) => {
        setFSSAIExipry(date)
    }

    const FSSAINoHandler = (event) => {
        setFSSAINo(event.target.value)
    }

    const AddressHandler = (event) => {
        setAddress(event.target.value)
    }

    const PINHandler = (event) => {
        setPIN(event.target.value)
    }

    const IsDefaultHandler = (event) => {
        setIsDefault(event.target.checked)

    }

    const addRowsHandler = (data) => {

        const val = {
            Address: address,
            FSSAINo: FSSAINo,
            FSSAIExipry: FSSAIExipry,
            PIN: PIN,
            IsDefault: IsDefault
        };

        if (!(address === "")
            && !(FSSAINo === "")
            && !(FSSAIExipry === "")
            && !(PIN === "")
            && !(IsDefault === "")
        ) {
            if (IsDefault) {
                props.tableData.forEach(ele => {
                    ele.IsDefault = false
                });
            }
            const tableleth = props.tableData.length;
            val.id = tableleth + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData)
            clearState();
        }
        else (alert("Please Enter value"))
    }

    const clearState = () => {
        setAddress('');
        setFSSAIExipry('');
        setFSSAINo('');
        setIsDefault(false);
        setPIN('');
    };

    return (
        <Row>
            <Col md={12}  >
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-3">
                            <Col md="9" >
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">Address </Label>
                                    <AvField name="Address" value={address} type="text"
                                        placeholder=" Please Enter Address "
                                        // validate={{
                                        //     required: { value: true, errorMessage: 'Please Enter your Address' },
                                        // }}
                                        onChange={AddressHandler}
                                    />
                                </FormGroup>
                            </Col>


                            <Col md="1" style={{ marginTop: '9px' }}>
                                <Button className="btn btn-sm btn-light mt-4   align-items-sm-end"
                                    type="button"
                                    onClick={addRowsHandler}
                                >
                                    <i className="dripicons-plus"></i>
                                </Button>
                            </Col>

                        </Row>
                        <Row>
                            {/* <Col md="4"></Col> */}
                            <Col md="4">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">
                                        FSSAI No </Label>
                                    <AvField
                                        name="FSSAINo"
                                        value={FSSAINo}
                                        placeholder="Please Enter FSSAINo"
                                        type="text"

                                        errorMessage="Please Enter FSSAI Number."
                                        className="form-control"
                                        // validate={{
                                        //     required: { value: true },
                                        //     tel: {
                                        //         pattern: /^(?:\d[- ]*){14}$/,
                                        //         errorMessage: 'FSSAINo Should be Fourteen Digit Only.'
                                        //     }
                                        // }}
                                        onChange={FSSAINoHandler}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1"></Col>
                            <Col md="4">
                                <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">FSSAI Exipry </Label>
                                    <Flatpickr
                                        id="FSSAIExipry"
                                        name="FSSAIExipry"
                                        value={FSSAIExipry}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder=" Please Enter FSSAI Exipry"
                                        options={{
                                            altInput: true,
                                            altFormat: "F j, Y",
                                            dateFormat: "Y-m-d"
                                        }}
                                        onChange={FSSAIExipryHandler}
                                    />
                                </FormGroup>
                            </Col>

                            {/* <Col md="1">  </Col> */}
                            <Row className='col col-12'>
                                {/* <Col md="4"> */}
                                <FormGroup className="mb-2 col-4">
                                    <Label htmlFor="validationCustom01"> PIN </Label>
                                    <AvField name="PIN" type="text"
                                        value={PIN}
                                        placeholder=" PIN No. "
                                        // validate={{
                                        //     required: { value: true, errorMessage: 'Please Enter your PIN No.' },
                                        //     tel: {
                                        //         pattern: "^[1-9][0-9]{5}$",
                                        //         errorMessage: 'PIN Should be Six Digit Only.'
                                        //     }
                                        // }
                                        // }
                                        onChange={PINHandler}
                                    />
                                </FormGroup>
                                {/* </Col> */}
                                <Col md="1">  </Col>
                                {/* <Col md="9"> */}
                                <FormGroup className="mb-2 col col-sm-5 mt-4">
                                    <Row className="justify-content-md-left">
                                        <Label htmlFor="horizontal-firstname-input" className="col-sm-4 col-form-label" >IsDefault </Label>
                                        <Col md={3} style={{ marginTop: '9px' }} >
                                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                <AvInput type="checkbox"
                                                    id="IsDefault"
                                                    className="form-check-input"
                                                    checked={IsDefault}
                                                    name="IsDefault"
                                                    onChange={IsDefaultHandler}
                                                // defaultChecked
                                                />
                                                <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                {/* </Col> */}
                            </Row>
                        </Row>

                    </CardBody>
                </Card>
                <Row>
                    <AddressDetailsTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}

export default AddressDetails_Tab;
