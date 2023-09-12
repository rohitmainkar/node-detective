import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,

} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, post_Send_to_superStockiest_Id_Succcess, saveSalesReturnMaster, saveSalesReturnMaster_Success } from "../../../store/actions";
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
import { mode, pageId, url } from "../../../routes/index"
import { GetVenderSupplierCustomer, } from "../../../store/CommonAPI/SupplierRedux/actions";
import "../../Sale/SalesReturn/salesReturn.scss";
import { CInput, C_DatePicker, C_Select, decimalRegx } from "../../../CustomValidateForm/index";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { SaveButton } from "../../../components/Common/CommonButton";
import { return_discountCalculate_Func } from "../../Sale/SalesReturn/SalesCalculation";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const PurchaseReturnMode3 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname)
    const [tableData, setTableData] = useState([]);
    const [returnItemIDs, setReturnItemIDs] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        sendToSSbtnTableData,
        saveBtnloading,
        postMsg,
        supplier,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        sendToSSbtnTableData: state.SalesReturnReducer.sendToSSbtnTableData,
        supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
        postMsg: state.SalesReturnReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        if (sendToSSbtnTableData.Status === true) {

            const { Data = [] } = sendToSSbtnTableData;

            let grand_total = 0;
            const UpdatedTableData = Data.map((item, index) => {
                const calculate = return_discountCalculate_Func(item);

                item["roundedTotalAmount"] = calculate.roundedTotalAmount
                grand_total += Number(calculate.roundedTotalAmount);

                return {
                    ...item, id: index + 1,
                    salesQuantity: item.Quantity,
                    Quantity: item.ApprovedQuantity,
                    tableBatchDate: _cfunc.date_dmy_func(item.BatchDate)
                };
            });

            setTableData(UpdatedTableData);
            let count_label = `${"Total Amount"} :${_cfunc.amountCommaSeparateFunc(grand_total)}`
            dispatch(BreadcrumbShowCountlabel(count_label))
            dispatch(post_Send_to_superStockiest_Id_Succcess({ Status: false }))
            setReturnItemIDs(sendToSSbtnTableData.ReturnItemID)
        }

    }, []);

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PURCHASE_RETURN_MODE_3))
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
    }, []);

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

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))

            setState(() => resetFunction(fileds, state))// Clear form values  
            await customAlert({
                Type: 1,
                Message: postMsg.Message,
            })
            history.push({ pathname: url.PURCHASE_RETURN_LIST })
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    function QuantityHandler(event, row, tableData) {

        let input = event.target.value

        let v1 = Number(row.salesQuantity);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.Quantity = input;
        totalAmountCalcuationFunc(row, tableData)
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            headerStyle: () => {
                return { width: '150px', textAlign: 'center' };
            }
        },

        {
            text: "Quantity",
            dataField: "",
            classes: () => "sales-discount-row",
            hidden: false,
            formatExtraData: { tableData },
            formatter: (cell, row, key, { tableData }) => {
                return (
                    <div className="parent" >
                        <div className="child" style={{ minWidth: "100px" }}>
                            <CInput
                                defaultValue={row.Quantity}
                                autoComplete="off"
                                disabled={true}
                                type="text"
                                cpattern={decimalRegx}
                                className="col col-sm text-end"
                                onChange={(event) => {
                                    QuantityHandler(event, row, tableData)
                                }}
                            />
                        </div>

                    </div>
                )
            },
            headerStyle: () => {
                return { width: '120px', textAlign: 'center' };
            }
        },

        {
            text: "Unit",
            dataField: "UnitName",
            headerStyle: () => {
                return { width: '80px', textAlign: 'center' };
            }
        },

        {
            text: "MRP",
            dataField: "MRPValue",
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`MRPValue${k}`}
                            key={`MRPValue${row.id}`}
                            disabled={true}
                            className="text-end"
                            defaultValue={row.MRPValue}
                            autoComplete="off"
                            onChange={(e) => { row["MRPValue"] = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "Basic Rate",
            dataField: "",
            formatExtraData: { tableData },
            formatter: (cellContent, row, key, { tableData }) => {

                return (
                    <span >
                        <CInput
                            defaultValue={row.Rate}
                            id={`Rate-${key}-${row.id}`}//this id use discount type onchange
                            // placeholder="Enter Rate"
                            type="text"
                            disabled={true}
                            cpattern={decimalRegx}
                            className="text-end"
                            onChange={(event) => {
                                row.Rate = event.target.value
                                totalAmountCalcuationFunc(row, tableData)
                            }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {
            text: "BatchDate",
            dataField: "tableBatchDate",
        },
        {
            text: "BatchCode",
            dataField: "BatchCode",
        },

        {
            text: "Reason",
            dataField: "ItemReasonName",
        },

        {
            text: "Comment",
            dataField: "ItemComment",
        },
    ];

    const totalAmountCalcuationFunc = (row, TablelistArray = []) => {

        const caculate = return_discountCalculate_Func(row)
        row.roundedTotalAmount = caculate.roundedTotalAmount;

        let sumOfGrandTotal = TablelistArray.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]) || 0, 0);
        let count_label = `${"Total Amount"} :${_cfunc.amountCommaSeparateFunc(sumOfGrandTotal)}`
        dispatch(BreadcrumbShowCountlabel(count_label))
    }

    const ReturnDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;
        let grand_total = 0;

        if (values.Customer === "") {
            customAlert({
                Type: 4,
                Message: "Please Select Supplier",
            });
            return;
        }
        const PurchaseReturnReferences = returnItemIDs
            .split(",")
            .map(item => ({ SubReturn: parseInt(item.trim()) }));
        const formData = new FormData(); // Create a new FormData object

        const ReturnItems = tableData.reduce((filterdItem, i) => {

            if (Number(i.Quantity) > 0) {
                const calculate = return_discountCalculate_Func(i);

                grand_total += Number(calculate.roundedTotalAmount);

                filterdItem.push({
                    "Item": i.Item,
                    "Quantity": i.Quantity,
                    "Unit": i.Unit,
                    "BaseUnitQuantity": i.BaseUnitQuantity,
                    "BatchCode": i.BatchCode,
                    "BatchDate": i.BatchDate,
                    "BatchID": 1,
                    "MRP": i.MRP,
                    "MRPValue": i.MRPValue,
                    "Rate": i.Rate,
                    "GST": i.GST,
                    "ItemReason": i.ItemReason,
                    "Comment": i.ItemComment,
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
                    "DiscountType": calculate.discountType,
                    "Discount": calculate.discount,
                    "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
                    "PurchaseReturn": i.PurchaseReturn,
                    "SubReturn": i.PurchaseReturn,
                    "primarySourceID": i.primarySourceID,
                    "ReturnItemImages": [],
                });
            }
            return filterdItem
        }, [])

        try {

            formData.append('ReturnDate', values.ReturnDate);
            formData.append('ReturnReason', '');
            formData.append('BatchCode', values.BatchCode);
            formData.append('Customer', _cfunc.loginPartyID());
            formData.append('Party', values.Customer.value);
            formData.append('Comment', values.Comment);
            formData.append('GrandTotal', grand_total.toFixed(2));
            formData.append('RoundOffAmount', (grand_total - Math.trunc(grand_total)).toFixed(2))
            formData.append('CreatedBy', _cfunc.loginUserID());
            formData.append('UpdatedBy', _cfunc.loginUserID());
            formData.append('Mode', 3);
            formData.append('IsApproved', 1);
            formData.append('PurchaseReturnReferences', JSON.stringify(PurchaseReturnReferences)); // Convert to JSON string
            formData.append('ReturnItems', JSON.stringify(ReturnItems)); // Convert to JSON strin

            dispatch(saveSalesReturnMaster({ formData, btnId }));

        } catch (e) { _cfunc.CommonConsole(e) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

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
                            </Row>

                            <Row>
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
                                                options={supplierOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }

                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
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

                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={tableData}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Record Not available
                                                            </div>
                                                        }
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
                                                        {...toolkitProps.baseProps}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                    </form >

                    {
                        tableData.length > 0 ?
                            <div >
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"} >
                                        <SaveButton
                                            pageMode={mode.modeSTPsave}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"SalesReturn"}
                                        />

                                    </Col>
                                </FormGroup >
                            </div>
                            : null
                    }

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

export default PurchaseReturnMode3





