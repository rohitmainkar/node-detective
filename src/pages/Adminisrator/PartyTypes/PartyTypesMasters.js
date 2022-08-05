import React, { useState, useEffect, useRef } from "react";
import {

    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,

} from "reactstrap";


import Breadcrumb from "../../../components/Common/Breadcrumb";

import { MetaTags } from "react-meta-tags";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import { PostPartyTypesSubmit } from "../../../store/Administrator/PartyTypeRedux/action";
import { useDispatch } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
// import Select from " react-select";
import ReactSelect from "react-select";

const PartyTypesMaster = (props) => {
    const dispatch = useDispatch();
    
    const [Name, setName] = useState("");
    const [Division, setDivision] = useState("");

    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            Division:values.Division,
            Description: "sfasfgasd",
            CreatedBy: 1,
            CreatedOn: "2022-07-18T00:00:00",
            UpdatedBy: 1,
            UpdatedOn: "2022-07-18T00:00:00"
        });
        dispatch(PostPartyTypesSubmit(jsonBody));
       //  console.log("jsonBody",jsonBody)
        dispatch(AlertState({
            Type: 1, Status: true,
            Message: "Party Type Save Successfully",
          }));
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Module| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumb breadcrumbItem={"Party Type Master"} />
                <Container fluid>
                    <Card className="text-black">
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <h4 className="card-title text-black">{"Employee Type Master"}</h4>
                            <p className="card-title-desc text-black">{"Employee Type Master"}</p>
                        </CardHeader>

                        <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                            <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                            >
                                <Row className="">
                                    <Col md={12}>
                                        <Card>
                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                <Row>
                                                    <FormGroup className="mb-2 col col-sm-4 ">
                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                        <AvField
                                                            name="Name"
                                                            id="txtName"
                                                            value={Name}
                                                            type="text"
                                                            placeholder="Please Enter Name"
                                                            autoComplete='off'
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please Enter Name' },
                                                            }}
                                                        // onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                        />
                                                    </FormGroup>

                                                    <Col md="4" className="">
                                                <FormGroup className="mb-3 row" >
                                                    <Label className="col-sm-3 p-2">Division</Label>
                                                    <Col md="9">
                                                        <ReactSelect
                                                            value={Division}
                                                            className="rounded-bottom"                                       
                                                            // options= {DivisionTypesValues}
                                                            // onChange={(e) => {handllerDivisionTypes(e) }}
                                                           
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                                    
                                                    <FormGroup>
                                                        <Row>
                                                            <Col sm={2}>
                                                                <button
                                                                    type="submit"
                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                                                    className="btn btn-primary w-md"
                                                                > <i className="fas fa-save me-2"></i> Save
                                                                </button>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </AvForm>
                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default PartyTypesMaster
