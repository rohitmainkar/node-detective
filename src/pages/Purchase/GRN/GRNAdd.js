import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";


import React, { useEffect, useState, useRf, useRef } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import {
    editOrderIdSuccess,
    goButton,
    goButtonSuccess,
    postOrder,
    postOrderSuccess,
    updateOrderId,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplier, getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { mySearchProps } from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/MySearch";
import { AlertState, BreadcrumbFilterSize } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, totalAmount } from "../Order/OrderPageCalulation";
import '../../Order/div.css'

import { GRN_lIST, ORDER_lIST } from "../../../routes/route_url";
import SaveButton, { CreatedBy } from "../../../components/Common/CommonSaveButton";

import { getTermAndCondition } from "../../../store/Administrator/TermsAndCondtionsRedux/actions";

import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { getGRN_itemMode2, getGRN_itemMode2_Success, getGRN_itemMode3, postGRN, postGRNSuccess } from "../../../store/Purchase/GRNRedux/actions";
import GRNList from "./GRNList";
import { useMemo } from "react";

let description = ''
let editVal = {}
let initialTableData = []
const GRNAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userAccState, setUserPageAccessState] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data

    const [grnDate, setgrnDate] = useState('');
    const [deliverydate, setdeliverydate] = useState("today")
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('')

    const [supplierSelect, setsupplierSelect] = useState('');
    const [orderAmount, setOrderAmount] = useState(0);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);



    useEffect(() => {
        // dispatch(getSupplier())
        dispatch(getSupplierAddress())

    }, [])

    const {
        items,
        // table,
        postMsg,
        supplier,
        userAccess,
        updateMsg,
        supplierAddress,
        pageField,

    } = useSelector((state) => ({
        supplier: state.SupplierReducer.supplier,
        supplierAddress: state.SupplierReducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        grnItemList: state.GRNReducer.grnItemList,
        table: state.GRNReducer.GRNitem3,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageFieldList,
        termsAndCondtions: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
    }));



    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    useEffect(() => {

        if ((items.Status === true) && (items.StatusCode === 200)) {
            // dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${orderAmount}`))
            const hasEditVal = items.Data
            hasEditVal.OrderItem.forEach((ele, k) => {
                ele.id = k + 1;
                ele["Name"] = ele.ItemName
                ele["inpRate"] = ele.Rate
                ele["inpQty"] = 0
                ele["totalAmount"] = ele.Amount
                ele["UOM"] = ele.Unit
                ele["UOMLabel"] = ele.UnitName
                ele["UOM"] = ele.Unit
                ele["BatchDate"] = ''
                ele["BatchCode"] = ''
                ele["delbtn"] = false

            });
            initialTableData = []
            let details = { ...hasEditVal }
            initialTableData = details.OrderItem
            setgrnItemList(initialTableData)
            details.OrderItem = []
            setGrnDetail(details)

            setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
            dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))
            setOrderAmount(hasEditVal.OrderAmount)
            items.Status = false
            dispatch(getGRN_itemMode2_Success(items))
        }

    }, [items])

    // debugger
    // const grnItemList = useMemo(() => {
    //     // debugger
    //     const { Data, Status = false } = items
    //     if (!Status) {
    //         return items
    //     }
    //     // debugger
    //     const hasEditVal = Data;
    //     hasEditVal.OrderItem.forEach(ele => {
    //         ele["Name"] = ele.ItemName
    //         ele["inpRate"] = ele.Rate
    //         ele["inpQty"] = ele.Quantity
    //         ele["totalAmount"] = ele.Amount
    //         ele["UOM"] = ele.Unit
    //         ele["UOMLabel"] = ele.UnitName
    //         ele["inpBaseUnitQty"] = ele.BaseUnitQuantity
    //     });
    //     setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
    //     dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))
    //     setOrderAmount(hasEditVal.OrderAmount)
    //     items.Status = false
    //     dispatch(getGRN_itemMode2_Success(items))
    //     return hasEditVal

    // }, items)



    useEffect(() => {
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${orderAmount}`))
        dispatch(goButtonSuccess([]))

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                const jsonBody = JSON.stringify({
                    Supplier: hasEditVal.Supplier,
                    EffectiveDate: hasEditVal.OrderDate
                }
                );
                dispatch(goButton(jsonBody, hasEditVal))
                dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${hasEditVal.OrderAmount}`))

                setsupplierSelect({ label: hasEditVal.SupplierName, value: hasEditVal.Supplier })
                // setgrnDate(hasEditVal.OrderDate)
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                description = hasEditVal.Description
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)

            }
            dispatch(editOrderIdSuccess({ Status: false }))
        }


    }, [])

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress])

    useEffect(() => {
        debugger
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postGRNSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: GRN_lIST,
            }))

        } else if (postMsg.Status === true) {
            dispatch(postGRNSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])



    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: ORDER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateOrderIdSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);


    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["inpQty"] = val;
        }
        else {
            row["inpRate"] = val
        }
        const amount = totalAmount(row)
        row["totalAmount"] = amount
        try {
            document.getElementById(`abc${row.id}`).innerText = amount
            // value = amount
        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.totalAmount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(BreadcrumbFilterSize(`${"Order Amount"} :${sum.toFixed(2)}`))
    }

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const pagesListColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "Name",
            sort: true,
            formatter: (value, row) => (
                <div className=" mt-2">
                    <span>{value}</span>
                </div>
            ),
        },
        {//------------- Quntity first column ----------------------------------
            text: "Initial-QTY",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <samp className="font-asian">{row.Quantity}</samp>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '90px', textAlign: 'center', text: "center" };
            }
        },
        {//  ------------Quntity column -----------------------------------  
            text: "GRN-QTY",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (

                <span >
                    <Input type="text"
                        id={`inpQty${k}`}
                        className="text-end "
                        defaultValue={row.inpQty}
                        disabled={((row.inpRate === 0) || row.GST === '') ? true : false}
                        onChange={(e) => {
                            val_onChange(e.target.value, row, "qty")
                        }}
                        autoComplete="off"
                        onKeyDown={(e) => handleKeyDown(e, grnItemList)} />
                </span>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center' };
            }


        },
        {//  ------------UOM column -----------------------------------
            text: "UOM",
            dataField: "UOMLabel",
            sort: true,
            formatter: (value, row) => (
                <div className="text-center mt-2">
                    <span>{value}</span>
                </div>


            ),
            headerStyle: (colum, colIndex) => {
                return { width: '150px', textAlign: 'center' };
            }

        },
        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "Rate",
            sort: true,
            formatter: (value, row, k) => {
                if (row.inpRate === undefined) { row["inpRate"] = 0 }
                if (row.totalAmount === undefined) { row["totalAmount"] = 0 }
                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            id={`inpRatey${k}`}
                            className="border-0"
                            defaultValue={row.inpRate}
                            disabled={(row.GST === '') ? true : false}
                            onChange={e => {
                                row["inpRate"] = e.target.value;
                                const qty = document.getElementById(`inpQty${k}`)
                                const val = e.target.value
                                if (val > 0) {
                                    val_onChange(val, row, "rate")
                                    qty.disabled = false
                                } else {
                                    val_onChange(0, row, "rate")
                                    qty.disabled = true
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, items)}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center' };
            }
        },
        {//------------- GST column ------------------------------------
            text: "GST %",
            dataField: "GSTPercentage",
            sort: true,
            formatter: (value, row) => (
                <div className="text-center mt-2">
                    <span>{value}</span>
                </div>


            ),
            headerStyle: (colum, colIndex) => {
                return { width: '70px', textAlign: 'center', text: "left" };
            }

        },
        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1">
                    <div className="col ">
                        {/* <Input type='text'
                            id={`abc${row.id}`}
                            className="  border-0  "
                            value={row.totalAmount} /> */}
                        <samp id={`abc${row.id}`}>{row.totalAmount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <Input type="text"
                    // id={`Batch${k}`}
                    className="text-end "
                    defaultValue={row.BatchCode}
                    onChange={e => { row["BatchCode"] = e.target.value }}
                    autoComplete="off"
                />
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Batch Code column ----------------------------------
            text: "Batch Date",
            dataField: "",
            sort: true,
            formatter: (value, row, k) => (
                <Flatpickr
                    className="form-control d-block p-2 bg-white text-dark"
                    placeholder="Select..."
                    options={{
                        altInput: true,
                        altFormat: "d-m-Y",
                        dateFormat: "Y-m-d",
                        defaultDate: "today"
                    }}
                    onChange={(e, date) => { row.BatchDate = date }}
                    onReady={(e, date) => { row.BatchDate = date }}
                />
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- Action column ----------------------------------
            text: "Action",
            dataField: "",
            formatter: (value, row, k, a, v) => (
                <div className="d-flex justify-Content-center mt-2" >
                    <div> <Button
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                        onClick={(e) => copybtnOnclick(row)}
                        className="badge badge-soft-primary font-size-12 btn btn-primary
                     waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="bx bxs-copy font-size-8 "></i>
                    </Button ></div>

                    <div >
                        {row.delbtn ? <div >
                            <Button
                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top"
                                onClick={(e) => deletebtnOnclick(row)}
                                className="badge badge-soft-danger font-size-12 btn btn-danger
                                      waves-effect waves-light w-xxs border border-light"
                            >
                                <i class="mdi mdi-delete font-size-8 "></i>
                            </Button >
                        </div>
                            : null}

                    </div>
                </div>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '30px', textAlign: 'center', text: "center" };
            }
        },
    ];

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pageOptions = {
        sizePerPage: (grnItemList.length + 2),
        totalSize: 0,
        custom: true,
    };

    const GoButton_Handler = () => {
        let supplier = supplierSelect.value

        if (!supplier > 0) {
            alert("Please Select Customer")
            return
        }

        if (items.length > 0) {
            if (window.confirm("Refresh Order Item...!")) {
                dispatch(goButtonSuccess([]))
            } else { return }
        }

        let division = 0
        try {
            division = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
        }
        const jsonBody = JSON.stringify({
            Supplier: supplier,
            EffectiveDate: grnDate
        }
        );

        dispatch(goButton(jsonBody))
        console.log("jsonBody", jsonBody)
    };
    const copybtnOnclick = (r) => {
        const id = r.id
        const newArr = []
        let list = [...initialTableData];
        debugger
        list.forEach(element => {

            if (element.id < id) {
                newArr.push(element)
            }
            else if (element.id === id) {
                newArr.push(element);
                const ele = { ...element }
                ele.id = element.id + 1
                ele.delbtn = true
                newArr.push(ele)
            }
            else {
                const ele = { ...element }
                ele.id = element.id + 1
                newArr.push(ele)
            }
        });

        
        debugger
        initialTableData = newArr
        setgrnItemList(newArr)

    }
    const deletebtnOnclick = (r) => {
        const list = [...initialTableData];
        const newArr = list.filter(i => { return (!(i.id === r.id)) })
        initialTableData = newArr
        setgrnItemList(newArr)

    }


    const saveHandeller = () => {

        const itemArr = []
        grnItemList.forEach(i => {
            if ((i.inpQty > 0)) {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                const arr = {
                    Item: i.Item,
                    Quantity: i.inpQty,
                    MRP: i.MRP,
                    ReferenceRate: i.Rate,
                    Rate: i.inpRate,
                    Unit: i.UOM,
                    BaseUnitQuantity: i.inpQty,
                    GSTPercentage: i.GSTPercentage,
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    Amount: i.totalAmount,

                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GSTPercentage / 2),
                    SGSTPercentage: (i.GSTPercentage / 2),
                    IGSTPercentage: 0,

                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,
                    DiscountType: "0",
                    Discount: "0.00",
                    DiscountAmount: "0.00",
                    TaxType: "GST",

                }
                debugger
                itemArr.push(arr)
            };
        })


        if (itemArr.length === 0) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Please Enter One Item Quantity",
                RedirectPath: false,
                AfterResponseAction: false
            }));
            return
        }

        const jsonBody = JSON.stringify({
            GRNDate: grnDate,
            Customer: grnDetail.Customer,
            GRNNumber: 1,
            GrandTotal: orderAmount,
            Party: grnDetail.Supplier,
            CreatedBy: CreatedBy(),
            UpdatedBy: 1,
            GRNItems: itemArr,
            GRNReferences: grnDetail.GRNReferences

        });
        debugger
        if (pageMode === "edit") {
            // dispatch(editGRNId(jsonBody, editVal.id))
            console.log("GRNedit", jsonBody)

        } else {

            dispatch(postGRN(jsonBody))
            console.log("postGRNsave", jsonBody)
        }


    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userAccState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content">
                    <Breadcrumb
                        pageHeading={userAccState.PageHeading}
                        showCount={true}
                    />
                    <div className="px-2 mb-1 mt-n1" style={{ backgroundColor: "#dddddd" }} >
                        <div className=" mt-1 row">

                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "130px" }}>GRN Date</Label>
                                <Col md="3">
                                    <Flatpickr
                                        name="grndate"
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setgrnDate(date) }}
                                        onReady={(e, date) => { setgrnDate(date); }}
                                    />
                                </Col>
                            </FormGroup>



                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "130px" }}>Supplier Name</Label>
                                <Col md="3">
                                    {/* <Select
                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            isDisabled={pageMode === "edit" ? true : false}
                                            options={supplierOptions}
                                            onChange={(e) => { setsupplierSelect(e) }}
                                        /> */}
                                    < Input type="text" value={grnDetail.SupplierName} disabled={true} />
                                </Col>
                            </FormGroup>

                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "130px" }}>Challan No</Label>
                                <Col md="3">
                                    <Input type="text"
                                        disabled={true}
                                        value={grnDetail.challanNo}
                                        placeholder="Enter Challan No" />
                                </Col>
                            </FormGroup>



                            {/* <Col md="1" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={GoButton_Handler}>Go</Button>
                            </Col> */}
                        </div>
                    </div>


                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={grnItemList}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-Rresponsive">
                                                    <BootstrapTable
                                                        keyField={"Item"}
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        classes={"table  table-bordered table-hover"}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
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



                    {
                        (grnItemList.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <SaveButton pageMode={pageMode} userAcc={userAccState}
                                module={"GRN"} onClick={saveHandeller}
                            />
                        </div>
                            : <div className="row save1"></div>
                    }
                </div >

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default GRNAdd

