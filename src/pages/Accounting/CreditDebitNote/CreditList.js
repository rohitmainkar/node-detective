import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { useHistory } from "react-router-dom";
import { currentDate, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import * as report from '../../../Reports/ReportIndex'
import { editBOMList, updateBOMListSuccess } from "../../../store/Production/BOMRedux/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteReceiptList, deleteReceiptList_Success,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Receipt_Print } from "../../../helpers/backend_helper";
import Credit from "./Credit";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import { Go_Button } from "../../../components/Common/CommonButton";
import { CredietDebitType, Edit_CreditList_ID, GetCreditList, deleteCreditlistSuccess, delete_CreditList_ID } from "../../../store/Accounting/CreditRedux/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";

const CreditList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        FromDate: currentDate,
        ToDate: currentDate,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.CredietDebitReducer.CreditList,
            deleteMsg: state.CredietDebitReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            editData: state.CredietDebitReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, RetailerList, CreditDebitType } = reducers;
    const values = { ...state.values }

    const action = {
        getList: GetCreditList,
        editId: Edit_CreditList_ID,
        deleteId: delete_CreditList_ID,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteCreditlistSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.CREDIT_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"Credit Count"} :0`))
    }, []);

    useEffect(() => {
        const page_Id = pageId.CREDIT_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])


    //   Note Type Api for Type identify
    useEffect(() => {

        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, []);

    // Retailer DropDown List Type 1 for credit list drop down
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);


    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    useEffect(() => {
        if (CreditDebitType.length > 0) {
            goButtonHandler(true)
        }
    }, [CreditDebitType]);

    function goButtonHandler() {

        const CreditDebitTypeId = CreditDebitType.find((index) => {
            return index.Name === "Credit"
        })

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: loginPartyID(),
            NoteType: CreditDebitTypeId.id
        });
        dispatch(GetCreditList(jsonBody, hasPagePath));
    }


    function downBtnFunc(row) {
        var ReportType = report.Receipt;
        dispatch(getpdfReportdata(Receipt_Print, ReportType, row.id))
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

    function CustomerOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })

    }

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>FromDate</Label>
                            <Col sm="7">
                                <Flatpickr
                                    name='FromDate'
                                    value={values.FromDate}
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
                                style={{ width: "65px" }}>ToDate</Label>
                            <Col sm="7">
                                <Flatpickr
                                    name="ToDate"
                                    value={values.ToDate}
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
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    options={customerOptions}
                                    onChange={CustomerOnChange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={Credit}
                            masterPath={url.CREDIT}
                            newBtnPath={url.CREDIT}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={"Credit"}
                            deleteName={"Credit"}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default CreditList;