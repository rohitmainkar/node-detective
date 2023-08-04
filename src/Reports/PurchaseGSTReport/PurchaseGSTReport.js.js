import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { GetVenderSupplierCustomer } from "../../store/actions";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import * as XLSX from 'xlsx';
import { postPurchaseGSTReport_API, postPurchaseGSTReport_API_Success } from "../../store/Report/PurchaseGSTRedux/action";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";


const PurchaseGSTReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();


    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        CheckSelect: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');
    const [GSTRateWise, setGSTRateWise] = useState(false);



    const reducers = useSelector(
        (state) => ({
            tableData: state.PurchaseGSTReportReducer.PurchaseGSTGobtn,
            ExcelBtnLoading: state.PurchaseGSTReportReducer.ExcelBtnLoading,
            GoBtnLoading: state.PurchaseGSTReportReducer.GoBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, tableData, ExcelBtnLoading, GoBtnLoading } = reducers;
    const { PurchaseGSTDetails = [], PurchaseGSTRateWiseDetails = [] } = tableData;
    debugger
    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))

    }, [])


    function goButtonHandler() {
        const btnId = `gobtn-${url.PURCHASE_GST_REPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
            "GSTRatewise": GSTRateWise === true ? 1 : 0
        });
        let config = { jsonBody, btnId }
        dispatch(postPurchaseGSTReport_API(config))
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }


    useEffect(() => {
        if (tableData.btnId === "excel_btnId") {
            if (GSTRateWise ? PurchaseGSTRateWiseDetails.length : PurchaseGSTDetails.length > 1) {
                const worksheet = XLSX.utils.json_to_sheet(GSTRateWise ? PurchaseGSTRateWiseDetails : PurchaseGSTDetails);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseGSTReport");
                XLSX.writeFile(workbook, `Purchase GST Report From ${_cfunc.date_dmy_func(values.FromDate)} To ${_cfunc.date_dmy_func(values.ToDate)}.xlsx`);
                dispatch(postPurchaseGSTReport_API_Success([]));
            }
        }
    }, [tableData]);

    function excelhandler() {
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
            "GSTRatewise": GSTRateWise === true ? 1 : 0
        });
        let config = { jsonBody, btnId: "excel_btnId" }
        dispatch(postPurchaseGSTReport_API(config))

    }

    const WithoutGSTRateWiseColumn = [
        {
            text: "Name",
            dataField: "Name",


        },

        {
            text: "Invoice Number",
            dataField: "InvoiceNumber",
            align: 'right'


        },
        {
            text: "Full Invoice Number",
            dataField: "FullInvoiceNumber",
            align: 'right'



        },
        {
            text: "Invoice Date",
            dataField: "InvoiceDate",

        },
        {
            text: "GST Rate",
            dataField: "GSTRate",
            align: 'right'



        },

        {
            text: "GST Percentage",
            dataField: "GSTPercentage",
            align: 'right'

        },
        {
            text: "CGST",
            dataField: "CGST",
            align: 'right'

        },
        {
            text: "SGST",
            dataField: "SGST",
            align: 'right'

        },
        {
            text: "IGST",
            dataField: "IGST",
            align: 'right'

        },
        {
            text: "GST Amount",
            dataField: "GSTAmount",
            align: 'right'

        },
        {
            text: "Discount Amount",
            dataField: "DiscountAmount",
            align: 'right'



        },
        {
            text: "Taxable Value",
            dataField: "TaxableValue",
            align: 'right'


        },

        {
            text: "Total Value",
            dataField: "TotalValue",
            align: 'right'

        },


    ];

    const GSTRateWiseColumn = [

        {
            text: "GST Percentage",
            dataField: "GSTPercentage",
            align: 'right'

        },
        {
            text: "CGST",
            dataField: "CGST",
            align: 'right'

        },
        {
            text: "SGST",
            dataField: "SGST",
            align: 'right'

        },
        {
            text: "IGST",
            dataField: "IGST",
            align: 'right'

        },
        {
            text: "GST Amount",
            dataField: "GSTAmount",
            align: 'right'

        },
        {
            text: "Taxable Value",
            dataField: "TaxableValue",
            align: 'right'

        },
        {
            text: "Total Value",
            dataField: "TotalValue",
            align: 'right'

        },


    ];

    const rowStyle = (row, rowIndex) => {

        if ((PurchaseGSTRateWiseDetails.length - 1) === rowIndex) {
            const style = {};
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
            return style;
        }
        if ((PurchaseGSTDetails.length - 1) === rowIndex) {
            const style = {};
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
            return style;
        }

    };


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} >
                            <FormGroup className="mb- row mt-3 mb-2">
                                <Label style={{ width: "170px" }} className="col-4 p-2" >GST Rate Wise Report</Label>
                                <Col sm="4" className=" mt-2 ">
                                    <Input type="checkbox"
                                        className="p-2"
                                        checked={GSTRateWise}
                                        onChange={(e) => setGSTRateWise(e.target.checked)}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={1} className="mt-3 ">
                            <Go_Button
                                onClick={goButtonHandler}
                                loading={GoBtnLoading === `gobtn-${url.PURCHASE_GST_REPORT}`} />
                        </Col>
                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={ExcelBtnLoading === `excel_btnId`}
                                className="btn btn-primary w-md  "
                                onClick={(e) => { excelhandler() }}
                            >
                                Excel Downlode
                            </C_Button>
                        </Col>

                    </div>
                </div>
                <ToolkitProvider
                    keyField={"id"}
                    data={GSTRateWise ? PurchaseGSTRateWiseDetails : PurchaseGSTDetails}
                    columns={GSTRateWise ? GSTRateWiseColumn : WithoutGSTRateWiseColumn}
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            rowStyle={rowStyle}
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                </Col>
                            </Row>

                        </React.Fragment>
                    )}
                </ToolkitProvider>
            </div>

        </React.Fragment >
    )
}

export default PurchaseGSTReport;