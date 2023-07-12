import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { GetVenderSupplierCustomer, Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import SalesReturn from "./SalesReturn";
import { delete_SalesReturn_Id, delete_SalesReturn_Id_Succcess, salesReturnListAPI, salesReturnListAPISuccess } from "../../../store/Sales/SalesReturnRedux/action";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"

const SalesReturnList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultList)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({ masterPath: '', newBtnPath: '', buttonMsgLable: '' });
    let customerdropdownLabel = subPageMode === url.SALES_RETURN_LIST ? "Customer" : "Supplier"

    const reducers = useSelector(
        (state) => ({
            loading: state.SalesReturnReducer.loading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            listBtnLoading: state.SalesReturnReducer.listBtnLoading,
            tableList: state.SalesReturnReducer.salesReturnList,
            deleteMsg: state.SalesReturnReducer.deleteMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, RetailerList, supplier } = reducers;
    const values = { ...state.values }

    const action = {
        getList: salesReturnListAPI,
        deleteId: delete_SalesReturn_Id,
        postSucc: postMessage,
        deleteSucc: delete_SalesReturn_Id_Succcess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = false;
        let buttonMsgLable = '';

        if (subPageMode === url.PURCHASE_RETURN_LIST) {
            page_Id = pageId.PURCHASE_RETURN_LIST
            masterPath = url.PURCHASE_RETURN
            newBtnPath = url.PURCHASE_RETURN
            buttonMsgLable = "Purchase Return"
        }
        else if (subPageMode === url.SALES_RETURN_LIST) {
            page_Id = pageId.SALES_RETURN_LIST;
            masterPath = url.SALES_RETURN
            newBtnPath = url.SALES_RETURN
            buttonMsgLable = "Sales Return"
        }
        setPageMode(page_Mode)
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, newBtnPath, buttonMsgLable })
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${otherState.buttonMsgLable}Count :0`))
        goButtonHandler(true)
    }, []);

    useEffect(() => {
        dispatch(salesReturnListAPISuccess([]))
    }, [])

    // useEffect(() => {
    //     let countlabel = subPageMode === url.PURCHASE_RETURN_LIST ? "Purchase Return Count" : "Sales Return Count"
    //     dispatch(BreadcrumbShowCountlabel(`${countlabel} :0`))
    // }, [subPageMode])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
    }, []);


    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            // CustomerID: values.Customer.value,
            // PartyID: _cfunc.loginPartyID(),
            CustomerID: (subPageMode === url.SALES_RETURN_LIST) ? values.Customer.value : _cfunc.loginPartyID(),
            PartyID: (subPageMode === url.SALES_RETURN_LIST) ? _cfunc.loginPartyID() : values.Customer.value,
        });
        dispatch(salesReturnListAPI(jsonBody));
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
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
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
                                <C_DatePicker
                                    name="ToDate"
                                    value={values.ToDate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"

                                style={{ width: "115px" }}>{customerdropdownLabel}</Label>
                            <Col sm="5">
                                <Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    options={subPageMode === url.SALES_RETURN_LIST ? customerOptions : supplierOptions}
                                    onChange={CustomerOnChange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button loading={reducers.loading} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div >
        )
    }

    return (
        <React.Fragment>
            <div className="page-content">
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={SalesReturn}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            ButtonMsgLable={otherState.buttonMsgLable}
                            deleteName={"FullReturnNumber"}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default SalesReturnList;