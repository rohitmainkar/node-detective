import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
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
        Customer: '',
        Party: '',
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
            customerDropdownLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            // partyDropdownLoading: state.CommonPageFieldReducer.pageFieldList,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, supplier, pdfdata, customerDropdownLoading, partyDropdownLoading } = reducers;

    const values = { ...state.values }


    // userAccess useEffect
    useEffect(() => {
        let locationPath = history.location.pathname;
        const userAcc = userAccess.find((inx) => {
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

    const customerDropdownOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))
    const partyDropdounOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }))

    const customerOnChangehandler = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }
    const partyOnChangehandler = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Party = e;
            a.hasValid.Party.valid = true
            return a
        })
    }

    function goButtonHandler() {

        if (_cfunc.loginSelectedPartyID() === 0) {
            customAlert({ Type: 3, Message: "Please Select Party" });
            return;
        };

        const isPartyLeger = subPageMode == url.PARTY_LEDGER;
        const isSelfLeger = subPageMode == url.SELF_LEDGER;

        if ((isPartyLeger && values.Customer === "") || (isSelfLeger && values.Party === "")) {
            customAlert({
                Type: 3,
                Message: isPartyLeger ? "Please Select Customer" : "Please Select Party",
            });
            return;
        }

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Customer": isPartyLeger ? values.Customer.value : _cfunc.loginSelectedPartyID(),
            "Party": isPartyLeger ? _cfunc.loginSelectedPartyID() : values.Party.value,
        });

        let config = { ReportType: report.PartyLedger, jsonBody };
        dispatch(getpdfReportdata(PartyLedgerReport_API, config));

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
            a.values.Customer =''
            a.values.Party = ''
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

                        {subPageMode === url.PARTY_LEDGER ? (
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "80px" }}>Customer</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="Customer"
                                            value={values.Customer}
                                            isSearchable={true}
                                            isLoading={customerDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={customerDropdownOptions}
                                            onChange={customerOnChangehandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        ) : (
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "80px" }}>Party</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="Party"
                                            value={values.Party}
                                            isSearchable={true}
                                            isLoading={partyDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={partyDropdounOptions}
                                            onChange={partyOnChangehandler}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        )}



                        <Col sm="1" className="mt-3 ">
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={goButtonHandler}
                                loading={reducers.goBtnLoading} >
                                Print</C_Button>
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PartyLedger;