import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button,
    Table,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, C_Button, SaveButton, } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { saveSalesReturnMaster, InvoiceNumber, InvoiceNumberSuccess, saveSalesReturnMaster_Success, SalesReturnAddBtn_Action, SalesReturnAddBtn_Action_Succcess } from "../../../store/Sales/SalesReturnRedux/action";
import "./purchaseReturn.scss";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { getpartyItemList } from "../../../store/Administrator/PartyItemsRedux/action";
import { innerStockCaculation, returnQtyOnChange, return_discountCalculate_Func, stockQtyOnChange } from "./PurchaseReturnCalculation";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Tbody, Thead } from "react-super-responsive-table";

const PurchaseReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        ItemName: "",
        InvoiceNumber: "",
        BatchCode: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [TableArr, setTableArr] = useState([]);
    const [returnMode, setReturnMode] = useState(0); //(1==ItemWise) OR (2==invoiceWise)
    const [imageTable, setImageTable] = useState([]);

    // for invoicer page heder dicount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)
    const [forceReload, setForceReload] = useState(false)
    // ****************************************************************************



    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ItemList,
        ReturnReasonList,
        InvoiceNo,
        pageField,
        userAccess,
        supplier,
        addButtonData,
        saveBtnloading,
        addBtnLoading,
        invoiceNoDropDownLoading,
    } = useSelector((state) => ({
        addButtonData: state.SalesReturnReducer.addButtonData,
        postMsg: state.SalesReturnReducer.postMsg,
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        ItemList: state.PartyItemsReducer.partyItem,
        ReturnReasonList: state.PartyMasterBulkUpdateReducer.SelectField,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        addBtnLoading: state.SalesReturnReducer.addBtnLoading,
        invoiceNoDropDownLoading: state.SalesReturnReducer.invoiceNoDropDownLoading,

    }));

    useEffect(() => {
        dispatch(InvoiceNumberSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PURCHASE_RETURN))
        dispatch(getpartyItemList(JSON.stringify(_cfunc.loginJsonBody())))
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.PURCHASE_RETURN, RouteID: "" }))
        dispatch(BreadcrumbShowCountlabel(`${"Total Amount"} :${0}`))
    }, []);

    useEffect(() => {
        if (TableArr.length === 0) {
            setReturnMode(0)
        }
    }, [TableArr]);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;


    useEffect(() => {// userAccess useEffect
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

    useEffect(() => {// Return Reason dropdown Values
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 8
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            setTableArr([])
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let alterRepont = customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (alterRepont) {
                    history.push({ pathname: url.PURCHASE_RETURN_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {

        if (addButtonData.StatusCode === 200 && addButtonData.Status === true) {
            dispatch(SalesReturnAddBtn_Action_Succcess({ StatusCode: false }))
            try {
                const updateItemArr = [...TableArr];
                let existingIds = updateItemArr.map(item => item.id);
                let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

                addButtonData.Data.forEach((i) => {
                    const MRPOptions = i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP, Rate: i.Rate }));
                    const GSTOptions = i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST }));

                    const highestMRP = i.ItemMRPDetails.reduce((prev, current) => {// Default highest GST when Return mode "2==ItemWise"
                        return (prev.MRP > current.MRP) ? prev : current;
                    }, '');

                    const highestGST = i.ItemGSTDetails.reduce((prev, current) => {// Default  highest GST when Return mode "2==ItemWise"
                        return (prev.GST > current.GST) ? prev : current;
                    }, '');

                    if (returnMode === 2) { //(returnMode === 2) ItemWise
                        i.Rate = highestMRP.Rate || "";
                        i.MRP = highestMRP.MRP || "";
                        i.MRPValue = highestMRP.MRPValue || "";

                        i.GST = highestGST.GST || "";
                        i.GSTPercentage = highestGST.GSTPercentage || "";
                    }

                    let ItemTotalStock = i.StockDetails.reduce((accumulator, currentObject) => accumulator + Number(currentObject["BaseUnitQuantity"]) || 0, 0);
                    const InvoiceQuantity = i.Quantity

                    const newItemRow = {
                        ...i,
                        Quantity: '',
                        itemTotalAmount: 0,
                        InvoiceQuantity,
                        ItemTotalStock,
                        id: nextId,
                        MRPOptions,
                        GSTOptions,
                    }
                    // const caculate = return_discountCalculate_Func(newItemRow)
                    // newItemRow["roundedTotalAmount"] = caculate.roundedTotalAmount;

                    updateItemArr.push(newItemRow);
                    nextId++;
                });

                // let sumOfGrandTotal = updateItemArr.reduce((accumulator, currentObject) => accumulator + Number(currentObject["itemTotalAmount"]) || 0, 0);
                // let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
                // dispatch(BreadcrumbShowCountlabel(count_label));

                setTableArr(updateItemArr);
                setState((i) => {
                    let a = { ...i }
                    a.values.ItemName = ""
                    a.hasValid.ItemName.valid = true;
                    return a
                })

            } catch (error) { _cfunc.CommonConsole(error) }
        }
    }, [addButtonData])

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    const ReturnReasonOptions = ReturnReasonList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            hidden: false,
            formatter: (cell, row) => {
                return (
                    <Label style={{ minWidth: "15%" }}>{row.ItemName}</Label>
                )
            }
        },

        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: TableArr },
            // classes: () => ('invoice-quantity-row1'),
            formatter: (cellContent, index1, _key, { tableList = [] }) => (
                <>
                    <div className="div-1 mb-2" >
                        <CInput
                            type="text"
                            cpattern={decimalRegx}
                            disabled={pageMode === 'edit' ? true : false}
                            id={`returnQty-${index1.id}-${_key}`}
                            className="input"
                            style={{ textAlign: "right" }}
                            key={index1.id}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => {
                                returnQtyOnChange(event, index1, _key);
                                totalAmountCalcuationFunc(tableList);
                            }}
                        />
                    </div>
                    <div className="div-1 ">
                        <div>
                            <Input
                                disabled
                                defaultValue={index1.UnitName}
                            ></Input>
                        </div>
                    </div>
                    {/* <div className="bottom-div">
                        <span>Order-Qty :</span>
                        <samp>{index1.OrderQty}</samp>
                        <samp>{index1.UnitName}</samp>
                    </div> */}
                </>
            ),
        },
        {
            text: "Invoice Qty",
            hidden: (returnMode === 1) ? false : true,
            align: () => "right",
            formatter: (cell, row) => <Label>{row.InvoiceQuantity}</Label>,
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            formatExtraData: { tableList: TableArr },
            formatter: (cellContent, index1, _key, { tableList }) => (
                <div>
                    <Table className="table table-responsive mb-1">
                        <Thead>
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
                                <th style={{ zIndex: -1 }}>Basic Rate</th>
                                <th style={{ zIndex: -1 }}>MRP</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {cellContent.map((index2) => (
                                <tr key={index1.id}>
                                    <td>
                                        <div style={{}}>{index2.BatchCode}</div>
                                    </td>
                                    <td>
                                        <div style={{ textAlign: "right" }}>
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.BaseUnitQuantity}</samp>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{}}>
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                disabled={pageMode === 'edit' ? true : false}
                                                style={{ textAlign: "right" }}
                                                id={`batchQty${index1.id}-${index2.id}-${_key}`}
                                                defaultValue={index2.Qty}
                                                onChange={(event) => {
                                                    stockQtyOnChange(event, index1, index2, _key);
                                                    totalAmountCalcuationFunc(tableList);
                                                }}
                                            ></Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>
                                            <span id={`stockItemRate-${index1.id}-${index2.id}`}>{_cfunc.amountCommaSeparateFunc(index2.Rate)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>{index2.MRP}</div>
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
                tableList: TableArr
            },
            classes: () => "invoice-discount-row",
            headerFormatter: () => {
                return (
                    <div className="">
                        {TableArr.length <= 0 ?
                            <div className="col col-3 mt-2">
                                <Label>Discount/unit</Label>
                            </div>
                            :
                            <div className="row">
                                <div className=" mt-n2 mb-n2">
                                    <Label>Discount/unit</Label>
                                </div>
                                <div className="col col-6" >
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
                                <div className="col col-6" >
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
            formatter: (cellContent, index1, _key, formatExtraData) => {
                let { tableList, discountValueAll, discountTypeAll } = formatExtraData;
                
                if (formatExtraData.changeAllDiscount) {
                    index1.Discount = discountValueAll;
                    index1.DiscountType = discountTypeAll.value;
                    innerStockCaculation(index1, _key);
                    totalAmountCalcuationFunc(tableList);
                }
                if (!index1.DiscountType) { index1["DiscountType"] = discountTypeAll.value }

                const defaultDiscountTypelabel =
                    index1.DiscountType === 1 ? discountDropOption[0] : discountDropOption[1];

                return (
                    <>
                        <div className="mb-2">
                            <div className="parent">
                                <div className="child">
                                    <label className="label">Type&nbsp;&nbsp;&nbsp;</label>
                                </div>
                                <div className="child">
                                    <Select
                                        // id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        // key={`DicountType_${key}-${index1.id}`}
                                        value={defaultDiscountTypelabel}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                            innerStockCaculation(index1, _key);
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
                                        // id={`Dicount_${key}-${index1.id}`}
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
                            <div>Amount:</div>
                            <div id={`itemTotalAmount-${index1.id}-${_key}`}>
                                {_cfunc.amountCommaSeparateFunc(index1.itemTotalAmount)}
                            </div>
                        </div>
                    </>
                );
            },
        },

        {
            text: "Return Reason",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row) => {
                return (<>
                    <div className="parent mb-1">
                        <div className="child">
                            <Select
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                defaultValue={row.defaultReason}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                                options={ReturnReasonOptions}
                                onChange={event => {

                                    row["defaultReason"] = event
                                }}
                            />
                        </div>
                    </div>
                    <div className="parent">
                        <div className="child">
                            <Input
                                placeholder="Enter Comment"
                                defaultChecked={row.ItemComment}
                                type="text"
                                onChange={(event) => { row.ItemComment = event.target.value }}
                            />
                        </div>
                    </div>
                </>
                )
            }
        },

        {
            text: "Image",
            dataField: "",
            classes: () => "sales-return-Image-row",
            formatter: (cellContent, row, key) => {
                return (<span style={{ justifyContent: 'center' }}>
                    <div>
                        <div className="btn-group btn-group-example mb-3" role="group">
                            <Input
                                type="file"
                                className="form-control "
                                name="image"
                                id="file"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onChange={(event) => { imageSelectHandler(event, row) }}
                            />
                            <button name="image"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onClick={() => { imageShowHandler(row) }}
                                id="ImageId" type="button" className="btn btn-primary ">Show</button>
                        </div>
                    </div>


                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            hidden: returnMode === 1 ? true : false,
            formatExtraData: { TableArr, addBtnLoading },
            formatter: (cellContent, row, key, { TableArr, addBtnLoading }) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    disabled={addBtnLoading}
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row, TableArr) }}>
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    const totalAmountCalcuationFunc = (tableList = []) => {

        let sumOfGrandTotal = tableList.reduce((accumulator, currentObject) => accumulator + Number(currentObject["itemTotalAmount"]) || 0, 0);
        let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
        dispatch(BreadcrumbShowCountlabel(count_label))
    }

    const deleteButtonAction = (row, TablelistArray = []) => {
        const newArr = TablelistArray.filter((index) => !(index.id === row.id))
        let sumOfGrandTotal = newArr.reduce((accumulator, currentObject) => accumulator + Number(currentObject["itemTotalAmount"]) || 0, 0);
        let count_label = `${"Total Amount"} :${Number(sumOfGrandTotal).toLocaleString()}`
        dispatch(BreadcrumbShowCountlabel(count_label));
        setTableArr(newArr)
    }

    const ReturnDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const AddPartyHandler = async (byType) => {

        const invalidMsg1 = []
        if ((values.ItemName === '') && (byType === 'ItemWise')) {
            invalidMsg1.push(`Select Item Name`)
        }
        if ((values.InvoiceNumber === '') && (values.Customer === '') && (byType === 'InvoiceWise')) {
            invalidMsg1.push(`Select ${fieldLabel.Customer}.`)
        }
        else if ((values.InvoiceNumber === '') && (byType === 'InvoiceWise')) {
            invalidMsg1.push(`Select Invoice No.`)
        }

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return
        }

        const jsonBody = JSON.stringify({
            "ItemID": values.ItemName.value,
            "BatchCode": values.BatchCode,
            "Customer": _cfunc.loginPartyID()// Customer Swipe when Po return
        })

        const InvoiceId = values.InvoiceNumber ? values.InvoiceNumber.value : ''
        const nrwReturnMode = (byType === 'ItemWise') ? 2 : 1 //(returnMode === 2) ItemWise
        dispatch(SalesReturnAddBtn_Action({ jsonBody, InvoiceId, returnMode: nrwReturnMode }))
        setReturnMode(nrwReturnMode)
    }

    const RetailerHandler = (event) => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.values.Customer = event

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;

            return a
        })
        setTableArr([])

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    const RetailerOnCancelClickHandler = () => {
        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.values.Customer = ''

            a.hasValid.Customer.valid = true;
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
            return a
        })
        setTableArr([])
    }

    const itemNameOnChangeHandler = (hasSelect, evn) => {
        if (values.Customer === "") {
            customAlert({ Type: 3, Message: `Please select ${fieldLabel.Customer}` })
            return
        }
        onChangeSelect({ hasSelect, evn, state, setState, })
        setReturnMode(2)
    }

    const imageSelectHandler = async (event, row) => { // image onchange handler

        const file = event.target.files[0]
        const base64 = await convertBase64(file);
        let ImageUpload = base64
        row.Image = ImageUpload
        setImageTable(ImageUpload)
    }

    const convertBase64 = (file) => {// image convert in string
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    const imageShowHandler = (row) => {

        var x = document.getElementById("add-img");
        if (x.style.display === "none") {
            x.src = imageTable
            if (imageTable != "") {
                x.style.display = "block";
            }

        } else {
            x.style.display = "none";
        }
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        try {

            const invalidMessages = [];

            const filterData = TableArr.filter((index) => {
                if (index.Quantity > 0) {
                    let msgString = ' Select';

                    if (index.StockInValid) {
                        invalidMessages.push(`${index.ItemName}:${index.StockInvalidMsg}`);
                        return
                    };

                    if (!index.defaultReason) { msgString = msgString + ', ' + "Return Reason" };

                    if (!index.defaultReason) {
                        invalidMessages.push({ [index.ItemName]: msgString });
                    }
                    return true
                }
            });

            if (invalidMessages.length > 0) {
                customAlert({
                    Type: 4,
                    Message: invalidMessages,
                });
                return;
            }

            if (filterData.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Item Quantity",
                });
                return;
            }

            // IsComparGstIn= compare Supplier and Customer are Same State by GSTIn Number
            const IsComparGstIn = { GSTIn_1: values.Customer.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() }

            const { processedItems, grandTotal } = filterData.reduce(({ processedItems, grandTotal }, index) => {

                index.StockDetails.forEach((ele) => {
                    if (ele.Qty > 0) {
                        //**calculate Amount, Discount Amount based on Discount type */
                        const calculate = return_discountCalculate_Func(ele, index, IsComparGstIn);

                        grandTotal += Number(calculate.roundedTotalAmount)
                        processedItems.push({
                            "Item": index.Item,
                            "ItemName": index.ItemName,
                            "Unit": index.Unit,
                            "BatchCode": ele.BatchCode,
                            "Quantity": Number(ele.Qty).toFixed(3),
                            "BatchDate": ele.BatchDate,
                            "BatchID": ele.id,
                            "BaseUnitQuantity": Number(ele.BaseUnitQuantity).toFixed(3),
                            "LiveBatch": ele.LiveBatche,
                            "MRP": ele.LiveBatcheMRPID,
                            "MRPValue": ele.MRP, //changes
                            "Rate": Number(ele.Rate).toFixed(2),

                            "GST": ele.LiveBatcheGSTID,
                            "CGST": Number(calculate.CGST_Amount).toFixed(2),
                            "SGST": Number(calculate.SGST_Amount).toFixed(2),
                            "IGST": Number(calculate.IGST_Amount).toFixed(2),

                            "GSTPercentage": calculate.GST_Percentage,
                            "CGSTPercentage": calculate.CGST_Percentage,
                            "SGSTPercentage": calculate.SGST_Percentage,
                            "IGSTPercentage": calculate.IGST_Percentage,

                            "BasicAmount": Number(calculate.discountBaseAmt).toFixed(2),
                            "GSTAmount": Number(calculate.roundedGstAmount).toFixed(2),
                            "Amount": Number(calculate.roundedTotalAmount).toFixed(2),

                            "TaxType": 'GST',
                            "DiscountType": index.DiscountType,
                            "Discount": Number(index.Discount) || 0,
                            "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),

                            "ItemReason": index.defaultReason ? index.defaultReason.value : "",
                            "Comment": index.ItemComment,
                            "ApprovedQuantity": "",
                            "PurchaseReturn": "",
                            "SubReturn": "",
                            "ReturnItemImages": [],
                        });
                    }
                });
                return { processedItems, grandTotal };
            }, { processedItems: [], grandTotal: 0 });


            const jsonBody = JSON.stringify({
                ReturnDate: values.ReturnDate,
                ReturnReason: '',
                BatchCode: values.BatchCode,
                Customer: _cfunc.loginPartyID(),// Customer Swipe when Po return
                Party: values.Customer.value,// Party Swipe when Po return
                Comment: values.Comment,
                GrandTotal: Number(grandTotal).toFixed(2),
                RoundOffAmount: (grandTotal - Math.trunc(grandTotal)).toFixed(2),
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                Mode: 2, //if puchase return then mode= 2 AND |Sale return then Mode =1
                ReturnItems: processedItems,
                PurchaseReturnReferences: [],
            });

            dispatch(saveSalesReturnMaster({ jsonBody }));

        } catch (e) { _cfunc.CommonConsole(e) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >
                            {/* < img id='add-img' className='abc1' src={''} style={{ top: "400px" }} /> */}

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReturnDate'
                                                value={values.ReturnDate}
                                                onChange={ReturnDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                isDisabled={((TableArr.length > 0) || addBtnLoading) ? true : false}
                                                options={supplierOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={RetailerHandler}
                                                onCancelClick={RetailerOnCancelClickHandler}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isDisabled={(returnMode === 1) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={itemNameOnChangeHandler}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Enter Comment"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback">{isError.Comment}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BatchCode}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="BatchCode"
                                                value={values.BatchCode}
                                                placeholder="Enter BatchCode"
                                                type='text'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.BatchCode.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.BatchCode}</small></span>
                                            )}

                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                (!(returnMode === 1)) &&///(returnMode === 1) InvoiceWise
                                                <C_Button
                                                    type="button"
                                                    loading={addBtnLoading}
                                                    className="btn btn-outline-primary border-1 font-size-12 text-center"
                                                    onClick={() => AddPartyHandler("ItemWise")}>
                                                    Add
                                                </C_Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.InvoiceNumber}</Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="InvoiceNumber "
                                                name="InvoiceNumber"
                                                value={values.InvoiceNumber}
                                                //(returnMode === 2) ItemWise
                                                isDisabled={((returnMode === 2) || invoiceNoDropDownLoading || (TableArr.length > 0)) ? true : false}
                                                isSearchable={true}
                                                isLoading={invoiceNoDropDownLoading}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setReturnMode(1)
                                                }}
                                            />

                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1 ">
                                            {((TableArr.length > 0) || (!(values.ItemName === ""))) ?
                                                <Change_Button
                                                    forceDisabled={addBtnLoading}
                                                    onClick={(e) => {
                                                        setTableArr([])
                                                        setState((i) => {
                                                            let a = { ...i }
                                                            a.values.ItemName = ""
                                                            a.values.InvoiceNumber = ""
                                                            return a
                                                        })
                                                    }} />
                                                :
                                                (!(returnMode === 2)) &&//(returnMode === 2) ItemWise
                                                <C_Button
                                                    type="button"
                                                    loading={addBtnLoading}
                                                    className="btn btn-outline-primary border-1 font-size-12 text-center"
                                                    onClick={() => AddPartyHandler("InvoiceWise")}>
                                                    Select
                                                </C_Button>
                                            }
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>
                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={TableArr}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "60vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        key={`table-key-${returnMode}`}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
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
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton
                                            pageMode={pageMode}
                                            forceDisabled={addBtnLoading}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"SalesReturn"}
                                        />
                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PurchaseReturn