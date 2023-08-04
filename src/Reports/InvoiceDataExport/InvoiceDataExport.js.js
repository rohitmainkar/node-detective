import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import * as XLSX from 'xlsx';
import { GetVenderSupplierCustomer } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { postInvoiceDataExport_API, postInvoiceDataExport_API_Success } from "../../store/Report/InvoiceDataExportRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";

const InvoiceDataExport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();



    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,

    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [columns] = useState([{}]);
    const [columnsCreated, setColumnsCreated] = useState(false)
    const reducers = useSelector(
        (state) => ({
            pdfdata: state.PdfReportReducers.pdfdata,
            tableData: state.InvoiceDataExportReducer.InvoiceDataExportGobtn,
            GoBtnLoading: state.InvoiceDataExportReducer.GoBtnLoading,
            ExcelBtnLoading: state.InvoiceDataExportReducer.ExcelBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, tableData = [], ExcelBtnLoading, GoBtnLoading } = reducers;
    const { InvoiceExportSerializerDetails = [] } = tableData;

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
    useEffect(() => { return () => { dispatch(postInvoiceDataExport_API_Success([])); } }, [])
    useEffect(() => {
        debugger
        if (tableData.btnId === "excel_btnId") {
            if (InvoiceExportSerializerDetails.length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(InvoiceExportSerializerDetails);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, `InvoiceDataExportReport`);
                XLSX.writeFile(workbook, `Invoice Data Export Report From ${_cfunc.date_dmy_func(values.FromDate)} To ${_cfunc.date_dmy_func(values.ToDate)}.xlsx`);
            }
        }
    }, [tableData]);


    function excelhandler() {
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
        });
        let config = { jsonBody, btnId: "excel_btnId" }
        dispatch(postInvoiceDataExport_API(config))
    }

    function goButtonHandler() {
        const btnId = `gobtn-${url.INVOICE_DATA_EXPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": _cfunc.loginPartyID(),
        });
        let config = { jsonBody, btnId }
        dispatch(postInvoiceDataExport_API(config))
    }
    const createColumns = () => {

        if (InvoiceExportSerializerDetails.length > 0) {
            const objectAtIndex0 = InvoiceExportSerializerDetails[0];
            for (const key in objectAtIndex0) {
                const column = {
                    text: key,
                    dataField: key,
                    sort: true,
                    classes: "table-cursor-pointer",
                };
                columns.push(column);
            }
            setColumnsCreated(true)
        }
    }

    if (!columnsCreated) {
        createColumns();
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

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={4} className="">
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
                        <Col sm={4} className="">
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
                        <Col sm={2} className="mt-3 ">
                            <Go_Button
                                onClick={goButtonHandler}
                                loading={GoBtnLoading === `gobtn-${url.INVOICE_DATA_EXPORT}`} />
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
                <div className="mt-1">
                    <ToolkitProvider
                        keyField="PartyID"
                        data={InvoiceExportSerializerDetails}
                        columns={columns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="PartyID"
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

            </div>
        </React.Fragment >
    )
}

export default InvoiceDataExport;