import React, { useEffect, useLayoutEffect, useState } from "react";
import { MetaTags } from "react-meta-tags"
import { useHistory } from "react-router-dom";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { basicAmount, GstAmount, Amount } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button, GotoInvoiceBtn } from "../../../components/Common/CommonButton";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";

import OrderPageTermsTable from "./OrderPageTermsTable";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";

import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import { order_Type } from "../../../components/Common/C-Varialbes";
import { useRef } from "react";
import { CInput, C_DatePicker, decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm/index";

import * as _act from "../../../store/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { editPartyItemID } from "../../../store/Administrator/PartyItemsRedux/action";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { pageFieldUseEffect, table_ArrowUseEffect, updateMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { orderApprovalFunc, orderApprovalMessage } from "./orderApproval";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import { ORDER_4 } from "../../../routes/route_url";
import { getItemList } from "../../../store/actions";
import CustomTable from "../../../CustomTable2/Custom";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";


let editVal = {}
let initial_BredcrumbMsg = "Order Amount :0.00"

function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.ORDER_1) {
        page_Id = pageId.ORDER_1;
        listPath = url.ORDER_LIST_1
    }
    else if (sub_Mode === url.ORDER_2) {
        page_Id = pageId.ORDER_2;
        listPath = url.ORDER_LIST_2
    }
    else if (sub_Mode === url.IB_ORDER) {
        page_Id = pageId.IB_ORDER;
        listPath = url.IB_ORDER_PO_LIST;
    }
    else if (sub_Mode === url.ORDER_4) {
        page_Id = pageId.ORDER_4;
        listPath = url.ORDER_LIST_4
    }
    return { page_Id, listPath }
};

const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const userAdminRole = _cfunc.loginUserAdminRole();
    const ref1 = useRef('')

    const fileds = {
        id: "",
        Supplier: "",
        Route: "",
        Item: ''
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [description, setDescription] = useState('')

    const [deliverydate, setdeliverydate] = useState(currentDate_ymd)
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate_ymd);
    const [poToDate, setpoToDate] = useState(currentDate_ymd);
    const [orderdate, setorderdate] = useState(currentDate_ymd);

    const [supplierSelect, setsupplierSelect] = useState('');
    const [routeSelect, setRouteSelect] = useState('');
    const [partySelect, setPartySelect] = useState('');
    const [itemSelect, setItemSelect] = useState({ value: '', label: "All" });
    const [itemSelectDropOptions, setitemSelectOptions] = useState([]);
    const [selecedItemWiseOrder, setSelecedItemWiseOrder] = useState(true)
    const [goBtnDissable, setGoBtnDissable] = useState(false)

    const [orderAmount, setOrderAmount] = useState(0);
    const [termsAndConTable, setTermsAndConTable] = useState([]);
    const [orderTypeSelect, setorderTypeSelect] = useState('');
    const [isOpen_assignLink, setisOpen_assignLink] = useState(false)
    const [orderItemTable, setorderItemTable] = useState([])
    const [findPartyItemAccess, setFindPartyItemAccess] = useState(false)
    const [FSSAI_Date_Is_Expired, setFSSAI_Date_Is_Expired] = useState("")

    const {
        goBtnOrderdata,
        postMsg,
        vendorSupplierCustomer,
        userAccess,
        orderType,
        updateMsg,
        supplierAddress,
        pageField,
        partyList_redux,
        assingItemData = '',
        approvalDetail,
        orderApprovalMsg,
        gobutton_Add_invoice,
        goBtnloading,
        saveBtnloading,
        gotoInvoiceBtnLoading,
        RoutesList
    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        orderType: state.CommonAPI_Reducer.orderType,
        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
        approvalDetail: state.OrderReducer.approvalDetail,
        assingItemData: state.PartyItemsReducer.editData,
        partyList_redux: state.PartyMasterReducer.partyList,
        gobutton_Add_invoice: state.InvoiceReducer.gobutton_Add,
        RoutesList: state.RoutesReducer.RoutesList,
        goBtnloading: state.OrderReducer.loading,
        saveBtnloading: state.OrderReducer.saveBtnloading,
        gotoInvoiceBtnLoading: state.OrderReducer.gotoInvoiceBtnLoading,

    }));;

    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useLayoutEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.GoButton_For_Order_AddSuccess(null))
        dispatch(_act.commonPageField(page_id))
        dispatch(_act.getTermAndCondition())
        dispatch(_act.getOrderType())
        dispatch(GetRoutesList());
        dispatch(getPartyListAPI())
        dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
        if (!(subPageMode === url.ORDER_4)) {
            dispatch(_act.getSupplierAddress(_cfunc.loginPartyID()))
        }
    }, []);

    useEffect(() => userAccessUseEffect({ // userAccess useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
        otherloginAccss// for other pages login role access chack
    }), [userAccess]);

    const otherloginAccss = (ind) => {
        if ((ind.id === pageId.PARTYITEM) && !(subPageMode === url.IB_ORDER)) {
            setFindPartyItemAccess(true)
        }
    };

    useEffect(() => { // hasEditVal useEffect

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
                dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :${hasEditVal.OrderAmount}`))
                setorderdate(hasEditVal.OrderDate)

                if (subPageMode === url.ORDER_4) {
                    setsupplierSelect({
                        label: hasEditVal.CustomerName,
                        value: hasEditVal.Customer
                    });
                } else {
                    setsupplierSelect({
                        label: hasEditVal.SupplierName,
                        value: hasEditVal.Supplier
                    });
                }
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                setDescription(hasEditVal.Description)
                editVal = {}
                editVal = hasEditVal
                setOrderAmount(hasEditVal.OrderAmount)
                setorderTypeSelect({ value: hasEditVal.POType, label: hasEditVal.POTypeName })

                setpoToDate(hasEditVal.POToDate)
                setpoFromDate(hasEditVal.POFromDate)

                const { TermsAndConditions = [] } = hasEditVal;
                const termsAndCondition = TermsAndConditions.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition,
                    IsDeleted: 0
                }))

                const orderItems = hasEditVal.OrderItems.map((ele, k) => {
                    ele["id"] = k + 1
                    return ele
                });
                setorderItemTable(orderItems)
                setTermsAndConTable(termsAndCondition)
            }
            dispatch(_act.editOrderIdSuccess({ Status: false }))
            seteditCreatedBy(hasEditVal.CreatedBy)
        } else {
            dispatch(_act.BreadcrumbShowCountlabel(initial_BredcrumbMsg))
        }
    }, []);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
            dispatch(_act.saveOrderActionSuccess({ Status: false }))

            setTermsAndConTable([])

            // ??******************************+++++++++++++++++++++++++++++++++++++++++
            const liveMode = false  // temporary not working code thats why false use line no. 253 to 289
            const aprovalSapCallMode = (postMsg.IsSAPCustomer > 0)

            if ((subPageMode === url.ORDER_2) && liveMode && aprovalSapCallMode) { //        SAP OEDER-APROVUAL CODE
                let config = { orderId: postMsg.OrderID }

                dispatch(_act.getOrderApprovalDetailAction(config));

            } else {// ??******************************+++++++++++++++++++++++++++++++++++++++++++++++


                dispatch(_act.GoButton_For_Order_AddSuccess([]))
                if ((subPageMode === url.ORDER_4) && (postMsg.gotoInvoiceMode)) {

                    const customer = supplierSelect
                    const jsonBody = JSON.stringify({
                        OrderIDs: postMsg.OrderID.toString(),
                        FromDate: orderdate,
                        Customer: supplierSelect.value,
                        Party: _cfunc.loginPartyID(),
                    });
                    dispatch(_act.GoButtonForinvoiceAdd({
                        jsonBody, subPageMode: url.INVOICE_1, path: url.INVOICE_1, pageMode: mode.defaultsave, customer,
                        errorMsg: "Order Save Successfully But Can't Make Invoice"
                    }));
                }
                else {
                    const a = await customAlert({
                        Type: 1,
                        Message: postMsg.Message,
                    })
                    if (a) {
                        history.push({
                            pathname: listPath,
                        });
                    }
                }

            }
        }
        else if ((postMsg.Status === true) && !(pageMode === mode.dropdownAdd)) {

            dispatch(_act.saveOrderActionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg])

    useEffect(() => updateMsgUseEffect({
        updateMsg, modalCss,
        history, dispatch,
        updateSuccss: _act.updateOrderIdSuccess,
        listPath: listPath
    }), [updateMsg])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField])

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [orderItemTable]);

    useEffect(() => {
        if (assingItemData.Status === true) {
            setisOpen_assignLink(true);
        }
    }, [assingItemData]);

    useEffect(() => {
        if (goBtnOrderdata) {
            let { OrderItems = [], TermsAndConditions = [] } = goBtnOrderdata
            if (!selecedItemWiseOrder) { setorderItemTable(OrderItems) }
            setitemSelectOptions(OrderItems.map(i => ({ ...i, value: i.Item_id, label: i.ItemName })))

            setTermsAndConTable(TermsAndConditions)
            dispatch(_act.GoButton_For_Order_AddSuccess(''))
        }
    }, [goBtnOrderdata]);

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress]);

    useEffect(() => {
        if ((orderType.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setorderTypeSelect({
                value: orderType[0].id,
                label: orderType[0].Name,
            });
        }
    }, [orderType]);

    useEffect(() => {
        orderApprovalFunc({ dispatch, approvalDetail })
    }, [approvalDetail]);


    useEffect(() => {
        orderApprovalMessage({ dispatch, orderApprovalMsg, listPath, history })
    }, [orderApprovalMsg]);

    useEffect(() => {
        try {
            document.getElementById("__assignItem_onClick").style.display = ((supplierSelect.value > 0) && (findPartyItemAccess) && !goBtnloading) ? "block" : "none"
        } catch (e) { }
    }, [goBtnloading, supplierSelect, findPartyItemAccess]);


    useEffect(() => {
        if (gobutton_Add_invoice.Status === true && gobutton_Add_invoice.StatusCode === 200) {
            history.push({
                pathname: gobutton_Add_invoice.path,
            })
        }
    }, [gobutton_Add_invoice]);

    const supplierOptions = vendorSupplierCustomer.map((i) => ({
        value: i.id,
        label: i.Name,
        FSSAIExipry: i.FSSAIExipry
    }))

    const orderTypeOptions = orderType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const Party_DropdownOptions = partyList_redux.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteOptions = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    RouteOptions.unshift({
        value: "",
        label: "All"
    });

    const pagesListColumns = [
        {
            dataField: "GroupName",
            text: "Group",
            sort: true,
        },
        {
            dataField: "SubGroupName",
            text: "SubGroup",
            sort: true,
        },

        {//------------- ItemName column ----------------------------------
            dataField: "ItemName",
            text: "Item Name",
            sort: true,
            sortValue: (cell, row) => row["ItemName"],
            headerFormatter: (value, row, k, f) => {
                return (
                    <div className="d-flex justify-content-between" key={row.id}>
                        <div>
                            Item Name
                        </div>
                        <div className="cursor-pointer" onClick={assignItem_onClick}>
                            <samp id={"__assignItem_onClick"} style={{ display: "none" }} className="text-primary fst-italic text-decoration-underline"
                            >
                                Assign-Items</samp>
                        </div>

                    </div>
                )
            },
        },

        { //------------- Quantity column ----------------------------------
            text: "Quantity",
            formatter: (value, row, k) => {
                return (
                    <>
                        <CInput
                            key={`Quantity-${k}`}
                            id={`Quantity-${k}`}
                            cpattern={onlyNumberRegx}
                            defaultValue={row.Quantity}
                            autoComplete="off"
                            className=" text-end"
                            onChange={(e) => {
                                row["Quantity"] = e.target.value
                                itemWise_CalculationFunc(row)
                            }}
                        />
                    </>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",

            headerStyle: () => {
                return { width: '150px', textAlign: 'center' };
            },
            formatter: (value, row, key) => {

                if (!row.UnitName) {
                    row["Unit_id"] = 0;
                    row["UnitName"] = 'null';

                    row.UnitDetails.forEach(i => {
                        if ((i.PODefaultUnit) && !(subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                        else if ((i.SODefaultUnit) && (subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                    });
                    // ********************** //if default unit is not selected then auto first indx unit select
                    if ((row["UnitName"] === 'null') && row.UnitDetails.length > 0) {
                        defaultUnit(row.UnitDetails[0])
                    }
                    // **********************                   

                    function defaultUnit(i) {
                        row["Unit_id"] = i.UnitID;
                        row["po_Unit_id"] = i.UnitID;
                        row["UnitName"] = i.UnitName;
                        row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                        row["Rate"] = ((i.BaseUnitQuantity / i.BaseUnitQuantityNoUnit) * i.Rate).toFixed(2);
                    }

                } else {
                    row.UnitDetails.forEach(i => {
                        if ((row.Unit_id === i.UnitID)) {
                            row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                            row["UnitName"] = i.UnitName;
                        }
                    });

                }
                if (pageMode === mode.edit) {

                    if (!row["edit_Qty"]) {
                        if (row.Quantity > 0) {
                            row["editrowId"] = true
                            row["edit_Qty"] = row.Quantity

                        } else {
                            row["edit_Qty"] = 0
                            row["editrowId"] = false
                        }
                    }

                    if (!row["edit_Unit_id"]) {
                        row["edit_Unit_id"] = row.Unit_id;
                    }
                }

                return (
                    <div >
                        <Select
                            id={"ddlUnit"}
                            key={`ddlUnit${row.id}`}
                            defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                            options={
                                row.UnitDetails.map(i => ({
                                    label: i.UnitName,
                                    value: i.UnitID,

                                    BaseUnitQuantity: i.BaseUnitQuantity,
                                    Rate: i.Rate,
                                    BaseUnitQuantityNoUnit: i.BaseUnitQuantityNoUnit
                                }))
                            }
                            onChange={e => {
                                row["Unit_id"] = e.value;
                                row["UnitName"] = e.label
                                row["BaseUnitQuantity"] = e.BaseUnitQuantity;

                                row["Rate"] = ((e.BaseUnitQuantity / e.BaseUnitQuantityNoUnit) * e.Rate).toFixed(2);
                                itemWise_CalculationFunc(row)
                                document.getElementById(`Rate-${key}`).innerText = row.Rate
                            }}
                        >
                        </Select >
                    </div>
                )
            },

        },

        {//------------- Rate column ----------------------------------
            text: "Rate/Unit",
            dataField: "",
            formatter: (value, row, k) => {
                if (subPageMode === url.ORDER_1) {
                    return (
                        <div key={row.id} className="text-end">
                            <CInput
                                type="text"
                                id={`Rate-${k}`}
                                cpattern={decimalRegx}
                                defaultValue={row.Rate}
                                className="text-end"
                                onChange={(event) => {
                                    row.Rate = event.target.value;
                                    itemWise_CalculationFunc(row);
                                }}
                            />

                        </div>
                    )
                }
                else {
                    return (
                        <div key={row.id} className="text-end">

                            <span id={`Rate-${k}`}>{row.Rate}</span>
                        </div>
                    )
                }

            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },


        {//------------- MRP column ----------------------------------
            text: "MRP",
            dataField: "",
            formatter: (value, row, k) => {

                return (
                    <div key={row.id} className="text-end">
                        <span>{row.MRPValue}</span>
                    </div>
                )
            },
            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            },
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            dataField: "",
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Comment${k}`}
                            key={`Comment${row.id}`}

                            defaultValue={row.Comment}
                            autoComplete="off"
                            onChange={(e) => { row["Comment"] = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },
    ];

    const defaultSorted = [
        {
            dataField: "ItemName", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    function orderdateOnchange(e, date) {
        setorderdate(date)
    };

    function supplierOnchange(e) {

        setsupplierSelect(e);
        if (subPageMode === url.ORDER_4) {
            dispatch(_act.getSupplierAddress(e.value))
            let Date = currentDate_ymd
            if ((e.FSSAIExipry === "") || (e.FSSAIExipry === null)) {
                setFSSAI_Date_Is_Expired("There is No FSSAI Expiry Date Please Insert FSSAI Date!")
            }
            else if (e.FSSAIExipry < Date) {
                setFSSAI_Date_Is_Expired("FSSAI Expired")
            } else {
                setFSSAI_Date_Is_Expired("")
            }
        }
        setorderItemTable([])
        setItemSelect('')
        goButtonHandler(e.value)
    };

    function partyOnchange(e) {
        setPartySelect(e)
    };

    function itemSelectOnchange(e) {
        setItemSelect(e)
    };

    function Open_Assign_func() {
        setisOpen_assignLink(false)
        dispatch(_act.editPartyItemIDSuccess({ Status: false }));
        _cfunc.breadcrumbReturnFunc({ dispatch, userAcc: userPageAccessState })
        goButtonHandler()
    };

    function RouteOnChange(event) {
        setsupplierSelect('')
        dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: event.value }))
        setRouteSelect(event)
    }

    async function assignItem_onClick(event) {
        event.stopPropagation();
        const isParty = subPageMode === url.ORDER_1 ? supplierSelect.value : _cfunc.loginPartyID()
        const config = {
            editId: isParty,
            Party: isParty,
            btnmode: mode.assingLink,
            subPageMode,
            btnId: `btn-assingLink-${supplierSelect.value}`
        }

        const isConfirmed = await customAlert({
            Type: 7,
            Message: "Do you confirm your choice?",
        });

        if (isConfirmed) {

            const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), ...{ PartyID: isParty } });

            dispatch(editPartyItemID({ jsonBody, config }))
            dispatch(_act.GoButton_For_Order_AddSuccess([]))
        };
    };

    function itemWise_CalculationFunc(row) {

        row["Amount"] = Amount(row)

        let sum = 0
        orderItemTable.forEach(ind => {
            if (ind.Amount === null) {
                ind.Amount = 0
            }
            var amt = parseFloat(ind.Amount)
            sum = sum + amt
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(_act.BreadcrumbShowCountlabel(`${"Order Amount"} :${sum.toFixed(2)}`))
    };

    const item_AddButtonHandler = () => {

        setGoBtnDissable(true)

        let isfound = orderItemTable.find(i => i.value === itemSelect.value);

        if (!itemSelect) {
            customAlert({ Type: 4, Message: `Select Item Name` })
        }
        else if (isfound === undefined) {
            setorderItemTable([itemSelect].concat(orderItemTable))
        }
        else {
            customAlert({ Type: 3, Message: "This Item Already Exist" })
        }
        setItemSelect('')
    }

    const goButtonHandler = async (selectSupplier) => {

        if (!supplierSelect > 0 && !selectSupplier) {
            await customAlert({
                Type: 4,
                Message: `Please Select ${fieldLabel.Supplier}`
            })
            return;
        }
        let btnId = `go-btn${subPageMode}`
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        dispatch(_act.BreadcrumbShowCountlabel(initial_BredcrumbMsg))


        let PO_Body = {
            Party: selectSupplier ? selectSupplier : supplierSelect.value,
            Customer: _cfunc.loginPartyID(),
            RateParty: _cfunc.loginPartyID(),
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
        }
        let SO_body = {
            Party: _cfunc.loginPartyID(), //swap  party and customer for sale oerder
            Customer: selectSupplier ? selectSupplier : supplierSelect.value,//swap  party and customer for sale oerder
            RateParty: selectSupplier ? selectSupplier : supplierSelect.value,
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
        }


        let jsonBody;   //json body decleration 
        if (subPageMode === url.ORDER_4) {
            jsonBody = JSON.stringify({ ...SO_body, });
        }
        else {
            jsonBody = JSON.stringify({ ...PO_Body, });
        }
        let config = { subPageMode, jsonBody, btnId }
        dispatch(_act.GoButton_For_Order_Add(config))
    };

    const saveHandeller = async (event) => {
        event.preventDefault();

        const btnId = event.target.id
        const gotoInvoiceMode = btnId.substring(0, 14) === "gotoInvoiceBtn";

        try {
            const division = _cfunc.loginPartyID();
            const supplier = supplierSelect.value;

            const validMsg = []
            const itemArr = []
            const isVDC_POvalidMsg = []

            await orderItemTable.forEach(i => {

                if ((i.Quantity > 0) && !(i.Rate > 0)) {
                    validMsg.push({ [i.ItemName]: "This Item Rate Is Require..." });
                }
                else if (pageMode === mode.edit) {

                    const ischange = (!(Number(i.edit_Qty) === Number(i.Quantity)) || !(i.edit_Unit_id === i.Unit_id));

                    let isedit = 0
                    if (ischange && !(i.edit_Qty === 0)) {
                        isedit = 1
                    }
                    orderItemFunc({ i, isedit })
                }
                else {
                    const isedit = 0;
                    orderItemFunc({ i, isedit })
                };
            })


            function orderItemFunc({ i, isedit }) {

                i.Quantity = ((i.Quantity === null) || (i.Quantity === undefined)) ? 0 : i.Quantity

                if ((i.Quantity > 0) && (i.Rate > 0) && !(orderTypeSelect.value === 3)) {
                    var isdel = false;
                    isRowValueChanged({ i, isedit, isdel })
                }
                else if (!(i.Quantity < 0) && (i.editrowId) && !(orderTypeSelect.value === 3)) {
                    var isdel = true;
                    isRowValueChanged({ i, isedit, isdel })
                }
                else if (!(i.Quantity < 0) && !(i.editrowId) && !(orderTypeSelect.value === 3)) {
                    return
                }



                else if ((i.Quantity > 0) && (i.Rate > 0)) {//isvdc_po logic

                    if (i.Bom) {
                        if ((itemArr.length === 0)) {
                            const isdel = false;
                            isRowValueChanged({ i, isedit, isdel })

                        } else {
                            if (isVDC_POvalidMsg.length === 0)
                                isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type Of Order Only One Item Quantity Accept..." });
                        }
                    } else {
                        isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                }
                else if ((i.Quantity < 1) && (i.editrowId)) {
                    if (i.Bom) {
                        if ((itemArr.length === 0)) {
                            const isdel = true;
                            isRowValueChanged({ i, isedit, isdel })

                        } else {
                            if (isVDC_POvalidMsg.length === 0)
                                isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type of order Only One Item Quantity Accept..." });
                        }
                    } else {
                        isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                };
            }

            function isRowValueChanged({ i, isedit, isdel }) {

                const basicAmt = parseFloat(basicAmount(i))
                const cgstAmt = (GstAmount(i))

                const arr = {
                    // id: i.editrowId,
                    Item: i.Item_id,
                    Quantity: isdel ? 0 : i.Quantity,
                    MRP: i.MRP_id,
                    MRPValue: i.MRPValue,
                    Rate: i.Rate,
                    Unit: i.Unit_id,
                    BaseUnitQuantity: (Number(i.BaseUnitQuantity) * Number(i.Quantity)).toFixed(2),
                    Margin: "",
                    BasicAmount: basicAmt.toFixed(2),
                    GSTAmount: cgstAmt.toFixed(2),
                    GST: i.GST_id,
                    GSTPercentage: i.GSTPercentage,
                    CGST: (cgstAmt / 2).toFixed(2),
                    SGST: (cgstAmt / 2).toFixed(2),
                    IGST: 0,
                    CGSTPercentage: (i.GSTPercentage / 2),
                    SGSTPercentage: (i.GSTPercentage / 2),
                    IGSTPercentage: 0,
                    Amount: i.Amount,
                    IsDeleted: isedit,
                    Comment: i.Comment
                }
                itemArr.push(arr)
            };

            const termsAndCondition = await termsAndConTable.map(i => ({
                TermsAndCondition: i.value,
                IsDeleted: i.IsDeleted
            }))

            if (isVDC_POvalidMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: isVDC_POvalidMsg,
                })
                return
            };
            if (validMsg.length > 0) {
                customAlert({
                    Type: 4,
                    Message: validMsg,
                })

                return
            }
            if (itemArr.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                })

                return
            }
            if (orderTypeSelect.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Select PO Type",
                })
                return
            }
            if ((termsAndCondition.length === 0) && !(subPageMode === url.ORDER_2)
                && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
            ) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Terms And Condition",
                })
                return
            }

            const po_JsonBody = {
                OrderDate: orderdate,
                OrderAmount: orderAmount,
                OrderItem: itemArr,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
                IsConfirm: false  // PO Order then IsConfirm true
            }
            const SO_JsonBody = {
                OrderDate: orderdate,
                OrderAmount: orderAmount,
                OrderItem: itemArr,
                Customer: supplier,// swipe supllier 
                Supplier: division,// swipe Customer
                OrderType: order_Type.SaleOrder,
                IsConfirm: true   // SO Order then IsConfirm true
            }
            const IB_JsonBody = {
                DemandDate: orderdate,
                DemandAmount: orderAmount,
                DemandItem: itemArr,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
            }
            const comm_jsonBody = {
                DeliveryDate: deliverydate,
                Description: description,
                BillingAddress: billAddr.value,
                ShippingAddress: shippAddr.value,
                OrderNo: 1,
                FullOrderNumber: "PO0001",
                Division: division,
                POType: orderTypeSelect.value,
                POFromDate: orderTypeSelect.value === 1 ? currentDate_ymd : poFromDate,
                POToDate: orderTypeSelect.value === 1 ? currentDate_ymd : poToDate,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                OrderTermsAndConditions: termsAndCondition
            };


            let jsonBody;   //json body decleration 
            if (subPageMode === url.IB_ORDER) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_JsonBody });
            }
            else if (subPageMode === url.ORDER_4) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...SO_JsonBody });
            }
            else {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...po_JsonBody });
            }
            // +*********************************

            if (pageMode === mode.edit) {
                dispatch(_act.updateOrderIdAction({ jsonBody, updateId: editVal.id, gotoInvoiceMode }))

            } else {
                debugger
                dispatch(_act.saveOrderAction({ jsonBody, subPageMode, gotoInvoiceMode }))
            }

        } catch (e) { _cfunc.CommonConsole("order_save_", e) }
    }

    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    {/* {userAdminRole === 2 ?
                        <div className="px-2 mb-1 mt-n1 c_card_filter header text-black" >
                            <div className=" mt-1 mb-2 row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-3 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "115px" }}>Party</Label>
                                        <Col sm="6">
                                            <Select
                                                value={partySelect}
                                                classNamePrefix="select2-Customer"
                                                isDisabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                                options={Party_DropdownOptions}
                                                onChange={partyOnchange}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                            </div>
                        </div>
                        : null} */}

                    {userAdminRole &&
                        <PartyDropdown_Common
                            partySelect={partySelect}
                            setPartyFunc={partyOnchange} />
                    }

                    <div>
                        <div className="px-2 c_card_filter header text-black" >{/* Order Date And Supplier Name,Go_Button*/}

                            <div>
                                <Row >
                                    <Col sm="4" >
                                        <FormGroup className=" row mt-2" >
                                            <Label className="col-sm-5 p-2"
                                                style={{ width: "115px" }}>Delivery Date</Label>
                                            <Col sm="7">
                                                <C_DatePicker
                                                    name="orderdate"
                                                    value={orderdate}
                                                    disabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                                    onChange={orderdateOnchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    {(subPageMode === ORDER_4) ?
                                        <Col sm="3">
                                            <FormGroup className=" row mt-2 " >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "65px" }}>{fieldLabel.Route}</Label>
                                                <Col sm="7">

                                                    <Select
                                                        classNamePrefix="react-select"
                                                        value={routeSelect}
                                                        options={RouteOptions}
                                                        isDisabled={(orderItemTable.length > 0 || pageMode === "edit" || goBtnloading) ? true : false}
                                                        // onChange={(e) => { setRouteSelect(e) }}
                                                        onChange={(e) => { RouteOnChange(e) }}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />

                                                </Col>
                                            </FormGroup>
                                        </Col >
                                        : <Col sm='3' />
                                    }

                                    <Col sm="4" className="">
                                        <FormGroup className="row mt-2" >
                                            <Label className="col-sm-5 p-2"
                                                style={{ width: "115px" }}>{fieldLabel.Supplier}</Label>
                                            <Col sm="7">
                                                <Select
                                                    value={supplierSelect}
                                                    isDisabled={(orderItemTable.length > 0 || pageMode === "edit" || goBtnloading) ? true : false}
                                                    options={supplierOptions}
                                                    onChange={supplierOnchange}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                />
                                                {(FSSAI_Date_Is_Expired) &&
                                                    <span className="text-danger f-8">
                                                        <small>{FSSAI_Date_Is_Expired} </small>
                                                    </span>
                                                }
                                            </Col>

                                        </FormGroup>
                                    </Col>

                                    <Col sm="1">                      {/*Go_Button  */}

                                        <div className="row mt-2  pr-1">
                                            {pageMode === mode.defaultsave ?
                                                // (!selecedItemWiseOrder && itemSelectDropOptions.length > 0) ?
                                                (!goBtnDissable) ?

                                                    < Go_Button
                                                        loading={goBtnloading}
                                                        id={`go-btn${subPageMode}`}
                                                        onClick={(e) => {
                                                            if (itemSelectDropOptions.length > 0) {
                                                                goButtonHandler()
                                                            }
                                                            setSelecedItemWiseOrder(false)
                                                            setorderItemTable(itemSelectDropOptions)
                                                            setItemSelect('')
                                                            setGoBtnDissable(true)
                                                        }} />
                                                    : (!selecedItemWiseOrder) &&
                                                    <Change_Button
                                                        id={`change-btn${subPageMode}`}
                                                        onClick={(e) => {
                                                            setGoBtnDissable(false)
                                                            setSelecedItemWiseOrder(true)
                                                            setorderItemTable([])
                                                            setItemSelect('')
                                                            dispatch(_act.GoButton_For_Order_AddSuccess([]))
                                                        }}
                                                    />
                                                : null
                                            }
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col sm="4">                               {/*  Description field */}
                                        <FormGroup className="row mt-1" >
                                            <Label className="col-sm-5 p-2"
                                                style={{ width: "115px" }}>Description</Label>
                                            <div className="col-7">
                                                <Input type="text"
                                                    value={description}
                                                    placeholder='Enter Order Description'
                                                    onChange={e => setDescription(e.target.value)}
                                                />

                                            </div>

                                        </FormGroup>
                                    </Col >
                                    <Col sm="3" />
                                    <Col sm="4">
                                        <FormGroup className="row mt-1" >
                                            <Label className="col-sm-5 p-2"
                                                style={{ width: "115px" }}>{fieldLabel.Item}</Label>

                                            <Col sm="7">
                                                <Select
                                                    value={itemSelect}
                                                    isDisabled={(pageMode === "edit" || goBtnloading) ? true : false}
                                                    options={itemSelectDropOptions}
                                                    onChange={itemSelectOnchange}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                />
                                            </Col>

                                        </FormGroup>
                                    </Col>
                                    <Col sm="1"  >

                                        {pageMode === mode.defaultsave ?
                                            <div className="row mt-2 pr-1"  >
                                                {(selecedItemWiseOrder && itemSelectDropOptions.length > 0) ?
                                                    <Button

                                                        className
                                                        color="btn btn-outline-info border-1 font-size-12 "
                                                        disabled={goBtnloading}
                                                        onClick={() => item_AddButtonHandler()} >
                                                        Add Item
                                                    </Button>
                                                    :
                                                    ((itemSelectDropOptions.length > 0)) &&
                                                    <Button
                                                        color="btn btn-secondary border-1 font-size-12"
                                                        className='text-blac1k'
                                                        disabled={goBtnloading}
                                                        onClick={() => {
                                                            setorderItemTable([])
                                                            setSelecedItemWiseOrder(true)
                                                        }} >
                                                        Item Wise
                                                    </Button>

                                                }

                                            </div> : null
                                        }
                                    </Col>

                                </Row>
                            </div>

                        </div>

                        <div className="px-2  mb-1 c_card_body text-black" >              {/*  Description and Delivery Date  field */}
                            <div className="row">                                         {/*  Description and Delivery Date  field */}


                                {/*  Delivery Date field */}
                                {/* {!(subPageMode === url.IB_ORDER) ?
                                    <div className="col col-6" >
                                        <FormGroup className=" row mt-3 " >
                                            <Label className=" p-2"
                                                style={{ width: "130px" }}>Delivery Date</Label>
                                            <div className="col col-6 sm-1">
                                                <C_DatePicker
                                                    id="deliverydate"
                                                    name="deliverydate"
                                                    value={deliverydate}
                                                    disabled={pageMode === "edit" ? true : false}
                                                    onChange={(e, date) => { setdeliverydate(date) }}
                                                />
                                            </div>

                                        </FormGroup>
                                    </div > : null} */}

                            </div>

                            {subPageMode === url.ORDER_1 ? <div>                             {/*  Billing Address   and Shipping Address*/}
                                <div className="row  ">

                                    <div className="col col-6">                             {/* Billing Address */}
                                        <FormGroup className="row  " >
                                            <Label className=" p-2"
                                                style={{ width: "115px" }}>Billing Address</Label>
                                            <div className="col col-6">
                                                <Select
                                                    value={billAddr}
                                                    classNamePrefix="select2-Customer"
                                                    options={supplierAddress}
                                                    onChange={(e) => { setbillAddr(e) }}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                />
                                            </div>
                                        </FormGroup>
                                    </div >

                                    <div className="col col-6">                               {/*  Billing Shipping Address */}
                                        <FormGroup className=" row " >
                                            <Label className=" p-2"
                                                style={{ width: "130px" }}>Shipping Address</Label>
                                            <div className="col col-6">
                                                <Select
                                                    value={shippAddr}
                                                    classNamePrefix="select2-Customer"
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={supplierAddress}
                                                    onChange={(e) => { setshippAddr(e) }}
                                                />
                                            </div>
                                        </FormGroup>
                                    </div >
                                </div>

                                <div className="row" >                                        {/**PO Type  (PO From Date and PO To Date)*/}
                                    <div className="col col-6" >                              {/**PO Type */}
                                        <FormGroup className=" row  " >
                                            <Label className=" p-2"
                                                style={{ width: "115px" }}>PO Type</Label>
                                            <div className="col col-6 ">
                                                <Select
                                                    value={orderTypeSelect}
                                                    classNamePrefix="select2-Customer"
                                                    options={orderTypeOptions}
                                                    onChange={(e) => { setorderTypeSelect(e) }}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                />
                                            </div>
                                        </FormGroup>
                                    </div >
                                </div>


                                {(orderTypeSelect.label === 'Open PO') ?
                                    <div className="row" >                                    {/*PO From Date */}
                                        <div className="col col-6" >
                                            <FormGroup className=" row " >
                                                <Label className=" p-2"
                                                    style={{ width: "115px" }}>PO From Date</Label>
                                                <div className="col col-6 ">
                                                    <C_DatePicker
                                                        id="pofromdate"
                                                        name="pofromdate"
                                                        value={poFromDate}
                                                        onChange={(e, date) => { setpoFromDate(date) }}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </div >

                                        <div className="col col-6" >                        {/*PO To Date */}
                                            <FormGroup className=" row  " >
                                                <Label className=" p-2"
                                                    style={{ width: "130px" }}>PO To Date</Label>
                                                <div className="col col-6 ">
                                                    <C_DatePicker
                                                        id="potodate"
                                                        name="potodate"
                                                        value={poToDate}
                                                        onChange={(e, date) => { setpoToDate(date) }}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </div >
                                    </div> : null}
                            </div>
                                : null}

                        </div>

                    </div>

                    <div className="table-responsive table mt-n3" >

                    </div>
                    <ToolkitProvider
                        keyField={"Item_id"}
                        data={orderItemTable}
                        columns={pagesListColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField={"Item_id"}
                                                id="table_Arrow"
                                                ref={ref1}
                                                defaultSorted={defaultSorted}
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                onDataSizeChange={(e) => {
                                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>

                    <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.TermsAndConditions} tableData={orderItemTable} />

                    {
                        ((orderItemTable.length > 0) && (!isOpen_assignLink)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                            <Col>
                                <SaveButton
                                    loading={saveBtnloading}
                                    editCreatedBy={editCreatedBy}
                                    pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    onClick={saveHandeller}
                                    forceDisabled={gotoInvoiceBtnLoading}
                                />
                            </Col>
                            {
                                (subPageMode === url.ORDER_4) && (pageMode === mode.defaultsave) ?
                                    <Col>
                                        <GotoInvoiceBtn
                                            forceDisabled={gotoInvoiceBtnLoading}
                                            loading={gotoInvoiceBtnLoading}
                                            pageMode={pageMode}
                                            userAcc={userPageAccessState}
                                            onClick={saveHandeller}
                                        />
                                    </Col> : null}
                        </div>
                            : <div className="row save1"></div>
                    }
                </div >

                <Modal
                    isOpen={isOpen_assignLink}
                    toggle={() => {
                        setisOpen_assignLink(false)
                    }}
                    size="xl"
                >

                    <PartyItems
                        editValue={assingItemData.Data}
                        isAssing={true}
                        masterPath={url.PARTYITEM}
                        redirectPath={subPageMode}
                        isOpenModal={Open_Assign_func}
                        pageMode={mode.assingLink}
                    />

                </Modal>

            </React.Fragment >
        )
    } else {
        return null
    }

}

export default Order
