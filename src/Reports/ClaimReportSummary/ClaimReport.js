import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, onChangeSelect } from "../../components/Common/validationFunction";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { postOrderSummary_API, postOrderSummary_API_Success } from "../../store/Report/OrderSummaryRedux/action";
import * as XLSX from 'xlsx';
import { GetVenderSupplierCustomer, SSDD_List_under_Company, getpdfReportdata } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ClaimSummary_API, MasterClaimSummary_API, PartyLedgerReport_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import { postClaimMasterCreate_API, postMasterClaimCreat_API_Success } from "../../store/Report/ClaimSummary/action";
import { formatDate } from "@fullcalendar/react";

const ClaimSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();


    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        PartyName: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [groupByParty, setGroupByParty] = useState(false);


    const reducers = useSelector(
        (state) => ({
            ClaimSummaryGobtn: state.ClaimSummaryReducer.ClaimSummaryGobtn,
            pdfdata: state.PdfReportReducers.pdfdata,
            ReportBtnLoading: state.PdfReportReducers.ReportBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, orderSummaryGobtn, SSDD_List, supplier, pdfdata, ClaimSummaryGobtn } = reducers;

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

    useEffect(() => {
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])


    useEffect(() => {
        if ((ClaimSummaryGobtn.Status === true) && (ClaimSummaryGobtn.StatusCode === 200)) {
            dispatch(postMasterClaimCreat_API_Success([]))
            customAlert({
                Type: 1,
                Message: ClaimSummaryGobtn.Message,
            })
            return
        }
    }, [ClaimSummaryGobtn])


    const CustomerOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))


    const onselecthandel = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.PartyName = e;
            a.hasValid.PartyName.valid = true
            return a
        })
    }


    function goButtonHandler(type) {

        let config = {}
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Party": values.PartyName.value,
            "Mode": type === 1 ? 1 : 2
        });


        if (type === 1) {
            const btnId = `gobtn-${report.ClaimSummary}`
            config = { ReportType: report.ClaimSummary, jsonBody, btnId: btnId }
        }
        if (type === 2) {
            const btnId = `gobtn-${report.CustomerWiseReturn}`
            config = { ReportType: report.CustomerWiseReturn, jsonBody, btnId: btnId }
        }
        if (type === 3) {
            const btnId = `gobtn-${report.CompanyWiseBudget}`
            config = { ReportType: report.CompanyWiseBudget, jsonBody, btnId: btnId, ToDate: values.ToDate, FromDate: values.FromDate }
        }

        if (values.PartyName === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Customer",
            })
            return
        } else {
            if (type === 3) {
                dispatch(getpdfReportdata(MasterClaimSummary_API, config))
            }
            if (type === 4) {
                dispatch(postClaimMasterCreate_API(jsonBody))
            }

            if ((type === 2) || (type === 1)) {
                dispatch(getpdfReportdata(ClaimSummary_API, config))

            }
        }
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
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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


                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "80px" }}>Customer</Label>
                                <Col sm="7">
                                    <Select
                                        name="DistrictName"
                                        value={values.PartyName}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={CustomerOptions}
                                        onChange={(e) => { onselecthandel(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={2}
                            className="mt-3  mb-3">
                            {/* <C_Button onClick={goButtonHandler} loading={reducers.goBtnLoading} /> */}
                            <C_Button
                                loading={reducers.ReportBtnLoading}
                                type="button"
                                spinnerColor="white"
                                className="btn btn-primary w-md  "
                                onClick={(e) => { goButtonHandler(4) }}
                                btnID={`gobtn-${report.CustomerWiseReturn}`}
                            >
                                Create Claim
                            </C_Button>
                        </Col>

                    </div>
                </div>

                <div className="px-2 mt-2 mb-2  c_card_filter text-black"  >
                    <div className=" d-flex justify-content-start  gap-2" >

                        <div
                            className="mt-3  mb-3">
                            {/* <C_Button onClick={goButtonHandler} loading={reducers.goBtnLoading} /> */}
                            <C_Button
                                loading={reducers.ReportBtnLoading}
                                type="button"
                                spinnerColor="white"
                                className="btn btn-primary w-md  "
                                onClick={(e) => { goButtonHandler(1) }}
                                btnID={`gobtn-${report.CustomerWiseReturn}`}

                            >
                                Claim Summary
                            </C_Button>
                        </div>


                        <div
                            className="mt-3 mb-3 ">
                            <C_Button
                                loading={reducers.ReportBtnLoading}
                                type="button"
                                spinnerColor="white"
                                className="btn btn-primary w-md  "
                                btnID={`gobtn-${report.ClaimSummary}`}
                                onClick={(e) => { goButtonHandler(2) }}
                            >
                                Customer wise return
                            </C_Button>
                        </div>


                        <div
                            className="mt-3  mb-3">
                            <C_Button
                                loading={reducers.ReportBtnLoading}
                                type="button"
                                spinnerColor="white"
                                className="btn btn-primary w-md  "
                                btnID={`gobtn-${report.CompanyWiseBudget}`}
                                onClick={(e) => { goButtonHandler(3) }}
                            >
                                Master Claim
                            </C_Button>
                        </div>



                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default ClaimSummary;