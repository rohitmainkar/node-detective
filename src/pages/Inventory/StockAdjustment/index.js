import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,

} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../CustomValidateForm/RegexPattern";
import { goButtonPartyItemAddPageSuccess, goButtonPartyItemAddPage } from "../../../store/Administrator/PartyItemsRedux/action";
import { StockEntry_GO_button_api_For_Item } from "../../../helpers/backend_helper";
import * as _cfunc from "../../../components/Common/CommonFunction";
import "../../../pages/Sale/SalesReturn/salesReturn.scss";
import { saveStockEntryAction, saveStockEntrySuccess } from "../../../store/Inventory/StockEntryRedux/action";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";

const StockAdjustment = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        Date: currentDate_ymd,
        ItemName: "",
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [TableArr, setTableArr] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        ItemList,
        pageField,
        userAccess,
        saveBtnloading,
        partyItemListLoading
    } = useSelector((state) => ({
        partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,
        saveBtnloading: state.StockEntryReducer.saveBtnloading,
        postMsg: state.StockEntryReducer.postMsg,
        ItemList: state.PartyItemsReducer.partyItem,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        const page_Id = pageId.STOCK_ADJUSTMENT
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(goButtonPartyItemAddPage({
            jsonBody: JSON.stringify({
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID()
            })
        }))
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { fieldLabel } = state;

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
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            setTableArr([])
            customAlert({
                Type: 1,
                Message: postMsg.Message,
                RedirectPath: url.STOCK_ENTRY,
            })
        }
        else if (postMsg.Status === true) {
            dispatch(saveStockEntrySuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "id",
            classes: () => "",
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.ItemName}</Label>
                )
            }
        },

        {
            text: "BatchCode",
            dataField: "",
            classes: () => "",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Input
                        id=""
                        key={row.id}
                        // defaultValue={row.BatchCode}
                        type="text"
                        className=" text-center"
                    // onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },

        {
            text: "Original BatchCode",
            dataField: "",
            classes: () => "",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Input
                        id=""
                        key={row.id}
                        // defaultValue={row.BatchCode}
                        type="text"
                        className=" text-center"
                    // onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },

        {
            text: "Quantity",
            dataField: "",
            classes: () => "",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <Input
                        id=""
                        // key={row.id}
                        // defaultValue={row.BatchCode}
                        type="text"
                        className=" text-center"
                    // onChange={(event) => { row.BatchCode = event.target.value }}
                    />
                </span>)
            }
        },
        // {
        //     text: "Action ",
        //     dataField: "",
        //     formatExtraData: { TableArr: TableArr, setTableArr: setTableArr },
        //     formatter: (cellContent, row, _key, formatExtraData) => (
        //         <>
        //             <div style={{ justifyContent: 'center' }} >
        //                 <Col>
        //                     <FormGroup className=" col col-sm-4 ">
        //                         <Button
        //                             id={"deleteid"}
        //                             type="button"
        //                             className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
        //                             data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
        //                             onClick={(e) => { deleteButtonAction(row, formatExtraData) }}
        //                         >
        //                             <i className="mdi mdi-delete font-size-18"></i>
        //                         </Button>
        //                     </FormGroup>
        //                 </Col>
        //             </div>
        //         </>
        //     ),
        // },
    ];

    const AddPartyHandler = async () => {

        // Display alert if Item Name is empty
        if (values.ItemName === '') {
            customAlert({
                Type: 4,
                Message: `Select Item Name`
            });
            return;
        }

        try {
            // Fetch data from the API
            const apiResponse = await StockEntry_GO_button_api_For_Item(values.ItemName.value);

            // Convert API response to desired format
            const convert_ApiResponse = apiResponse.Data.InvoiceItems.map((i) => {

                const UnitDroupDownOptions = i.ItemUnitDetails.map((unit) => ({
                    label: unit.UnitName,
                    value: unit.Unit,
                    IsBase: unit.IsBase,
                    BaseUnitQuantity: unit.BaseUnitQuantity,
                }));

                const Default_Unit = UnitDroupDownOptions.find(unit => unit.IsBase);

                const MRP_DropdownOptions = i.ItemMRPDetails.map((mrp) => ({
                    label: mrp.MRPValue,
                    value: mrp.MRP,
                }));

                const Highest_MRP = MRP_DropdownOptions.reduce((prev, current) => {
                    return prev.MRP > current.MRP ? prev : current;
                });

                const GST_DropdownOptions = i.ItemGSTDetails.map((gst) => ({
                    label: gst.GSTPercentage,
                    value: gst.GST,
                }));

                const Highest_GST = GST_DropdownOptions.reduce((prev, current) => {
                    return prev.GST > current.GST ? prev : current;
                });

                return {
                    UnitDroupDownOptions,
                    MRP_DropdownOptions,
                    GST_DropdownOptions,
                    Default_Unit,
                    Highest_MRP,
                    Highest_GST,
                    ItemName: i.ItemName,
                    ItemId: i.Item,
                    Quantity: i.Quantity,
                };
            });

            const initialTableData = [...TableArr];
            const dateString = currentDate_ymd.replace(/-/g, "");//Convert date To DateString 

            const existingBatchCodes = {};//existing Batch Codes form compare in table 

            convert_ApiResponse.forEach((index) => {
                const itemId = index.ItemId;

                let batchCodeCounter = 0;
                initialTableData.forEach((tableItem) => {
                    if (tableItem.ItemId === itemId) {
                        const existingBatchCode = tableItem.BatchCode.split('_').pop(); // Extract the batchCode from existing BatchCode
                        batchCodeCounter = Math.max(batchCodeCounter, parseInt(existingBatchCode, 10) + 1);
                    }
                });

                let newBatchCode = `${dateString}_${itemId}_${_cfunc.loginPartyID()}_${batchCodeCounter}`;

                while (existingBatchCodes[newBatchCode]) {
                    batchCodeCounter++;
                    newBatchCode = `${dateString}_${itemId}_${_cfunc.loginPartyID()}_${batchCodeCounter}`;
                }

                existingBatchCodes[newBatchCode] = true;// Record the new batch code as existing

                initialTableData.push({
                    id: initialTableData.length + 1, // Use initialTableData length+1 as the ID
                    Unit_DropdownOptions: index.UnitDroupDownOptions,
                    MRP_DropdownOptions: index.MRP_DropdownOptions,
                    ItemGSTHSNDetails: index.GST_DropdownOptions,
                    ItemName: index.ItemName,
                    ItemId: itemId,
                    Quantity: index.Quantity,
                    BatchDate: currentDate_ymd,
                    BatchCode: newBatchCode,
                    defaultUnit: index.Default_Unit,
                    defaultMRP: index.Highest_MRP,
                    defaultGST: index.Highest_GST,
                });


            });
            setState((prevState) => {
                const newState = { ...prevState };
                newState.values.ItemName = "";
                newState.hasValid.ItemName.valid = true;
                return newState;
            });

            initialTableData.sort((a, b) => b.id - a.id);
            setTableArr(initialTableData);


        } catch (w) { }
    }

    function deleteButtonAction(row, { TableArr = [], setTableArr }) {

        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content">

                    <form noValidate>
                        <div className="px-3 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>ItemName </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                isLoading={partyItemListLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>Batch Code</Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                isLoading={partyItemListLoading}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "add")}
                                                > Add</Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <ToolkitProvider
                            keyField={"id"}
                            data={TableArr}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive table" style={{ minHeight: "45vh" }}>
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    classes={"table  table-bordered table-hover "}
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

                        {/* {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        } */}

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

export default StockAdjustment