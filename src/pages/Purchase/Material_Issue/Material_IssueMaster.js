import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3"
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
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    postBOMSuccess,
    updateBOMList,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import { convertDatefunc, createdBy, currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { saveDissable, } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { getWorkOrderListPage } from "../../../store/Purchase/WorkOrder/action";
import { postGoButtonForMaterialIssue_Master, postGoButtonForMaterialIssue_MasterSuccess, postMaterialIssue, postMaterialIssueSuccess } from "../../../store/Purchase/Matrial_Issue/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import { handleKeyDown } from "../Order/OrderPageCalulation";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"

const MaterialIssueMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        MaterialIssueDate: "",
        ItemName: "",
        NumberOfLot: "",
        LotQuantity: "",
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [Itemselect, setItemselect] = useState([])
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
        GoButton
    } = useSelector((state) => ({
        postMsg: state.MaterialIssueReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.WorkOrderReducer.WorkOrderList,
        GoButton: state.MaterialIssueReducer.GoButton
    }));

    useEffect(() => {
        const page_Id = pageId.MATERIAL_ISSUE
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

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
        };
    }, [userAccess])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: "2022-12-01",
            ToDate: currentDate
        });
        dispatch(getWorkOrderListPage(jsonBody));
    }, [])


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

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

                const { id, Item, ItemName, Company, EstimatedOutputQty, Quantity, NumberOfLot } = hasEditVal

                setItemselect({ value: Item, label: ItemName })
                setState((i) => {
                    i.values.ItemName = { value: Item, label: ItemName }
                    i.values.NumberOfLot = NumberOfLot;
                    i.hasValid.ItemName.valid = true;
                    i.values.LotQuantity = EstimatedOutputQty;
                    i.hasValid.NumberOfLot.valid = true;
                    i.hasValid.LotQuantity.valid = true;

                    return i
                })

                const jsonBody = JSON.stringify({
                    WorkOrder: id,
                    Item: Item,
                    Company: Company,
                    Party: userParty(),
                    Quantity: parseInt(Quantity)
                });
                dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postMaterialIssueSuccess({ Status: false }))
            dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
            dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values 
            // saveDissable(false);//save Button Is enable function

            if (pageMode === "dropdownAdd") {
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
                    RedirectPath: url.MATERIAL_ISSUE_LIST,
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
                Message: JSON.stringify(postMessage.Message),
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
    }, [pageField])

    const ItemDropdown_Options = Items.map((index) => ({
        value: index.id,
        label: index.ItemName,
        Quantity: index.Quantity,
        WorkOrderId: index.id,
        Item: index.Item,
        BomID: index.Bom,
        Unit: index.Unit,
        NumberOfLot: index.NumberOfLot
    }));

    const goButtonHandler = (event) => {

        event.preventDefault();
        if (formValid(state, setState)) {
            const jsonBody = JSON.stringify({
                WorkOrder: Itemselect.WorkOrderId,
                Item: Itemselect.Item,
                Company: userCompany(),
                Party: userParty(),
                Quantity: parseInt(values.LotQuantity)
            });

            dispatch(postGoButtonForMaterialIssue_Master(jsonBody));
        }
    }

    function ItemOnchange(e) {
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        setItemselect(e)
        setState((i) => {
            i.values.NumberOfLot = e.NumberOfLot;
            i.values.LotQuantity = e.Quantity;
            i.hasValid.NumberOfLot.valid = true;
            i.hasValid.LotQuantity.valid = true;
            return i
        })
    }

    function Quantitychange(event) {
        dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
        const value1 = Math.max('', Math.min(Itemselect.Quantity, Number(event.target.value)));
        event.target.value = value1
        onChangeText({ event, state, setState });
    }

    const handleChange = (event, index) => {
        index.Qty = event.target.value
    };

    const SaveHandler = (event) => {
        const MaterialIssueItems = []
        GoButton.map((index) => {
            index.BatchesData.map((ele) => {

                MaterialIssueItems.push({
                    Item: index.Item,
                    Unit: index.Unit,
                    WorkOrderQuantity: index.Quantity,
                    BatchCode: ele.BatchCode,
                    BatchDate: ele.BatchDate,
                    SystemBatchDate: ele.SystemBatchDate,
                    SystemBatchCode: ele.SystemBatchCode,
                    IssueQuantity: parseInt(ele.Qty)
                })
            })
        })

        const FilterData = MaterialIssueItems.filter((index) => {
            return (index.IssueQuantity > 0)
        })

        event.preventDefault();
        if (formValid(state, setState)) {

            const jsonBody = JSON.stringify({

                MaterialIssueDate: values.MaterialIssueDate,
                NumberOfLot: values.NumberOfLot,
                LotQuantity: values.LotQuantity,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
                Company: userCompany(),
                Party: userParty(),
                Item: Itemselect.Item,
                Unit: Itemselect.Unit,
                MaterialIssueItems: FilterData,
                MaterialIssueWorkOrder: [
                    {
                        WorkOrder: Itemselect.WorkOrderId,
                        Bom: Itemselect.BomID
                    }
                ]
            }
            );

            // saveDissable(true);//save Button Is dissable function

            if (pageMode === 'edit') {
                dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
            }
            else {
                dispatch(postMaterialIssue(jsonBody));
            }
        };
    }

    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "Work Order Qty",
            dataField: "Quantity",
            sort: true,
        },
        {
            text: "Batch Code",
            dataField: "BatchesData",
            sort: true,

            formatter: (cellContent, user) => (
                <>

                    <Table className="table table-bordered table-responsive mb-1">
                        <Thead  >
                            <tr style={{ zIndex: "23" }} className="">
                                <th className="">Batch Code </th>
                                <th className="" >Supplier BatchCode</th>
                                <th className="">Batch Date</th>
                                <th className="">Stock Quantity</th>
                                <th className="" >Quantity</th>

                            </tr>
                        </Thead>

                        <Tbody  >
                            {cellContent.map((index) => {

                                return (
                                    < tr >
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label  >
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
                                            <div style={{ width: "150px" }}>
                                                <Label>
                                                    {convertDatefunc(index.BatchDate)}
                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Label
                                                    onKeyDown={(e) => handleKeyDown(e, GoButton)}
                                                >
                                                    {index.ObatchwiseQuantity}

                                                </Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ width: "150px" }}>
                                                <Input type="text"
                                                    defaultValue={index.Qty}
                                                    onChange={(event) => handleChange(event, index)}
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
        {

            text: "Unit",
            dataField: "UnitName",
            sort: true,
        },
    ]

    const pageOptions = {
        sizePerPage: 10,
        totalSize: GoButton.length,
        custom: true,
    };

    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (


            <React.Fragment>

                <MetaTags>
                    <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
                </MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <Breadcrumb pageHeading={userPageAccessState.PageHeading}
                    />
                    <form onSubmit={SaveHandler} noValidate>

                        <div className="px-2 mb-1 mt-n3 c_card_filter header text-black" >

                            <div className=" mt-1 row  ">

                                <Col sm="6">
                                    <FormGroup className="mb-2 row mt-2  ">
                                        <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.MaterialIssueDate} </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="MaterialIssueDate"
                                                value={values.MaterialIssueDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === "edit" ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: pageMode === "edit" ? values.Date : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.MaterialIssueDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.MaterialIssueDate}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row mt-2 ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.ItemName} </Label>
                                        <Col sm={7}>
                                            <Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ItemDropdown_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    ItemOnchange(hasSelect);
                                                    dispatch(Breadcrumb_inputName(hasSelect.label))
                                                }
                                                }
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>

                                </Col >

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.NumberOfLot} </Label>
                                        <Col sm={7}>
                                            <Input
                                                name="NumberOfLot"
                                                value={values.NumberOfLot}
                                                type="text"
                                                className={isError.NumberOfLot.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Number Of Lots"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState });
                                                    dispatch(postGoButtonForMaterialIssue_MasterSuccess([]))
                                                }}
                                            />
                                            {isError.NumberOfLot.length > 0 && (
                                                <span className="invalid-feedback">{isError.NumberOfLot}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.LotQuantity} </Label>
                                        <Col sm={7}>
                                            <Input
                                                name="LotQuantity"
                                                value={values.LotQuantity}
                                                type="text"
                                                className={isError.LotQuantity.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter LotQuantity"
                                                autoComplete='off'
                                                onChange={Quantitychange}
                                            />
                                            {isError.LotQuantity.length > 0 && (
                                                <span className="invalid-feedback">{isError.LotQuantity}</span>
                                            )}
                                        </Col>

                                        <div className="col col-1">
                                            <Button
                                                color="btn btn-outline-success border-2 font-size-12 " style={{ marginTop: '3px' }}
                                                onClick={(e) => goButtonHandler(e)}
                                            >Go</Button>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </div>
                        </div>

                        <PaginationProvider pagination={paginationFactory(pageOptions)}>
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField={"id"}
                                    data={GoButton}
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

                        {GoButton.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "9px" }}>
                                <SaveButton pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"BOMMaster"}
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

export default MaterialIssueMaster
