import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import Flatpickr from "react-flatpickr";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import { getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount } from "../../Purchase/Order/OrderPageCalulation";
import { SaveButton } from "../../../components/Common/CommonButton";
import { editGRNIdSuccess, makeGRN_Mode_1ActionSuccess, saveGRNAction, saveGRNSuccess } from "../../../store/Inventory/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { breadcrumbReturnFunc, loginUserID, currentDate, btnIsDissablefunc, convertDatefunc } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import * as pageId from "../../../routes/allPageID"



const GRNAdd3 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const subPageMode = history.location.pathname;

    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userAccState, setUserAccState] = useState("");

    const [grnDate, setgrnDate] = useState(currentDate);
    const [orderAmount, setOrderAmount] = useState(0);
    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    const [openPOdata, setopenPOdata] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [EditData, setEditData] = useState({});

    const {
        items,
        postMsg,
        userAccess,
    } = useSelector((state) => ({
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        let page_Id = pageId.GRN_ADD_3;
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getSupplierAddress())
    }, [])

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) { locationPath = props.masterPath; };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if ((items.Status === true)) {
            const grnDetails = { ...items.Data }
            let arr = []
            let initial = ''
            let tAmount = 0
            let tQty = 0
            let id = 1
            grnDetails.OrderItem.forEach((i, k) => {
                i.BatchDate_conv=convertDatefunc(i.BatchDate)
                if (k === 0) {
                    i.id = id
                    arr.push(i)
                    initial = i.Item
                    tAmount = Number(i.Amount)
                    tQty = Number(i.Quantity)
                }
                else if ((initial === i.Item) && (k === grnDetails.OrderItem.length - 1)) {
                    ++id;
                    i.id = id
                    tAmount = tAmount + Number(i.Amount)
                    tQty = tQty + Number(i.Quantity)
                    initial = i.Item
                    arr.push(i)
                    arr.push({ id, ItemName: "Total", Amount: tAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                }
                else if ((k === grnDetails.OrderItem.length - 1)) {
                    ++id;
                    arr.push({ id, ItemName: "Total", Amount: tAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                    ++id;
                    i.id = id
                    tAmount =  Number(i.Amount)
                    tQty =  Number(i.Quantity)
                    arr.push(i)
                    arr.push({ id, ItemName: "Total", Amount: tAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                }
                else if (initial === i.Item) {
                    // i.ItemName=''
                    ++id;
                    i.id = id
                    arr.push(i)
                    tAmount = tAmount + Number(i.Amount)
                    tQty = tQty + Number(i.Quantity)
                    initial = i.Item
                } else {
                    ++id;
                    arr.push({ id, ItemName: "Total", Amount: tAmount.toFixed(3), Quantity: tQty.toFixed(3) })
                    ++id;
                    arr.push(i)
                    tAmount = Number(i.Amount)
                    tQty = Number(i.Quantity)
                    initial = i.Item
                }

            })
            grnDetails.OrderItem = arr
            setgrnItemList(grnDetails.OrderItem)

            setInvoiceNo(grnDetails.InvoiceNumber)
            setGrnDetail(grnDetails)
            const myArr = grnDetails.challanNo.split(",");
            myArr.map(i => ({ Name: i, hascheck: false }))
            setopenPOdata(grnDetails.GRNReferences)

            dispatch(makeGRN_Mode_1ActionSuccess({ Status: false }))

            dispatch(BreadcrumbShowCountlabel(`${"GRN Amount"} :${grnDetails.OrderAmount}`))
        }

    }, [items])

    useEffect(() => {
        if ((hasShowloction || hasShowModal)) {
            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {

                setEditData(hasEditVal);

                const { GRNItems = [], GRNReferences = [], InvoiceNumber } = hasEditVal;

                let ChallanNo1 = ''

                GRNReferences.forEach(ele => {
                    ChallanNo1 = ChallanNo1.concat(`${ele.ChallanNo},`)
                });
                ChallanNo1 = ChallanNo1.replace(/,*$/, '');

                setInvoiceNo(InvoiceNumber)
                setGrnDetail(ChallanNo1);
                setgrnItemList(GRNItems)
                dispatch(editGRNIdSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveGRNSuccess({ Status: false }))
            const promise = await CustomAlert({
                Type: 1,
                Message: postMsg.Message,
            })
            if (promise) {
                history.push({ pathname: url.GRN_LIST_3 })
            }

        } else if (postMsg.Status === true) {
            dispatch(saveGRNSuccess({ Status: false }))
            CustomAlert({
                Type: 1,
                Message: JSON.stringify(postMsg.Message),
            })

        }
    }, [postMsg])


    const tableColumns = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
        },

        {//------------- Quntity  column ----------------------------------
            text: "Invoice-Qty",
            dataField: "Quantity",
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "UnitName",
        },

        {  //-------------MRP column ----------------------------------
            text: "MRP",
            dataField: "MRP",
        },
        {  //-------------Rate column ----------------------------------
            text: "Rate",
            dataField: "Rate",
        },

        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "Amount",
        },

        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "BatchCode",
        },

        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "BatchDate_conv",
        },

    ];

    const rowStyle2 = (row, rowIndex) => {
        const style = {};
        if (row.ItemName === "Total") {
            style.backgroundColor = '#E6ECF4';
            style.fontWeight = 'bold';
            style.hover = 'red';
        }
        return style;
    };
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


    const saveHandeller = (event) => {
        event.preventDefault();

        const btnId = event.target.id
        btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const itemArr = []

            grnItemList.forEach(i => {
                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                if (i.ItemName === "Total") { return }
                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,
                    MRP: i.MRP,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    GST: i.GST,
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    Amount: i.Amount,

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

                if ((i.Quantity > 0)) {
                    itemArr.push(arr)
                }

            })

            if (invoiceNo.length === 0) {
                CustomAlert({
                    Type: 3,
                    Message: "Please Enter Invoice Number",
                })
                return returnFunc()
            }

            const jsonBody = JSON.stringify({
                GRNDate: grnDate,
                Customer: grnDetail.Customer,
                GRNNumber: 1,
                GrandTotal: orderAmount,
                Party: grnDetail.Supplier,
                InvoiceNumber: invoiceNo,
                CreatedBy: loginUserID(),
                UpdatedBy: 1,
                GRNItems: itemArr,
                GRNReferences: openPOdata

            });

            if (pageMode === mode.edit) {
                returnFunc()
            } else {
                dispatch(saveGRNAction({ jsonBody, btnId }))
            }
        } catch (error) { returnFunc() }
    }

    if (!(userAccState === "")) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" >

                    <div className="px-2 mb-1  c_card_header " >
                        <Row>
                            <Col sm={5}>

                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            disabled={(pageMode === mode.view) ? true : false}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text"
                                            value={pageMode === mode.view ? EditData.CustomerName : grnDetail.SupplierName}
                                            disabled={pageMode === mode.view ? true : false} />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={true}
                                            value={pageMode === mode.view ? grnDetail : grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice Date</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            disabled={true}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Invoice No</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={true}
                                            value={invoiceNo}
                                            placeholder="Enter Invoice No"
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Close PO</Label>
                                    <Col md="7" >

                                        <Input
                                            type="checkbox"
                                            style={{ paddingTop: "7px" }}
                                            placeholder="Enter Invoice No"
                                            disabled={pageMode === mode.view ? true : false}
                                            onChange={(e) => openPOdata[0].Inward = e.target.checked}
                                        />

                                    </Col>
                                </FormGroup>



                            </Col>
                        </Row>
                    </div>

                    <PaginationProvider pagination={paginationFactory(pageOptions)}>
                        {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                                keyField="id"
                                defaultSorted={defaultSorted}
                                data={grnItemList}
                                columns={tableColumns}
                                search
                            >
                                {(toolkitProps,) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table table-Rresponsive">
                                                    <BootstrapTable
                                                        responsive
                                                        bordered={false}
                                                        striped={false}
                                                        rowStyle={rowStyle2}
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
                        (grnItemList.length > 0) ?
                            <div className="row save1" style={{ paddingBottom: 'center', marginTop: "-30px" }}>
                                <SaveButton pageMode={pageMode}
                                    editCreatedBy={editCreatedBy}
                                    userAcc={userAccState}
                                    module={"GRN"} onClick={saveHandeller}
                                />
                            </div>
                            :
                            <div className="row save1"></div>
                    }
                </div >

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default GRNAdd3
