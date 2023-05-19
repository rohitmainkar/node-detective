import React, { useEffect, useState, } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { CInput, C_DatePicker } from "../../../CustomValidateForm/index";
import { decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm/RegexPattern"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { handleKeyDown } from "../../Purchase/Order/OrderPageCalulation";
import { salesReturnCalculate } from "../../Sale/Invoice/SalesReturn/SalesCalculation";
import * as _cfunc from "../../../components/Common/CommonFunction"
import * as _act from "../../../store/actions";
import { mode, url, pageId } from "../../../routes/index"
import { pageFieldUseEffect, saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { useLayoutEffect } from "react";

const Credit = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const fileds = {
        CRDRNoteDate: _cfunc.currentDate_ymd,
        Customer: "",
        NoteReason: "",
        servicesItem: "",
        Narration: "",
        GrandTotal: 0,
        InvoiceNO: "",
        calculate: ""

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds));
    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(198);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [calculation, Setcalculation] = useState([]);
    const [Table, setTable] = useState([]);
    const [Table1, setTable1] = useState([]);
    const [TotalSum, setTotalSum] = useState(0);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        ReceiptGoButton,
        updateMsg,
        RetailerList,
        InvoiceNo,
        CreditDebitType,
        ReceiptModeList,
        InvoiceReturn,
        userAccess } = useSelector((state) => ({
            postMsg: state.CredietDebitReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            InvoiceReturn: state.CredietDebitReducer.InvoiceReturn,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            InvoiceNo: state.SalesReturnReducer.InvoiceNo,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useLayoutEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.ReceiptGoButtonMaster_Success([]))
        dispatch(_act.Invoice_Return_ID_Success([]))
        dispatch(_act.InvoiceNumberSuccess([]))
        dispatch(_act.commonPageField(pageId.CREDIT))

    }, []);


    const { fieldLabel, values, isError } = state;
    let { Data = [] } = ReceiptGoButton;
    const { InvoiceItems = [] } = InvoiceReturn;

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue);
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => userAccessUseEffect({ // userAccess useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);


    useEffect(() => {// This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.

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

                const { CRDRNoteDate, Customer, NoteReason, servicesItem, Narration, GrandTotal, CRDRInvoices, CustomerID, CRDRNoteItems, FullNoteNumber } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.CRDRNoteDate = CRDRNoteDate;
                values.Customer = { label: Customer, value: CustomerID };
                values.NoteReason = { label: NoteReason, value: "" };
                values.InvoiceNO = { label: FullNoteNumber, value: "" };

                values.servicesItem = servicesItem;
                values.Narration = Narration;
                values.GrandTotal = GrandTotal;

                setTable(CRDRInvoices)
                setTable1(CRDRNoteItems)

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(_act.Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(_act.EditCreditlistSuccess({ Status: false }))
        }
    }, []);

    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: _act.saveCredit_Success,
       
        listPath: url.CREDIT_LIST
    }), [postMsg])


    useEffect(() => pageFieldUseEffect({ state, setState, pageField }), [pageField]);
    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [InvoiceItems, Data]);

    useEffect(() => {// Retailer DropDown List Type 1 for credit list drop down
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(_act.Retailer_List(jsonBody));
    }, []);


    useEffect(() => {// Note Reason Type id 6 Required
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 6
        });
        dispatch(_act.postSelect_Field_for_dropdown(jsonBody));
    }, []);


    useEffect(() => { //   Note Type Api for Type identify
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 5
        });
        dispatch(_act.CredietDebitType(jsonBody));
    }, [])



    const PartyOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    const CreditDebitTypeId = CreditDebitType.find((index) => {
        return index.Name === "CreditNote"
    });

    const GoodsCreditType = CreditDebitType.find((index) => {
        return index.Name === "Goods CreditNote"

    })

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.DebitDate = date;
            a.hasValid.DebitDate.valid = true
            return a
        })
    };

    function InvoiceNoOnChange(e) {
        let id = e.value
        dispatch(_act.Invoice_Return_ID(id));
    };

    function CustomerOnChange(e) { // Customer dropdown function

        setState((i) => {
            i.values.GrandTotal = 0
            i.hasValid.GrandTotal.valid = true;
            return i
        })

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });
        const body = { jsonBody, pageMode }
        dispatch(_act.ReceiptGoButtonMaster(body));
        const jsonBody1 = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: e.value
        });

        dispatch(_act.InvoiceNumber(jsonBody1));
    };

    function CalculateOnchange(event, row, key) {  // Calculate Input box onChange Function
        let input = event.target.value
        let v1 = Number(row.BalanceAmount);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.Calculate = event.target.value
        let calSum = 0
        Data.forEach(element => {
            calSum = calSum + Number(element.Calculate)
        });
        setState((i) => {
            let a = { ...i }
            a.values.GrandTotal = calSum
            a.hasValid.GrandTotal.valid = true;
            return a
        })
    };

    function AmountPaid_onChange(event) {
        let input = event.target.value
        let sum = 0
        Data.forEach(element => {
            sum = sum + Number(element.BalanceAmount)
        });

        let v1 = Number(sum);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        onChangeText({ event, state, setState })
        AmountPaidDistribution(event.target.value)
        dispatch(_act.BreadcrumbShowCountlabel(`${"Calculate Amount"} :${Number(event.target.value).toFixed(2)}`))
    }

    function AmountPaidDistribution(val1) {
        let value = Number(val1)
        let Amount = value
        Data.map((index) => {
            let amt = Number(index.BalanceAmount)
            if ((Amount > amt) && !(amt === 0)) {
                Amount = Amount - amt
                index.Calculate = amt.toFixed(2)
            }
            else if ((Amount <= amt) && (Amount > 0)) {
                index.Calculate = Amount.toFixed(2)
                Amount = 0
            }
            else {
                index.Calculate = 0;
            }
            try {
                document.getElementById(`Quantity${index.FullInvoiceNumber}`).value = index.Calculate
            } catch (e) { }
        })
    }

    function itemWise_CalculationFunc(val, row, type) {

        row.gstPercentage = row.GSTPercentage
        let calculate = salesReturnCalculate(row)

        Setcalculation(calculate)
        let AmountTotal = calculate.tAmount
        row["AmountTotal"] = Number(AmountTotal)
        row["BasicAmount"] = Number(calculate.baseAmt)
        row["CGSTAmount"] = Number(calculate.CGST)
        row["SGSTAmount"] = Number(calculate.SGST)
        row["GSTAmount"] = Number(calculate.gstAmt)
        let sum = 0
        InvoiceItems.forEach(ind => {
            if (ind.AmountTotal === undefined) {
                ind.AmountTotal = 0
            }
            var amt = parseFloat(ind.AmountTotal)
            sum = sum + amt
        });
        let v1 = Number(row.BaseUnitQuantity);
        let v2 = Number(val)
        if (!(v1 >= v2)) {
            val = v1;
        }
        setState((i) => {
            let a = { ...i }
            a.values.GrandTotal = Number(sum).toFixed(2)
            a.hasValid.GrandTotal.valid = true;
            return a
        })
        setTotalSum(sum)
        AmountPaidDistribution(sum)
        dispatch(_act.BreadcrumbShowCountlabel(`${"Calculate Amount"} :${Number(sum).toFixed(2)}`))

    };

    function UnitOnchange(e, row, key) {

        row.unit = e.value
    };

    const pagesListColumns1 = [
        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "BaseUnitQuantity",
            dataField: "BaseUnitQuantity",
        },
        {
            text: "Unit Name",
            dataField: "UnitName",
            headerStyle: (colum, colIndex) => {
                return { width: '60px', textAlign: 'center' };
            },

        },

        {
            text: "Quantity ",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (< >
                    <CInput
                        key={`Qty${row.Item}${key}`}
                        id={`Qty${key}`}
                        cpattern={onlyNumberRegx}
                        defaultValue={row.Quantity}
                        autoComplete="off"
                        className=" text-end"
                        onChange={(e) => {
                            row["Quantity"] = e.target.value
                            itemWise_CalculationFunc(row)
                        }}
                    />
                    {/* <Input
                        key={`Qty${row.Item}${key}`}
                        id={`Qty${key}`}
                        pattern={decimalRegx}
                        defaultValue={null}
                        disabled={pageMode === mode.view ? true : false}
                        placeholder="Enter Quantity"
                        autoComplete="off"
                        className="col col-sm"
                        onChange={(e) => {
                            const val = e.target.value
                            let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                            if ((isnum) || (val === '')) {
                                itemWise_CalculationFunc(val, row, "qty")
                            } else {
                                document.getElementById(`Qty${key}`).value = row.Quantity
                            }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, InvoiceItems)}
                    /> */}
                </>
                )
            }
        },
        {
            text: "Unit",
            dataField: "",
            formatter: (cellContent, row, key) => {

                if (pageMode !== mode.view) {
                    const Units = row.ItemUnitDetails.map((index) => ({
                        value: index.Unit,
                        label: index.UnitName,
                    }));


                    return (<span style={{ justifyContent: 'center', width: "100px" }}>
                        <Select
                            id={`Unit${key}`}
                            name="Unit"
                            defaultValue={row.Calculate}
                            isSearchable={true}
                            className="react-dropdown"
                            classNamePrefix="dropdown"
                            options={Units}
                            onChange={(e) => UnitOnchange(e, row, key)}

                        />
                    </span>)
                } else {
                    row.unit = { label: row.UnitName, value: row.Unit };
                    return (<span style={{ justifyContent: 'center', width: "100px" }}>

                        <Select
                            id={`Unit${key}`}
                            name="Unit"
                            defaultValue={row.unit}
                            disabled={true}
                            isSearchable={true}
                            className="react-dropdown"
                            classNamePrefix="dropdown"
                            onChange={(e) => UnitOnchange(e, row, key)}
                        />
                    </span>)
                }
            }
        },
        {
            text: "Rate",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (
                    <>
                        <CInput
                            type="text"
                            key={`Ratey${row.Item}${key}`}
                            id={`Ratey${key}`}
                            defaultValue={row.Rate}
                            cpattern={onlyNumberRegx}
                            autoComplete="off"
                            className=" text-end"
                            onChange={(e) => {
                                row["Rate"] = e.target.value
                                itemWise_CalculationFunc(row)
                            }}
                        />
                        {/* <Input
                        type="text"
                        key={`Ratey${row.Item}${key}`}
                        id={`Ratey${key}`}
                        defaultValue={row.Rate}
                        disabled={pageMode === mode.view ? true : false}
                        autoComplete="off"
                        className="col col-sm"

                        onChange={(e) => {
                            const val = e.target.value
                            let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                            if ((isnum) || (val === '')) {
                                itemWise_CalculationFunc(val, row, "Rate")
                            } else {
                                document.getElementById(`Ratey${key}`).value = row.Rate
                            }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, InvoiceItems)}


                    /> */}
                    </>
                )
            }
        },
    ];

    const pagesListColumns = [
        {
            text: "InvoiceDate",
            dataField: "InvoiceDate",
        },
        {
            text: "Invoice No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Invoice Amount",
            dataField: "GrandTotal",
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {


                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        key={`Quantity${row.FullInvoiceNumber}${key}`}
                        id={`Quantity${row.FullInvoiceNumber}`}
                        pattern={decimalRegx}
                        defaultValue={pageMode === mode.view ? row.Amount : row.Calculate}
                        disabled={pageMode === mode.view ? true : false}
                        // value={row.Calculate}
                        // type="text"
                        autoComplete="off"
                        className="col col-sm text-center"
                        onChange={(e) => CalculateOnchange(e, row, key)}

                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },
    ];

    const saveHandeller = async (event) => {
        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id;
        if ((values.Amount === 0) || (values.Amount === "NaN")) {
            customAlert({
                Type: 3,
                Message: `Amount Paid value can not be ${values.Amount}`,
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        const ReceiptInvoices1 = Data.map((index) => ({
            Invoice: index.Invoice,
            GrandTotal: index.GrandTotal,
            PaidAmount: index.Calculate,
        }))
        const FilterReceiptInvoices = ReceiptInvoices1.filter((index) => {
            return index.PaidAmount > 0
        })

        InvoiceItems.forEach(index => {

            if ((!index.unit)) {
                customAlert({
                    Type: 3,
                    Message: `Please Select Unit ${index.ItemName}`,
                })
                // return _cfunc.btnIsDissablefunc({ btnId, state: false })
            } else {
                if (index.Qty) {
                    // if ((!index.unit)) {
                    //     customAlert({
                    //         Type: 3,
                    //         Message: `Please Select Unit ${index.ItemName}`,
                    //     })
                    //     // return _cfunc.btnIsDissablefunc({ btnId, state: false })
                    // }
                    const CRDRNoteItems = {
                        CRDRNoteDate: values.CRDRNoteDate,
                        Item: index.Item,
                        Quantity: Number(index.Qty),
                        Unit: index.unit,
                        BaseUnitQuantity: index.BaseUnitQuantity,
                        MRP: index.MRP,
                        Rate: index.Rate,
                        BasicAmount: index.BasicAmount,
                        TaxType: index.TaxType,
                        GST: index.GST,
                        GSTAmount: index.CGSTAmount,
                        Amount: index.AmountTotal,
                        CGST: index.CGSTAmount,
                        SGST: index.SGSTAmount,
                        IGST: index.IGST,
                        BatchCode: index.BatchCode,
                        CGSTPercentage: index.CGSTPercentage,
                        SGSTPercentage: index.SGSTPercentage,
                        IGSTPercentage: index.IGSTPercentage,

                    }
                    arr1.push(CRDRNoteItems)
                }
            }
        })

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    CRDRNoteDate: values.CRDRNoteDate,
                    Customer: values.Customer.value,
                    NoteType: arr1.length === 0 ? CreditDebitTypeId.id : GoodsCreditType.id,
                    GrandTotal: values.GrandTotal,
                    Narration: values.Narration,
                    NoteReason: values.NoteReason.value,
                    CRDRNoteItems: arr1 ? arr1 : [],
                    Party: _cfunc.loginPartyID(),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    CRDRInvoices: FilterReceiptInvoices,
                })
                if (pageMode === mode.edit) {
                    // dispatch(_act.updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }
                else {

                    dispatch(_act.saveCredit({ jsonBody, btnId }));
                }

            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }

    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >
                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CRDRNoteDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='CreditDate'
                                                value={values.CRDRNoteDate}
                                                onChange={DateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Narration"
                                                id="Narration"
                                                value={values.Narration}
                                                type="text"
                                                className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Narration"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Narration.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Narration}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer"
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={PartyOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    CustomerOnChange(hasSelect)
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.NoteReason}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="NoteReason "
                                                name="NoteReason"
                                                value={values.NoteReason}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => { onChangeSelect({ hasSelect, evn, state, setState, }) }}
                                            />
                                            {isError.NoteReason.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.NoteReason}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.GrandTotal}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="GrandTotal"
                                                id="GrandTotal"
                                                value={values.GrandTotal}
                                                type="text"
                                                className={isError.GrandTotal.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                // onChange={(event) => { onChangeText({ event, state, setState }) }}
                                                onChange={AmountPaid_onChange}
                                            />
                                            {isError.GrandTotal.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.GrandTotal}</small></span>

                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.InvoiceNO}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="InvoiceNO "
                                                name="InvoiceNO"
                                                value={values.InvoiceNO}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    InvoiceNoOnChange(hasSelect)
                                                }}

                                            />
                                            {/* {isError.InvoiceNO.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.InvoiceNO}</small></span>
                                            )} */}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>
                        </div>

                        <ToolkitProvider
                            keyField="id"
                            data={Table1.length <= 0 ? InvoiceItems : Table1}
                            columns={pagesListColumns1}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    {(InvoiceItems.length > 0) && <div className="table">
                                        <BootstrapTable
                                            keyField="id"
                                            id="table_Arrow"
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                    }

                                    {(Table1.length > 0) && <div className="table">
                                        <BootstrapTable
                                            keyField="id"
                                            id="table_Arrow"
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                    }

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>

                        {
                            <ToolkitProvider
                                keyField="id"
                                data={Table.length <= 0 ? Data : Table}
                                columns={pagesListColumns}
                                search
                            >
                                {toolkitProps => (
                                    <React.Fragment>
                                        <div className="table">
                                            <BootstrapTable
                                                keyField={"id"}
                                                id="table_Arrow"
                                                bordered={true}
                                                striped={false}
                                                noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                classes={"table align-middle table-nowrap table-hover"}
                                                headerWrapperClasses={"thead-light"}

                                                {...toolkitProps.baseProps}

                                            />

                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>}

                        {Data.length > 0 ?
                            <FormGroup>
                                <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                    <SaveButton pageMode={pageMode}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"Receipts"}
                                    />

                                </Col>
                            </FormGroup >
                            : null
                        }
                    </form >
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default Credit;








