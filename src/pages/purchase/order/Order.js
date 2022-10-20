import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"

import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import { getSupplier, goButton, goButtonSuccess, postOrder, postOrderSuccess } from "../../../store/Purchase/OrderPageRedux/actions";
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import { AlertState } from "../../../store/actions";
import { basicAmount, GstAmount, totalAmount } from "./OrderPageCalulation";

let description = 'order'

function Order() {

    const props = { tableData: [], func: function a() { } }
    const dispatch = useDispatch();
    const history = useHistory()
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [customerSelect, setCustomerSelect] = useState('');
    const [orderAmount, setOrderAmount1] = useState("");
    const [change, setChange] = useState(false);


    useEffect(() => {
        // document.getElementById("txtName").focus();
        // dispatch(getOrderItems_ForOrderPage());
        // dispatch(getPartyListAPI())
        dispatch(getSupplier())
    }, [])

    const {
        items,
        postMsg,
        supplier,
        CustomSearchInput,
        customerNameList,
        userAccess,
        pageField
    } = useSelector((state) => ({
        items: state.OrderPageReducer.orderItem,
        supplier: state.OrderPageReducer.supplier,
        postMsg: state.OrderPageReducer.postMsg,
        CustomSearchInput: state.CustomSearchReducer.CustomSearchInput,
        // **customerNameList ==> this is  party list data geting from party list API
        customerNameList: state.PartyMasterReducer.partyList,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList
    }));


    useEffect(() => {

        const locationPath = history.location.pathname
        let userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postOrderSuccess({ Status: false }))

            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: false,
            }))

        } else if (postMsg.Status === true) {
            dispatch(postOrderSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    function test(e, row,) {
        row["inpQty"] = e.target.value;
        row["totalAmount"] = totalAmount(row)

        let sum = 0
        items.forEach(ind => {
            sum = sum + ind.totalAmount
        });
        setOrderAmount1(sum.toFixed(2))
    }

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "Name",
            sort: true,
        },
        {
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row, k) => {
                if (row.inpRate === undefined) { row["inpRate"] = 0 }
                if (row.totalAmount === undefined) { row["totalAmount"] = 0 }
                return (
                    <span className="text-right" >
                        <Input type="text" defaultValue={row.inpRate}
                            onChange={e => {
                                row["inpRate"] = e.target.value;
                                if (e.target.value > 0) {
                                    document.getElementById(`inpQty${k}`).disabled = false
                                } else {
                                    document.getElementById(`inpQty${k}`).disabled = true

                                }
                            }} />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },
        {
            text: "GST %",
            dataField: "GST",
            sort: true,
            formatter: (value, row) => (

                <span >
                    {value}
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "left" };
            }

        },
        {
            text: "Quntity",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (

                <span >
                    <Input type="text"
                        id={`inpQty${k}`}
                        defaultValue={row.inpQty}
                        disabled={(row.inpRate === 0) ? true : false}
                        onChange={(e) => {
                            test(e, row,)
                        }} />
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }


        },
        {
            text: "UOM",
            dataField: "",
            sort: true,
            formatter: (value, row, key) => {
                if (row.UOMLabel === undefined) {
                    row["UOM"] = row.UnitDetails[0].UnitID
                    row["UOMLabel"] = row.UnitDetails[0].UnitName
                    row["inpBaseUnitQty"] = row.UnitDetails[0].BaseUnitQuantity
                }
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        defaultValue={{ value: row.UOM, label: row.UOMLabel }}
                        // value={{value:row.UOM,label:row.UOMLabel}}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.UnitID,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["UOM"] = e.value;
                            row["UOMLabel"] = e.label
                            row["inpBaseUnitQty"] = e.baseUnitQty
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },

    ];

    const defaultSorted = [
        {
            dataField: "PriceList", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        // sizePerPage: 0,
        totalSize: 0,
        custom: true,
    };

    const EffectiveDateHandler = (e, date) => {
        setEffectiveDate(date)
    }

    const GoButton_Handler = () => {

        if (items.length > 0) {
            if (window.confirm("Refresh Order Item...!")) {
                dispatch(goButtonSuccess([]))
            } else {
                return
            }
        }

        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        let party = customerSelect.value
        const jsonBody = JSON.stringify({
            Division: division,
            Party: party,
            EffectiveDate: effectiveDate
        }
        );

        dispatch(goButton(jsonBody))
    };

    const saveHandeller = () => {
        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }

        let party = customerSelect.value

        const itemArr = []
        items.forEach(i => {
            if (i.inpQty > 0) {
                const arr = {
                    Item: i.id,
                    Quantity: i.inpQty,
                    MRP: i.MRP,
                    Rate: i.inpRate,
                    Unit: i.UOM,
                    BaseUnitQuantity: i.inpBaseUnitQty,
                    GST: i.Gstid,
                    Margin: "",
                    BasicAmount: basicAmount(i).toFixed(2),
                    GSTAmount: GstAmount(i).toFixed(2),
                    CGST: i.GST,
                    SGST: (GstAmount(i) / 2).toFixed(2),
                    IGST: (GstAmount(i) / 2).toFixed(2),
                    CGSTPercentage: (i.GST / 2),
                    SGSTPercentage: (i.GST / 2),
                    IGSTPercentage: (i.GST),
                    Amount: i.totalAmount,
                }
                itemArr.push(arr)
            };
        })

        const jsonBody = JSON.stringify({
            OrderDate: effectiveDate,
            Customer: division,
            Supplier: party,
            OrderAmount: orderAmount,
            Description: description,
            CreatedBy: 1,
            UpdatedBy: 1,
            OrderItem: itemArr
        });
        dispatch(postOrder(jsonBody))
        console.log(jsonBody)


    }


    return (
        <React.Fragment>
            <MetaTags>
                <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
            </MetaTags>
            <div className="page-content">
                {/* <Breadcrumb
                    title={"Count :"}
                    breadcrumbItem={userPageAccessState.PageHeading ? userPageAccessState.PageHeading : "Order"}
                    IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                    breadcrumbCount={`Product Count: ${"searchCount"}`}
                    // SearchProps={searchProps}
                    // IsSearchVissible={true}
                    RedirctPath={"/#"}
                    isExcelButtonVisible={true}
                    ExcelData={items}
                /> */}


                <Row><div className="col ">
                    <label className="font-size-18 form-label text-black " style={{ paddingLeft: "13px" }} >
                        {"Order"}</label>
                </div>
                    <div className=" col col-2 mt-n1 ">
                        <div className=" bg-soft-info text-center text-black  external-event  col-form-label rounded-2 align-right">
                            Order Amount : &nbsp;&nbsp; {orderAmount}&nbsp;
                        </div>
                    </div>
                </Row>
                <Row className="mb-1 border border-black text-black mt-2 " style={{ backgroundColor: "#dddddd" }} >

                    <Col md="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2">Order Date</Label>
                            <Col md="7">
                                <Flatpickr
                                    id="EffectiveDateid"
                                    name="effectiveDate"
                                    // value={effectiveDate}
                                    // isDisabled={editMode === "edit" ? true : false}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "F j, Y",
                                        dateFormat: "Y-m-d"
                                    }}
                                    onChange={EffectiveDateHandler}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="4">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2">Customer Name</Label>
                            <Col md="8">
                                <Select
                                    // Value={customerName_dropdownSelect}
                                    classNamePrefix="select2-Customer"

                                    options={supplierOptions}
                                    onChange={(e) => { setCustomerSelect(e) }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >
                    <Col md="3">

                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2 ml-n4 ">Descreption</Label>
                            <Col md="8">
                                <Input
                                    placeholder="Enter Description"
                                    onChange={e => description = e.target.value}
                                />
                            </Col>
                        </FormGroup>
                    </Col >
                    <Col md="1" className="mt-3 ">
                        <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                            onClick={GoButton_Handler}
                        >Go</Button>
                    </Col>


                </Row>


                <PaginationProvider pagination={paginationFactory(pageOptions)}>
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            defaultSorted={defaultSorted}
                            data={items}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>

                                    {/* <Breadcrumb
                                                    title={"Count :"}
                                                    breadcrumbItem={userPageAccessState.PageHeading}
                                                    IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                                    SearchProps={toolkitProps.searchProps}
                                                    breadcrumbCount={`Product Count: ${items.length}`}
                                                    IsSearchVissible={true}
                                                    RedirctPath={"masterPath"}
                                                    isExcelButtonVisible={true}
                                                    ExcelData={items}
                                                /> */}

                                    <Row>

                                        <Col xl="12">
                                            <div className="table table-unRresponsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    classes={"table  table-bordered table-hover"}
                                                    noDataIndication={
                                                        <div className="text-danger">
                                                            "Please Add One Row In Table"
                                                        </div>
                                                    }
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />

                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone {...paginationProps} />
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    )}

                </PaginationProvider>
                {(items.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                    <button
                        type="submit"
                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Order"
                        className="btn btn-primary w-md"
                        onClick={saveHandeller}
                    > <i className="fas fa-save me-2"></i> Save
                    </button>
                </div>
                    : null}
            </div>
            {/* </div> */}

        </React.Fragment>
    )
}
export default Order

