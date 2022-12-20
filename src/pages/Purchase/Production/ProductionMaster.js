import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";


import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import { useHistory } from "react-router-dom";
import {
    editOrderIdSuccess,
    goButton,
    goButtonSuccess,
    updateOrderIdSuccess
} from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplierAddress } from "../../../store/CommonAPI/SupplierRedux/actions"
import { AlertState, BreadcrumbFilterSize, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { basicAmount, GstAmount, handleKeyDown, Amount } from "../Order/OrderPageCalulation";
import '../../Order/div.css'

import { GRN_lIST, ORDER_lIST } from "../../../routes/route_url";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";

import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { editGRNId, getGRN_itemMode2_Success, postGRN, postGRNSuccess } from "../../../store/Purchase/GRNRedux/actions";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { createdBy, currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeDate, onChangeSelect, onChangeText } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { post_Production, post_ProductionSuccess, update_ProductionId, update_ProductionIdSuccess } from "../../../store/Purchase/ProductionRedux/actions";

let description = ''
let editVal = {}
let initialTableData = []
const ProductionMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    //Access redux store Data /  'save_ModuleSuccess' action data
    // const [grnDate, setgrnDate] = useState(currentDate);
    // const [invoiceDate, setInvoiceDate] = useState(currentDate);
    const initialFiled = {
        ProductionDate: "",
        EstimatedQuantity: "",
        NumberOfLot: "",
        ActualQuantity: "",
        BatchDate: "",
        BatchCode: "",
        StoreLocation: "",
        SupplierBatchCode: "",
        BestBefore: "",
        Remark: "",
        Item: "",
    }
    const [state, setState] = useState(initialFiledFunc(initialFiled))
    useEffect(() => {
        // dispatch(getSupplier())
        dispatch(getSupplierAddress())
    }, [])
    const {
        items,
        postMsg,
        userAccess,
        updateMsg,
        supplierAddress,
        pageField
    } = useSelector((state) => ({
        supplierAddress: state.SupplierReducer.supplierAddress,
        items: state.WorkOrderReducer.BOMList,
        postMsg: state.ProductionReducer.postMsg,
        updateMsg: state.ProductionReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));
    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(77))
        // dispatch(getItemList())
        // dispatch(getBaseUnit_ForDropDown());
    }, []);
    const values = { ...state.values }
    const { isError } = state;
    // const { fieldLabel } = state;
    const { fieldLabel } = state;
    // userAccess useEffect
    useEffect(() => {
        debugger
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserPageAccessState(userAcc)
        };
    }, [userAccess])

    // useEffect(() => {
    //     if ((hasShowloction || hasShowModal)) {
    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }
    //         if (hasEditVal) {
    //             console.log("hasEditVal", hasEditVal)
    //             setEditData(hasEditVal);
    //             const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }
    //             hasValid.id.valid = true;
    //             hasValid.BomDate.valid = true;
    //             hasValid.ItemName.valid = true;
    //             hasValid.UnitName.valid = true;
    //             hasValid.EstimatedOutputQty.valid = true;
    //             hasValid.Comment.valid = true;
    //             hasValid.IsActive.valid = true;
    //             values.ProductionDate = ProductionDate
    //             values.EstimatedQuantity = EstimatedQuantity;
    //             values.ActualQuantity = ActualQuantity;
    //             values.Remark = Remark;
    //             values.IsActive = IsActive;
    //             values.ItemName = { label: ItemName, value: Item };
    //             values.UnitName = { label: UnitName, value: Unit };
    //             setItemTabDetails(hasEditVal.BOMItems)
    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(editBOMListSuccess({ Status: false }))
    //             dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
    //         }
    //     }
    // }, [])
    const ItemDropdown_Options = items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        Quantity: index.Quantity,
        WorkOrderId: index.id,
        Item: index.Item,
        BomID: index.Bom,
        Unit: index.Unit
    }));
    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")
    // useEffect(() => {
    //     if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
    //         setbillAddr(supplierAddress[0]);
    //         setshippAddr(supplierAddress[0]);
    //     }
    // }, [supplierAddress])
    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(post_ProductionSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: postMsg.Message,
                RedirectPath: GRN_lIST,
            }))
        } else if (postMsg.Status === true) {
            dispatch(post_ProductionSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])
    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            history.push({
                pathname: ORDER_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(update_ProductionIdSuccess({ Status: false }));
            dispatch(
                AlertState({
                    Type: 3,
                    Status: true,
                    Message: JSON.stringify(updateMsg.Message),
                })
            );
        }
    }, [updateMsg, modalCss])
    useEffect(() => {
        debugger
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])
    const formSubmitHandler = ({ event, mode = false }) => {
        debugger
        event.preventDefault();
        // if (formValid(state, setState)) {
        // let BOMrefID = 0
        // if ((pageMode === 'edit') && mode) {
        //     BOMrefID = EditData.id
        // };
        const jsonBody = JSON.stringify({
            
                MaterialIssue: 1,
              
            ProductionDate: values.ProductionDate,
            EstimatedQuantity: values.EstimatedQuantity,
            NumberOfLot: 1,
            ActualQuantity: values.ActualQuantity,
            BatchDate: "2022-12-17",
            BatchCode: "aa",
            StoreLocation: "aa",
            SupplierBatchCode: values.SupplierBatchCode,
            BestBefore: values.BestBefore,
            Remark: values.Remark,
            CreatedBy: 1,
            Item: values.Item.Item,
            UpdatedBy: 1,
            Company: 1,
            Division: 4,
            GST: 8,
            Unit: 45,
            MRP: " ",
            Rate: 55,
        });
        // if ((pageMode === 'edit') && !mode) {
        //     dispatch(update_ProductionId(jsonBody));
        // }
        // else
        //  {
        dispatch(post_Production(jsonBody));
        // }
        // }
    };
    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>
                    <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" >
                    <Breadcrumb
                        pageHeading={userPageAccessState.PageHeading}
                        showCount={true}
                    />
                    <form onSubmit={(event) => formSubmitHandler({ event })} noValidate>
                        <div className="px-2 mb-1  c_card_header " style={{ marginTop: "-15px" }} >
                            <Row>
                                <Col sm={5}>
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ProductionDate}</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="ProductionDate"
                                                value={values.ProductionDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === "edit" ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: pageMode === "edit" ? values.ProductionDate : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className=" row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.EstimatedQuantity} </Label>
                                        <Col md="7">
                                            < Input
                                                name="EstimatedQuantity"
                                                type="text"
                                                value={values.EstimatedQuantity}
                                                // className={isError.EstimatedOutputQty.length > 0 ? "is-invalid form-control" : "form-control"}
                                                style={{ backgroundColor: "white" }}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    {/* <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>BatchCode</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            // disabled={true}
                                            value={grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup> */}
                                    {/* <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Store location</Label>
                                    <Col md="7">
                                        <Select
                                        />
                                    </Col>
                                </FormGroup> */}
                                    <FormGroup className=" row " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.Remark}</Label>
                                        <Col sm="7">
                                            <Input
                                                type="text"
                                                name="Remark"
                                                value={values.Remark}
                                                placeholder="Enter Remark"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className=" row" >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.BestBefore}</Label>
                                        <Col md="7">
                                            <Flatpickr
                                                name="BestBefore"
                                                value={values.BestBefore}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === "edit" ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: pageMode === "edit" ? values.BestBefore : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm={5}>
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.Item}</Label>
                                        <Col md="7">
                                            <Select
                                                name="Item"
                                                value={values.Item}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemDropdown_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    //  Items_Dropdown_Handler(hasSelect);
                                                    //  dispatch(Breadcrumb_inputName(hasSelect.label))
                                                }
                                                }
                                            />
                                            {isError.Item.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Item}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row  " >
                                        <Label className="col-sm-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.ActualQuantity}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="ActualQuantity"
                                                value={values.ActualQuantity}
                                                placeholder="Enter ActualQuantity"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                    {/*
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>BatchDate</Label>
                                    <Col md="7">
                                        <Flatpickr
                                            name="grndate"
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                                defaultDate: "today"
                                            }}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                            onReady={(e, date) => { setgrnDate(date); }}
                                        />
                                    </Col>
                                </FormGroup> */}
                                    <FormGroup className="mb-2 row  " >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "170px" }}>{fieldLabel.SupplierBatchCode}</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                name="SupplierBatchCode"
                                                value={values.SupplierBatchCode}
                                                placeholder="Enter SupplierBatchCode"
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                        <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
                            <Row>
                                    {/* <Row className="mt-3">
                                        <Col className=" col col-12">
                                            <ItemTab tableData={ItemTabDetails} func={setItemTabDetails} />
                                        </Col>
                                    </Row> */}
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "", marginTop: "20px" }}>
                                        <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                            module={"BOMMaster"}
                                        />
                                    </Col>
                                </FormGroup >
                            </Row>
                        </div>
                    </form>
                </div >
            </React.Fragment >
        )
    } else {
        return null
    }
}
export default ProductionMaster;