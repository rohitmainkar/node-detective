import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";

import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    GoButtonForinvoiceAdd,
    GoButtonForinvoiceAddSuccess,
    invoiceSaveAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    invoice_discountCalculate_Func,
    innerStockCaculation,
    orderQtyOnChange,
    orderQtyUnit_SelectOnchange,
    stockQtyOnChange
} from "./invoiceCaculations";
import "./invoice.scss"
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx } from "../../../CustomValidateForm";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";


const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname

    const goBtnId = `ADDGoBtn${subPageMode}`
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [orderIDs, setOrderIDs] = useState([])

    // for invoicer page heder dicount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)
    const [forceReload, setForceReload] = useState(false)
    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        gobutton_Add = { Status: false },
        vendorSupplierCustomer,
        makeIBInvoice,
        goBtnloading,
        saveBtnloading,
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        gobutton_Add: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
        saveBtnloading: state.InvoiceReducer.saveBtnloading,
        goBtnloading: state.InvoiceReducer.goBtnloading,
    }));



    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;


    useEffect(() => {

        dispatch(GetVenderSupplierCustomer(subPageMode))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.INVOICE_1))
        dispatch(GoButtonForinvoiceAddSuccess([]))
        // dispatch(getpartysetting_API(_cfunc.loginPartyID()))


    }, []);

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


    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(invoiceSaveActionSuccess({ Status: false }))
            dispatch(GoButtonForinvoiceAddSuccess([]))

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: JSON.stringify(postMsg.Message),
                })
            }
            else {
                const promise = await customAlert({
                    Type: 1,
                    Message: JSON.stringify(postMsg.Message),
                    RedirectPath: url.INVOICE_LIST_1,
                })
                if (promise) {
                    if (subPageMode === url.INVOICE_1) {
                        history.push({ pathname: url.INVOICE_LIST_1 })
                    }
                    else if (subPageMode === url.IB_INVOICE) {
                        history.push({ pathname: url.IB_INVOICE_LIST })
                    }
                }
            }
        }
        else if (postMsg.Status === true) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])


    useEffect(() => {

        if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = makeIBInvoice.customer;
                obj.hasValid.Customer.valid = true;
                return obj
            })

            dispatch(makeIB_InvoiceActionSuccess({ Status: false }))
        }
    }, [makeIBInvoice]);

    useEffect(() => {

        if (gobutton_Add.Status === true && gobutton_Add.StatusCode === 200) {
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = gobutton_Add.customer;
                obj.hasValid.Customer.valid = true;
                return obj
            })

            setOrderItemDetails(gobutton_Add.Data.OrderItemDetails);

            // **********************************************************
            totalAmountCalcuationFunc(gobutton_Add.Data.OrderItemDetails)// show breadcrump tolat amount function//passs table array 
            //*********************************************************** */

            setOrderIDs(gobutton_Add.Data.OrderIDs)
            dispatch(GoButtonForinvoiceAddSuccess({ Status: false }))
        }
    }, [gobutton_Add]);


    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [orderItemDetails]);

    const CustomerDropdown_Options = vendorSupplierCustomer.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const totalAmountCalcuationFunc = (tableList = []) => {
        const sum = tableList.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]), 0);
        dispatch(BreadcrumbShowCountlabel(`${"Total Amount"} :${sum.toFixed(2)}`))
    }
    const pagesListColumns = [
        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            classes: () => ('invoice-item-row'),
            formatter: (cellContent, index1) => {
                return (
                    <>
                        <div className="invoice-item-row-div-1">
                            <samp id={`ItemName${index1.id}`}>{index1.ItemName}</samp>
                        </div>
                        {
                            (index1.StockInValid) ? <div><samp id={`StockInvalidMsg-${index1.id}`} style={{ color: "red" }}> {index1.StockInvalidMsg}</samp></div>
                                : <></>
                        }
                    </>
                )
            },
        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: orderItemDetails },
            // classes: () => ('invoice-quantity-row1'),
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <>
                    <div className="div-1 mb-2" style={{ minWidth: "200px" }}>
                        <Input
                            type="text"
                            disabled={pageMode === 'edit' ? true : false}
                            id={`OrderQty-${index1.id}`}
                            className="input"
                            style={{ textAlign: "right" }}
                            key={index1.id}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => {
                                orderQtyOnChange(event, index1);
                                totalAmountCalcuationFunc(tableList);
                            }}
                        />
                    </div>
                    <div className="div-1 ">
                        <div id="select">
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={pageMode === 'edit' ? true : false}
                                defaultValue={index1.default_UnitDropvalue}
                                options={index1.UnitDetails.map(i => ({
                                    "label": i.UnitName,
                                    "value": i.UnitID,
                                    "ConversionUnit": i.ConversionUnit,
                                    "Unitlabel": i.Unitlabel,
                                    "BaseUnitQuantity": i.BaseUnitQuantity,
                                    "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                }))}
                                onChange={(event) => {
                                    orderQtyUnit_SelectOnchange(event, index1);
                                    totalAmountCalcuationFunc(tableList);
                                }}
                            ></Select>
                        </div>
                    </div>
                    <div className="bottom-div">
                        <span>Order-Qty :</span>
                        <samp>{index1.OrderQty}</samp>
                        <samp>{index1.UnitName}</samp>
                    </div>
                </>
            ),
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            formatExtraData: { tableList: orderItemDetails },
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <div>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead >
                            <tr >
                                <th style={{ zIndex: -1 }}>BatchCode</th>
                                <th style={{ zIndex: -1 }}>
                                    <div>
                                        <samp>Stock Quantity</samp>
                                    </div>
                                </th >
                                <th style={{ zIndex: -1 }}>
                                    <div>
                                        <samp>Quantity</samp>
                                    </div>
                                </th>
                                <th style={{ zIndex: -1 }}>Rate</th>
                                <th style={{ zIndex: -1 }}>MRP</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {cellContent.map((index2) => (
                                <tr key={index1.id}>
                                    <td>
                                        <div style={{ width: "120px" }}>{index2.BatchCode}</div>
                                    </td>
                                    <td>
                                        <div style={{ width: "120px", textAlign: "right" }}>
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.ActualQuantity}</samp>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Input
                                                type="text"
                                                disabled={pageMode === 'edit' ? true : false}
                                                style={{ textAlign: "right" }}
                                                key={`batchQty${index1.id}-${index2.id}`}
                                                id={`batchQty${index1.id}-${index2.id}`}
                                                defaultValue={index2.Qty}
                                                onChange={(event) => {
                                                    stockQtyOnChange(event, index1, index2);
                                                    totalAmountCalcuationFunc(tableList);
                                                }}
                                            ></Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>
                                            <span id={`stockItemRate-${index1.id}-${index2.id}`}>{index2.Rate}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>{index1.MRPValue}</div>
                                    </td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            ),
        },
        {//***************Discount********************************************************************* */
            text: "Discount/unit",
            dataField: "",
            formatExtraData: {
                discountValueAll: discountValueAll,
                discountTypeAll: discountTypeAll,
                changeAllDiscount: changeAllDiscount,
                forceReload: forceReload,
                tableList: orderItemDetails
            },
            headerFormatter: () => {
                return (
                    <div className="">
                        {orderItemDetails.length <= 0 ?
                            <div className="col col-3 mt-2">
                                <Label>Discount/unit</Label>
                            </div>
                            :
                            <div className="row">
                                <div className=" mt-n2 mb-n2">
                                    <Label>Discount/unit</Label>
                                </div>
                                <div className="col col-6" style={{ width: "100px" }}>
                                    <Select
                                        type="text"
                                        defaultValue={discountTypeAll}
                                        classNamePrefix="select2-selection"
                                        options={discountDropOption}
                                        style={{ textAlign: "right" }}
                                        onChange={(e) => {
                                            setChangeAllDiscount(true);
                                            setDiscountTypeAll(e);
                                            setDiscountValueAll('');
                                        }}
                                    />
                                </div>
                                <div className="col col-6" style={{ width: "100px" }}>
                                    <CInput
                                        type="text"
                                        className="input"
                                        style={{ textAlign: "right" }}
                                        cpattern={decimalRegx}
                                        value={discountValueAll}
                                        onChange={(e) => {
                                            let e_val = Number(e.target.value);

                                            // Check if discount type is "percentage"
                                            if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                                                // Limit the input to the range of 0 to 100
                                                if (e_val > 100) {
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ""; // Clear the input value if it is less than 0
                                                }
                                            }

                                            setChangeAllDiscount(true);
                                            setDiscountValueAll(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                );
            },
            classes: () => "invoice-discount-row",
            formatter: (cellContent, index1, key, formatExtraData) => {
                let { tableList, discountValueAll, discountTypeAll } = formatExtraData;

                if (formatExtraData.changeAllDiscount) {
                    index1.Discount = discountValueAll;
                    index1.DiscountType = discountTypeAll.value;
                    innerStockCaculation(index1);
                    totalAmountCalcuationFunc(tableList);
                }

                const defaultDiscountTypelabel =
                    index1.DiscountType === 2 ? discountDropOption[1] : discountDropOption[0];

                return (
                    <>
                        <div className="mb-2">
                            <div className="parent">
                                <div className="child">
                                    <label className="label">Type&nbsp;&nbsp;&nbsp;</label>
                                </div>
                                <div className="child">
                                    <Select
                                        id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        key={`DicountType_${key}-${index1.id}`}
                                        value={defaultDiscountTypelabel}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                            innerStockCaculation(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="parent">
                                <div className="child">
                                    <label className="label">Value&nbsp;</label>
                                </div>
                                <div className="child">
                                    <CInput
                                        className="input"
                                        id={`Dicount_${key}-${index1.id}`}
                                        style={{ textAlign: "right" }}
                                        type="text"
                                        value={index1.Discount}
                                        cpattern={decimalRegx}
                                        onChange={(e) => {

                                            let e_val = Number(e.target.value);
                                            // Check if discount type is "percentage"
                                            if (index1.DiscountType === 2) { // Discount type 2 represents "percentage"
                                                // Limit the input to the range of 0 to 100
                                                if (e_val > 100) {
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ''; // Clear the input value if it is less than 0
                                                }
                                            }
                                            index1.Discount = e.target.value;
                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            innerStockCaculation(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bottom-div">
                            <span>Amount:</span>
                            <samp id={`roundedTotalAmount-${index1.id}`}>{index1.roundedTotalAmount}</samp>
                        </div>
                    </>
                );
            },
        },
    ];


    function InvoiceDateOnchange(y, v, e) {
        dispatch(GoButtonForinvoiceAddSuccess([]))
        onChangeDate({ e, v, state, setState })
    };

    function CustomerOnchange(hasSelect,) {

        setState((i) => {
            const v1 = { ...i }
            v1.values.Customer = hasSelect
            v1.hasValid.Customer.valid = true
            return v1
        })
    };

    function goButtonHandler(makeIBInvoice) {
        const btnId = goBtnId;
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        try {
            const jsonBody = JSON.stringify({
                FromDate: values.InvoiceDate,
                Customer: makeIBInvoice ? makeIBInvoice.customer.value : values.Customer.value,
                Party: _cfunc.loginPartyID(),
                OrderIDs: ""
            });
            dispatch(GoButtonForinvoiceAdd({ subPageMode, jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const SaveHandler = async (event) => {


        event.preventDefault();

        const btnId = event.target.id
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
        try {

            const validMsg = []
            const invoiceItems = []
            let grand_total = 0;

            orderItemDetails.forEach((index) => {
                if (index.StockInValid) {
                    validMsg.push(`${index.ItemName}:${index.StockInvalidMsg}`);
                    return returnFunc()
                };

                index.StockDetails.forEach((ele) => {

                    if (ele.Qty > 0) {

                        const calculate = invoice_discountCalculate_Func(ele, index)

                        grand_total = grand_total + Number(calculate.roundedTotalAmount)
                        invoiceItems.push({
                            Item: index.Item,
                            Unit: index.default_UnitDropvalue.value,
                            BatchCode: ele.BatchCode,
                            Quantity: Number(ele.Qty).toFixed(3),
                            BatchDate: ele.BatchDate,
                            BatchID: ele.id,
                            BaseUnitQuantity: Number(ele.BaseUnitQuantity).toFixed(3),
                            LiveBatch: ele.LiveBatche,
                            MRP: ele.LiveBatcheMRPID,
                            MRPValue: ele.MRP,//changes
                            Rate: Number(ele.Rate).toFixed(2),
                            BasicAmount: Number(calculate.discountBaseAmt).toFixed(2),
                            GSTAmount: Number(calculate.roundedGstAmount).toFixed(2),
                            GST: ele.LiveBatcheGSTID,
                            GSTPercentage: ele.GST,// changes
                            CGST: Number(calculate.CGST_Amount).toFixed(2),
                            SGST: Number(calculate.SGST_Amount).toFixed(2),
                            IGST: 0,
                            GSTPercentage: ele.GST,
                            CGSTPercentage: (ele.GST / 2),
                            SGSTPercentage: (ele.GST / 2),
                            IGSTPercentage: 0,
                            Amount: Number(calculate.roundedTotalAmount).toFixed(2),
                            TaxType: 'GST',
                            DiscountType: index.DiscountType,
                            Discount: Number(index.Discount) || 0,
                            DiscountAmount: Number(calculate.disCountAmt).toFixed(2),
                        })
                    }
                })
            })

            if (validMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: JSON.stringify(validMsg),
                })
                return returnFunc()
            }

            if (!(invoiceItems.length > 0)) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })
                return returnFunc()
            }

            const forInvoice_1_json = () => ({  // Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                InvoiceDate: values.InvoiceDate,
                InvoiceItems: invoiceItems,
                InvoicesReferences: orderIDs.map(i => ({ Order: i }))
            });

            const forIB_Invoice_json = async () => ({    //   Json Body Generate For IB_Invoice  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                IBChallanDate: values.InvoiceDate,
                IBChallanItems: invoiceItems,
                IBChallansReferences: await orderIDs.map(i => ({ Demand: i }))
            });
            const isRound = _cfunc.loginSystemSetting().InvoiceAmountRoundConfiguration;

            const for_common_json = () => ({     //   Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                CustomerGSTTin: '41',
                GrandTotal: isRound === "1" ? Math.round(grand_total) : Number(grand_total),
                RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
                TCSAmount: "0.00",
                Customer: values.Customer.value,
                Party: _cfunc.loginPartyID(),
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
            });


            let jsonBody;  //json body decleration 
            if (subPageMode === url.INVOICE_1) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forInvoice_1_json() });
            } else if (subPageMode === url.IB_INVOICE) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forIB_Invoice_json() });
            }
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if (pageMode === mode.edit) {
                returnFunc()
            }

            else {
                dispatch(invoiceSaveAction({ subPageMode, jsonBody, btnId }));
            }

        } catch (e) { returnFunc() }

    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    {/* <form noValidate> */}
                    <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                        <Row>
                            <Col className=" mt-1 row  " sm={11} >
                                <Col sm="6">
                                    <FormGroup className="row mt-2 mb-3  ">
                                        <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.InvoiceDate} </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="InvoiceDate"
                                                value={values.InvoiceDate}
                                                id="myInput11"
                                                disabled={(orderItemDetails.length > 0 || pageMode === "edit") ? true : false}
                                                onChange={InvoiceDateOnchange}
                                            />
                                            {isError.InvoiceDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="row mt-2 mb-3 ">
                                        <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.Customer} </Label>
                                        <Col sm={7}>
                                            <Select

                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                isDisabled={orderItemDetails.length > 0 ? true : false}
                                                id={'customerselect'}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={CustomerDropdown_Options}
                                                onChange={CustomerOnchange}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Col>

                            <Col sm={1} className="mt-3">
                                {pageMode === mode.defaultsave ?
                                    (orderItemDetails.length === 0) ?
                                        < Go_Button onClick={(e) => goButtonHandler()}
                                            loading={goBtnloading} />
                                        :
                                        <Change_Button onClick={(e) => dispatch(GoButtonForinvoiceAddSuccess([]))} />
                                    : null
                                }
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                    </Col>


                    <div className="table-responsive mb-4">
                        <ToolkitProvider
                            keyField={"id"}
                            data={orderItemDetails}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <BootstrapTable
                                                id="table_Arrow"
                                                keyField={"id"}
                                                responsive
                                                bordered={false}
                                                striped={false}
                                                classes={"table  table-bordered"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                {...toolkitProps.baseProps}
                                                onDataSizeChange={(e) => {
                                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                }}
                                            />
                                        </Col>
                                        {mySearchProps(toolkitProps.searchProps,)}
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    </div>

                    {orderItemDetails.length > 0 ? <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            <SaveButton
                                pageMode={pageMode}
                                onClick={SaveHandler}
                                id={saveBtnid}
                                loading={saveBtnloading}
                                userAcc={userPageAccessState}
                            />
                        </Col>
                    </FormGroup > : null}
                    {/* </form> */}
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

export default Invoice