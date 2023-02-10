import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    updateOrderIdSuccess,
} from "../../../store/Purchase/OrderPageRedux/actions";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { GetCustomer} from "../../../store/CommonAPI/SupplierRedux/actions";
import { currentDate, excelDownCommonFunc, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { Invoice_Edit_API_Singel_Get } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { MetaTags } from "react-meta-tags";
import Invoice from "./Invoice";
import { deleteInvoiceId, deleteInvoiceIdSuccess, editInvoiceList, getIssueListPage } from "../../../store/Sales/Invoice/action";

const InvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(url.ORDER_lIST)
    const [userAccState, setUserAccState] = useState('');

    // const [fromdate, setfromdate] = useState(currentDate);
    // const [todate, settodate] = useState(currentDate);
    // const [customerSelect, setcustomerSelect] = useState({ value: '', label: "All" });
    const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate, fromdate: currentDate, customerSelect: { value: '', label: "All" } });

    const reducers = useSelector(
        (state) => ({
            customer: state.SupplierReducer.customer,
            tableList: state.InvoiceReducer.Invoicelist,
            GRNitem: state.GRNReducer.GRNitem,
            deleteMsg: state.InvoiceReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.InvoiceReducer.editData,
            orderlistFilter: state.OrderReducer.orderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, customer, tableList, } = reducers;
    const { fromdate, todate, customerSelect } = orderlistFilter;

    const page_Id = pageId.INVOICE_LIST

    const action = {
        getList: getIssueListPage,
        deleteId: deleteInvoiceId,
        postSucc: postMessage,
        editId: editInvoiceList,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteInvoiceIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        // const page_Id = (hasPagePath === url.GRN_STP) ? pageId.GRN_STP : pageId.ORDER_lIST;
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Invoice Count"} :0`))
        dispatch(GetCustomer())
        goButtonHandler(true)

    }, []);

    const customerOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])

    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])

    function downBtnFunc(row) {
        var ReportType = report.invoice;
        dispatch(getpdfReportdata(Invoice_Edit_API_Singel_Get, ReportType, row.id))
    }

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Customer: customerSelect.value === "" ? '' : customerSelect.value,
            Party: userParty(),
        });

        dispatch(getIssueListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.fromdate = date
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.todate = date
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    function customerOnchange(e) {
        let newObj = { ...orderlistFilter }
        newObj.customerSelect = e
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {/* <BreadcrumbNew userAccess={userAccess} pageId={page_Id} /> */}

            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name='fromdate'
                                        value={fromdate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "65px" }}>To Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name="todate"
                                        value={todate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="5">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"

                                    style={{ width: "115px" }}>Customer</Label>
                                <Col sm="5">

                                    <Select
                                        classNamePrefix="select2-Customer"
                                        value={customerSelect}
                                        options={customerOptions}
                                        onChange={customerOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>

                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={Invoice}
                            masterPath={url.INVOICE}
                            ButtonMsgLable={"Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            pageMode={pageMode}
                            makeBtnShow={pageMode === url.INVOICE_LIST ? false : true}
                            // makeBtnFunc={makeBtnFunc}
                            makeBtnName={"Make GRN"}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            // editBodyfunc={editBodyfunc}
                            filters={orderlistFilter}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default InvoiceList;