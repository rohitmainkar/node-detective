import React from 'react'
import Select from 'react-select'
import { Tbody, Thead } from 'react-super-responsive-table'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap'

export default function UnitConverstion(props) {

    const { pageMode, formValue, TableData = [], BaseUnit = [], } = props.state;

    const { settable, setFormValue } = props

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function baseunitOnchange(event) {

        const val = { ...formValue }
        val["BaseUnit"] = event
        setFormValue(val)

        if (TableData[0]) {
            settable([{
                Conversion: '1',
                Unit: event,
                SOUnit: false,
                IsBase: false
            }])
        }
    }

    function addRow_Handler() {

        const newarr = [...TableData, {
            Conversion: '',
            Unit: '',
            POUnit: false,
            SOUnit: false,
            IsBase: false
        }]
        settable(newarr)
    }

    function deleteRow_Handler(key) {

        const found = TableData.filter((i, k) => {
            return !(k === key)
        })
        settable(found)
    }

    function baseUnit2_onChange(event, type = '', key) {

        const found = TableData.find((i, k) => {
            return (k === key)
        })

        found.type = event;

        settable(e1 => (e1.map((index, k) => {
            if ((type === 'POUnit') && !(k === key)) {
                index.SOUnit = false
            };
            if ((type === 'SOUnit') && !(k === key)) {
                index.POUnit = false
            }
            return (k === key) ? found : index
        })))
    }

    let BaseUnit_DropdownOptions2 = []
    BaseUnit.forEach(myFunction);

    function myFunction(item, index, arr) {

        if (!(formValue.BaseUnit.label === item.Name)) {
            BaseUnit_DropdownOptions2[index] = {
                value: item.id,
                label: item.Name
            };
        }
    }
    const tbodyfunction = () => {

        const newarr = []

        TableData.forEach((index, key) => {
            newarr.push(
                (
                    <tr >
                        <td>
                            <Row>
                                <Label className=" col-sm-2 col-form-label">1</Label>
                                <Col md={7}>
                                    <Select
                                        id={`dropUnit-${key}`}
                                        isDisabled={(key === 0) ? true : false}
                                        placeholder="Select..."
                                        value={index.Unit}
                                        options={BaseUnit_DropdownOptions2}
                                        onChange={(e) => baseUnit2_onChange(e, "Unit", key)}
                                    />
                                </Col>
                                < Label className=" col-sm-2 col-form-label">=</Label>
                            </Row>
                        </td>

                        <td>
                            <Row>
                                <Col>
                                    <Input
                                        type="text"
                                        id={`txtConversion${key}`}
                                        placeholder="Select"
                                        disabled={(key === 0) ? true : false}
                                        autoComplete="off"
                                        defaultValue={index.Conversion}
                                        onChange={(event) => baseUnit2_onChange(event.target.value, "Conversion", key,)}
                                    >
                                    </Input>
                                </Col>
                                <Label className=" col-sm-4 col-form-label"> {formValue.BaseUnit.label}</Label>
                            </Row>
                        </td>

                        <td>
                            <div>
                                <Input
                                    type="radio"
                                    id={`POUnit-${key}`}
                                    key={`POUnit-${key}`}
                                    name="btnradio"
                                    value={index.POUnit}
                                    checked={TableData[key].POUnit}
                                    onChange={(e) => baseUnit2_onChange(e.target.checked, "POUnit", key)}
                                >
                                </Input>
                            </div>
                        </td>

                        <td>
                            <div>
                                <Input
                                    type="radio"
                                    id={`SOUnit-${key}`}
                                    name="btnradio1"
                                    key={`SOUnit-${key}`}
                                    value={index.SOUnit}
                                    checked={TableData[key].SOUnit}
                                    onChange={(e) => baseUnit2_onChange(e.target.checked, "SOUnit", key)}
                                >
                                </Input>
                            </div>
                        </td>

                        <td>
                            {(TableData.length === key + 1) ?
                                <Row className="">
                                    <Col md={6} className=" mt-3">
                                        {(TableData.length > 1) ? <>
                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                deleteRow_Handler(key)
                                            }} >
                                            </i>
                                        </> : <Col md={6} ></Col>}

                                    </Col>

                                    <Col md={6} style={{ marginRight: "" }}>
                                        <Button
                                            style={{ marginLeft: "-0.6cm" }}
                                            className=" button_add"
                                            color="btn btn-outline-primary border-2 font-size-12"
                                            type="button"
                                            onClick={() => { addRow_Handler(key) }}
                                        >
                                            <i className="dripicons-plus "></i>
                                        </Button>
                                    </Col>
                                </Row>
                                :

                                < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                    deleteRow_Handler(key)
                                }} >
                                </i>
                            }
                        </td>
                    </tr>
                )
            )

        });
        return newarr
    }

    return (
        <div>
            <Card className="text-black">
                <CardBody className='c_card_body'>

                    <Row>
                        <FormGroup className=" col col-sm-4 " >
                            <Label >Base Unit</Label>
                            <Select
                                id={`dropBaseUnit-0`}
                                placeholder="Select..."
                                value={formValue.BaseUnit}
                                isDisabled={pageMode === "edit" ? true : false}
                                options={BaseUnit_DropdownOptions}
                                onChange={baseunitOnchange}
                            />
                        </FormGroup>
                    </Row>

                    {!(formValue.BaseUnit.value === 0)
                        ? <Row className="mt-3">
                            <Col md={8}>
                                <Table className="table table-bordered  ">
                                    <Thead >
                                        <tr>
                                            <th className="col-sm-3">Unit Name</th>
                                            <th className="col-sm-3 text-center">Conversion To Base Unit </th>
                                            <th className="col-sm-1 text-center">PO Unit</th>
                                            <th className="col-sm-1 text-center">SO Unit</th>
                                            <th className="col-sm-2">Action</th>
                                        </tr>
                                    </Thead>
                                    <Tbody  >
                                        {tbodyfunction()}
                                    </Tbody>
                                </Table>
                            </Col>
                        </Row>
                        :
                        <Row className="mt-3">
                            <br></br>
                            <Label className="text-danger">Please select BaseUnit</Label></Row>}
                </CardBody>
            </Card>
        </div>
    )
}
