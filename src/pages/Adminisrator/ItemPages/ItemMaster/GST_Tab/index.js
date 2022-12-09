import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import Flatpickr from "react-flatpickr"
import GSTTable from './Table';
import { createdBy, userCompany } from '../../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons';

function GSTTab(props) {

    const [effectiveDate, setEffectiveDate] = useState('');
    const [GST, setGST] = useState('');
    const [HSNCode, setHSNCode] = useState('');

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const addRowsHandler = (data) => {
        const val = {
            GSTPercentage: GST,
            HSNCode: HSNCode,
            EffectiveDate: effectiveDate,
            CreatedBy: createdBy(),
            UpdatedBy: createdBy(),
            Company: userCompany(),
            CommonID: 0,
            IsDeleted: 0,
            IsAdd: true,
        };

        if (!(GST === "")
            && !(HSNCode === "")
            && !(effectiveDate === "")
        ) {
            const totalTableData = props.tableData.length;
            val.id = totalTableData + 1;
            const updatedTableData = [...props.tableData];
            updatedTableData.push(val);
            props.func(updatedTableData)
            clearState();

        }
        else {
            alert("Please Enter value")
        }
    };
    const clearState = () => {
        setGST('');
        setHSNCode('');
        setEffectiveDate('');
    };

    return (

        <Row>
            <Col md={12}  >
                <Card className="text-black">
                    <CardBody className='c_card_body'>
                        <Row>

                            <FormGroup className="mb-3 col col-sm-3 ">
                                <Label>Effective Date</Label>
                                <div id={`txtEffectiveDate${0}`} >
                                    <Flatpickr
                                        id={`txtEffectiveDate${0}`}
                                        name="FSSAIExipry"
                                        value={effectiveDate}
                                        required={true}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="YYYY-MM-DD"
                                        autoComplete='off'
                                        options={{
                                            altInput: true,
                                            altFormat: "F j, Y",
                                            dateFormat: "Y-m-d"
                                        }}
                                        onChange={EffectiveDateHandler}
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >GST</Label>
                                <Input type="text"
                                    id={`txtGST${0}`}
                                    value={GST}
                                    placeholder="Please Enter Margin"
                                    autoComplete="off"
                                    onChange={(event) => setGST(event.target.value)}
                                />

                            </FormGroup>

                            <FormGroup className="mb-3 col col-sm-3 " >
                                <Label >HSNCode</Label>
                                <Input type="text"
                                    id={`txtHSNCode${0}`}
                                    value={HSNCode}
                                    placeholder="Please Enter Margin"
                                    autoComplete="off"
                                    onChange={(event) => setHSNCode(event.target.value)}
                                />

                            </FormGroup>
                            <Col md={1}>

                                <Row className=" mt-3">
                                    <Col >
                                        <Button
                                              className=" button_add"
                                              color="btn btn-outline-primary border-2 font-size-12"
                                            type="button"
                                            onClick={addRowsHandler}
                                        >
                                            <i className="dripicons-plus mt-3"> </i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <GSTTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>
        </Row>
    );
}

export default GSTTab;
