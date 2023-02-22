import React, { useEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
} from "./../../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton }
    from "./../../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    postBOMSuccess,
    updateBOMListSuccess
} from "../../../../store/Purchase/BOMRedux/action";
import { breadcrumbReturn, convertDatefunc, createdBy, currentDate, userCompany, userParty }
    from "./../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    editMaterialIssueIdSuccess,
    goButtonForMaterialIssue_Master_Action,
    goButtonForMaterialIssue_Master_ActionSuccess,
    postMaterialIssue, postMaterialIssueSuccess
} from "../../../../store/Purchase/Matrial_Issue/action";


import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../../routes/PageMode";
import * as pageId from "../../../../routes/allPageID"
import * as url from "../../../../routes/route_url"
import { countlabelFunc } from "../../../../components/Common/ComponentRelatedCommonFile/purchase";
import { goBtnProduction_ReIssue_Addpage, ItemForProdunction_ReIssue, Save_Production_ReIssue, Save_Production_ReIssueSuccess } from "../../../../store/Production/ProductionReissueRedux/actions";

const ProductionReIssueAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        ProductionReIssueDate: currentDate,
        ItemName: "",
        PartyName: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    // const [Itemselect, setItemselect] = useState([])
    // const [Itemselectonchange, setItemselectonchange] = useState("");
    const [goButtonList, setGoButtonList] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        // itemOption = [],
        productionReIssueItems = [],
        // goButtonList = []
    } = useSelector((state) => ({
        postMsg: state.ProductionReIssueReducer.postMsg,
        updateMsg: state.ProductionReIssueReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        productionReIssueItems: state.ProductionReIssueReducer.productionReIssueItem,
        ItemsList: state.ProductionReIssueReducer.WorkOrderList,
        // goButtonList: state.ProductionReIssueReducer.goButtonList
    }));

    useEffect(() => {
        const page_Id = pageId.PRODUCTIONRE_ISSUE
        // ItemForProdunction_ReIssue()
        dispatch(ItemForProdunction_ReIssue({
            "ProductionID": 169,
            "PartyID": 4
        }))
        dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }

    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
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
            setUserPageAccessState(userAcc)
            breadcrumbReturn({ dispatch, userAcc });

        };
    }, [userAccess])


    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            let insidePageMode = null
            if (hasShowloction) {
                insidePageMode = location.pageMode;
                setPageMode(location.pageMode)
                hasEditVal = location[mode.editValue]
            }
            else if (hasShowModal) {
                hasEditVal = props[mode.editValue]
                insidePageMode = props.pageMode;
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                // setItemselect(hasEditVal)
                const { id, Item, ItemName, WorkDate, EstimatedOutputQty, NumberOfLot, MaterialIssueItems = [] } = hasEditVal
                // const { BatchesData = [] } = MaterialIssueItems
                setState((i) => {
                    i.values.MaterialIssueDate = currentDate
                    i.values.ItemName = { value: id, label: ItemName, Item: Item, NoLot: NumberOfLot, lotQty: EstimatedOutputQty };
                    i.values.NumberOfLot = NumberOfLot;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.ItemName.valid = true;
                    i.hasValid.MaterialIssueDate.valid = true;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;
                    return i
                })
                // ++++++++++++++++++++++++++**Dynamic go Button API Call method+++++++++++++++++

                if (insidePageMode === mode.mode2save) {
                    const jsonBody = JSON.stringify({
                        WorkOrder: id,
                        Item: Item,
                        Company: userCompany(),
                        Party: userParty(),
                        Quantity: parseInt(EstimatedOutputQty)
                    });
                    dispatch(goButtonForMaterialIssue_Master_Action(jsonBody));
                } else if (insidePageMode === mode.view) {
                    dispatch(goButtonForMaterialIssue_Master_ActionSuccess(MaterialIssueItems))
                    dispatch(editMaterialIssueIdSuccess({ Status: false }))
                }

            }
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Save_Production_ReIssueSuccess({ Status: false }))
            setGoButtonList([])
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function

            // dispatch(AlertState({
            //     Type: 1,
            //     Status: true,
            //     Message: "Item is out of stock",
            //     RedirectPath: url.MATERIAL_ISSUE_LIST,
            // }))
            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.PRODUCTIONRE_ISSUE_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {

            dispatch(postMaterialIssueSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
            dispatch(postBOMSuccess({ Status: false }))
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

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            // saveDissable(false);//Update Button Is enable function
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
    }, [pageField]);


    const itemOption = productionReIssueItems.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        data: index
    }));

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            formatter: (cellContent, user) => {
                return (
                    <>
                        <div><samp id={`ItemName${user.id}`}>{cellContent}</samp></div>
                        <div><samp id={`ItemNameMsg${user.id}`} style={{ color: "red" }}></samp></div>
                    </>

                )
            },
            style: (cellContent, user,) => {

                let Stock = user.BatchesData.map((index) => {
                    return index.BaseUnitQuantity
                })
                var TotalStock = 0;
                Stock.forEach(x => {
                    TotalStock += parseFloat(x);
                });
                var OrderQty = parseFloat(user.Quantity)
                if (OrderQty > TotalStock) {
                    return {
                        color: "red",

                    };
                }
            },
        },

        {
            text: "Work Order Qty",
            // dataField: "Quantity",
            formatter: (cellContent, user, k) => {

                return (<div>
                    <Input onChange={(e) => {
                        user.Quantity = Number(e.target.value)
                    }}> </Input>
                </div>)
            },
        },
        {
            text: "Unit",
            dataField: "UnitName",
        },
        {
            text: "Batch Code",
            dataField: "BatchesData",

            formatter: (cellContent, user) => (
                <>
                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead>
                            <tr>
                                <th>Batch Code </th>
                                <th>Supplier BatchCode</th>
                                <th>Batch Date</th>
                                <th>Stock Quantity</th>
                                <th>Quantity</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {cellContent.map((index) => {

                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.SystemBatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {index.BatchCode}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "100px" }}>
                                                <Label>
                                                    {convertDatefunc(index.BatchDate)}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "120px", textAlign: "right" }}>
                                                <Label
                                                // onKeyDown={(e) => handleKeyDown(e, goButtonList)}
                                                >
                                                    {index.BaseUnitQuantity}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Input
                                                    type="text"
                                                    key={`stock${user.id}-${index.id}`}
                                                    disabled={pageMode === mode.view ? true : false}
                                                    id={`stock${user.id}-${index.id}`}
                                                    style={{ textAlign: "right" }}
                                                    defaultValue={index.Qty}
                                                    autoComplete='off'
                                                    onChange={(event) => handleChange(event, user, index)}
                                                ></Input>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </>
            ),
        },

    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: goButtonList.length,
        custom: true,
    };

    function goButtonHandler(e) {
        // event.preventDefault();
        if (state.values.LotQuantity === "0") {
            alert("Quantity Can Not be 0")
        } else
            if (formValid(state, setState)) {

                const jsonBody = JSON.stringify({
                    WorkOrder: values.ItemName.value,
                    Item: values.ItemName.Item,
                    Company: userCompany(),
                    Party: userParty(),
                    Quantity: parseInt(values.LotQuantity)
                });

                dispatch(goButtonForMaterialIssue_Master_Action(jsonBody));
            }
    }

    function ItemOnchange(event) {
        dispatch(Breadcrumb_inputName(event.label))
        setState((i) => {
            i.values.ItemName = event
            i.hasValid.ItemName.valid = true;
            i.hasValid.ProductionReIssueDate.valid = true;
            return i
        })

        setGoButtonList([{ ...event.data }])
    }

    // function Quantitychange(event) {

    //     dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
    //     let value1 = Math.max('', Math.min(Itemselectonchange.value > 0 ?
    //         Itemselectonchange.Quantity :
    //         Itemselect.Quantity, Number(event.target.value)));
    //     event.target.value = value1
    //     if (event.target.value === "NaN") {
    //         value1 = 0
    //     }
    //     // onChangeText({ event, state, setState });
    //     setState((i) => {
    //         i.values.LotQuantity = value1
    //         // i.hasValid.NumberOfLot.valid = true;
    //         i.hasValid.LotQuantity.valid = true;
    //         return i
    //     })
    // }

    // function NumberOfLotchange(event) {
    //     dispatch(goButtonForMaterialIssue_Master_ActionSuccess([]))
    //     let value1 = Math.max('', Math.min(Itemselect.NumberOfLot, Number(event.target.value)));
    //     event.target.value = value1
    //     if ((event.target.value === "NaN")) {
    //         value1 = 0
    //     }
    //     // onChangeText({ event, state, setState });
    //     setState((i) => {
    //         i.values.NumberOfLot = value1
    //         i.hasValid.NumberOfLot.valid = true;
    //         // i.hasValid.LotQuantity.valid = true;
    //         return i
    //     })
    // }

    const handleChange = (event, index1, index2) => {

        let input = event.target.value

        let result = /^\d*(\.\d{0,3})?$/.test(input);
        let val1 = 0;
        if (result) {
            let v1 = Number(index2.BaseUnitQuantity);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        } else if (((index2.Qty >= 0) && (!(input === '')))) {
            val1 = index2.Qty
        } else {
            val1 = 0
        }

        event.target.value = val1;

        let Qtysum = 0
        index1.BatchesData.forEach((i) => {
            if (!(i.id === index2.id)) {
                Qtysum = Number(Qtysum) + Number(i.Qty)
            }
        });

        Qtysum = Number(Qtysum) + Number(val1);
        index2.Qty = val1;
        let diffrence = Math.abs(index1.Quantity - Qtysum);

        if ((Qtysum === index1.Quantity)) {
            try {
                document.getElementById(`ItemName${index1.id}`).style.color = ""
                document.getElementById(`ItemNameMsg${index1.id}`).innerText = ''
                index1["invalid"] = false
                index1["invalidMsg"] = ''

            } catch (e) { }
        } else {
            try {
                const msg = (Qtysum > index1.Quantity) ? (`Excess Quantity ${diffrence} ${index1.UnitName}`)
                    : (`Short Quantity ${diffrence} ${index1.UnitName}`)
                index1["invalid"] = true;
                index1["invalidMsg"] = msg;

                document.getElementById(`ItemNameMsg${index1.id}`).innerText = msg;
            } catch (e) { }
        }
    };

    const SaveHandler = async (event) => {
        event.preventDefault();
        const validMsg = []

        const productionReIssue_Item = []
        await goButtonList.map((index) => {

            var TotalStock = 0;
            index.BatchesData.map(i => {
                TotalStock += Number(i.BaseUnitQuantity);
            });

            var OrderQty = Number(index.Quantity)
            if (OrderQty > TotalStock) {
                {
                    validMsg.push(`${index.ItemName}:Item is Out Of Stock`);
                };
            }
            let a = index["invalid"]
            if (a) {
                validMsg.push(`${index.ItemName}:${index["invalidMsg"]}`);
            };

            function batch(ele) {
                productionReIssue_Item.push({
                    Item: index.Item,
                    Unit: index.Unit,
                    IssueQuantity: index.Quantity,
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    ProductionReIssue: parseInt(ele.Qty),
                    BatchID: ele.id,
                    LiveBatchID: ele.LiveBatchID
                })
            }
            index.BatchesData.map((ele) => {
                if (Number(ele.Qty) > 0) {
                    batch(ele)
                }
            })
        })


        if (formValid(state, setState)) {
            if (validMsg.length > 0) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: JSON.stringify(validMsg),
                    RedirectPath: false,
                    AfterResponseAction: false
                }));
                return
            }

            const jsonBody = JSON.stringify({
                Date: values.ProductionReIssueDate,
                ProductionID: 169,
                ProductionItem: values.ItemName.value,
                ProductionReIssueItems: productionReIssue_Item,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                Company: userCompany(),
                Party: userParty(),
            }
            );

            if (pageMode === mode.edit) {
            }
            else {
                dispatch(Save_Production_ReIssue(jsonBody));
            }
            // debugger
        };
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.MATERIAL_ISSUE} /> */}

                <div className="page-content" >
                    {/* <Breadcrumb pageHeading={userPageAccessState.PageHeading}
                    /> */}
                    <form onSubmit={SaveHandler} noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>
                            <Row>
                                <Col className=" mt-1 row" sm={11} >
                                    <Col sm="6">
                                        <FormGroup className="row mt-2  ">
                                            <Label className="mt-1" style={{ width: "150px" }}>{fieldLabel.ProductionReIssueDate} </Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name="ProductionReIssueDate"
                                                    value={values.ProductionReIssueDate}
                                                    // disabled={(goButtonList.length > 0) ? true : false}
                                                    className="form-control d-block bg-white text-dark"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        // altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                />
                                                {isError.ProductionReIssueDate.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ProductionReIssueDate}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    {/* <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.PartyName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    // isDisabled={(values.ItemName) ? true : null}
                                                    name="PartyName"
                                                    value={values.PartyName}
                                                    isDisabled={goButtonList.length > 0 ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={itemOption}
                                                    onChange={ItemOnchange}
                                                />
                                                {isError.PartyName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col > */}

                                    <Col sm="6">
                                        <FormGroup className="row mt-2 ">
                                            <Label className="mt-2" style={{ width: "100px" }}> {fieldLabel.ItemName} </Label>
                                            <Col sm={7}>
                                                <Select
                                                    // isDisabled={(values.ItemName) ? true : null}
                                                    name="ItemName"
                                                    value={values.ItemName}
                                                    isDisabled={goButtonList.length > 0 ? true : false}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={itemOption}
                                                    onChange={ItemOnchange}
                                                />
                                                {isError.ItemName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >


                                </Col>
                                <Col sm={1} className="mt-2 mb-2">
                                    {pageMode === mode.defaultsave ?
                                        (goButtonList.length === 0) ?
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                            :
                                            <Change_Button onClick={(e) => setGoButtonList([])} />
                                        : null
                                    }
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Col>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={goButtonList}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {(toolkitProps) => (
                                        <React.Fragment>
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table-responsive">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            responsive
                                                            bordered={false}
                                                            striped={false}
                                                            classes={"table  table-bordered"}
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />
                                                        {countlabelFunc(toolkitProps, paginationProps, dispatch, "Material Issue")}
                                                        {/* {mySearchProps(toolkitProps.searchProps, pageField.id)} */}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone {...paginationProps} />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )}
                                </ToolkitProvider>
                            )}

                        </PaginationProvider>

                        {goButtonList.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton pageMode={pageMode}
                                    //   onClick={onsave}
                                    userAcc={userPageAccessState}
                                    module={"Material Issue"}
                                />
                            </Col>
                        </FormGroup > : null}
                    </form>
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

export default ProductionReIssueAdd
