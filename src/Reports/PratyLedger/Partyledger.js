import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { PartyLedgerReport_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";

const PartyLedger = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            pdfdata: state.PdfReportReducers.pdfdata,
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            CustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, supplier, pdfdata, CustomerLoading } = reducers;

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
        dispatch(GetVenderSupplierCustomer({ subPageMode, "PartyID": _cfunc.loginSelectedPartyID() }))
    }, [])

    useEffect(() => {
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            dispatch(getpdfReportdataSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])

    const CustomerOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))

    const onselecthandel = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Customer": values.Customer.value,
            "Party": _cfunc.loginSelectedPartyID()
        });

        let config = { ReportType: report.PartyLedger, jsonBody }

        if (values.Customer === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Customer",
            })
            return
        } else {
            dispatch(getpdfReportdata(PartyLedgerReport_API, config))
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

    function partySelectButtonHandler() {
        dispatch(GetVenderSupplierCustomer({ subPageMode, "PartyID": _cfunc.loginSelectedPartyID() }));
    }

    function partyOnChngeButtonHandler() {
        dispatch(getpdfReportdataSuccess({ Status: false }));
        dispatch(GetVenderSupplierCustomerSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.Customer = { value: "", label: "All" }
            a.hasValid.Customer.valid = true;
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} />

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


                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "80px" }}>Customer</Label>
                                <Col sm="7">
                                    <C_Select
                                        name="Customer"
                                        value={values.Customer}
                                        isSearchable={true}
                                        isLoading={CustomerLoading}
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


                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} loading={reducers.goBtnLoading} />
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PartyLedger;