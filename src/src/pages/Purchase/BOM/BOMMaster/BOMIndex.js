import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb3"
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName, commonPageFieldSuccess, getItemList } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,

} from "../../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import Select from "react-select";
import { SaveButton } from "../../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import ItemTab from "./ItemQuantityTab";
import {
    editBOMListSuccess,
    postBOM,
    postBOMSuccess,
    updateBOMList,
    updateBOMListSuccess
} from "../../../../store/Purchase/BOMRedux/action";
import { createdBy, userCompany } from "../../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";

const BOMMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [ItemTabDetails, setItemTabDetails] = useState([])
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [ItemUnitOptions, setItemUnitOptions] = useState([]);
    const [ItemUnitOnEditData, setItemUnitOnEditData] = useState([]);

    const fileds = {
        id: "",
        BomDate: "",
        ItemName: "",
        EstimatedOutputQty: "",
        UnitName: "",
        Comment: "",
        IsActive: true
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        Items,
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Items: state.ItemMastersReducer.pages,
    }));

    useEffect(() => {
        const page_Id = pageId.BIllOf_MATERIALS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList())

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
        };
    }, [userAccess])

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
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
                let ItemUnits = hasEditVal.ParentUnitDetails.map((data) => ({
                    value: data.Unit,
                    label: data.UnitName
                }))
                setItemUnitOnEditData(ItemUnits)
                // setItemUnitOptions(ItemUnits)
                setEditData(hasEditVal);
                const { id, BomDate, Item, ItemName, Unit, UnitName, EstimatedOutputQty, Comment, IsActive } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }
                hasValid.id.valid = true;
                hasValid.BomDate.valid = true;
                hasValid.ItemName.valid = true;
                hasValid.UnitName.valid = true;
                hasValid.EstimatedOutputQty.valid = true;
                hasValid.Comment.valid = true;
                hasValid.IsActive.valid = true;

                values.id = id
                values.BomDate = BomDate;
                values.EstimatedOutputQty = EstimatedOutputQty;
                values.Comment = Comment;
                values.IsActive = IsActive;
                values.ItemName = { label: ItemName, value: Item };
                values.UnitName = { label: UnitName, value: Unit };
                setItemTabDetails(hasEditVal.BOMItems)
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(editBOMListSuccess({ Status: false }))
                dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postBOMSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state))// Clear form values  
            // saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))

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
                    RedirectPath: url.BIllOf_MATERIALS_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(postBOMSuccess({ Status: false }))
            // saveDissable(false);//save Button Is enable function
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
            // saveDissable(false);//Update Button Is enable function
            // setState(() => resetFunction(fileds, state))// Clear form values  
            history.push({
                pathname: url.BIllOf_MATERIALS_LIST,
            })
        } else if ((updateMsg.Status === true) && (updateMsg.StatusCode === 100) && !(modalCss)) {
            dispatch(updateBOMListSuccess({ Status: false }));
            dispatch(AlertState({
                Type: 6, Status: true,
                Message: JSON.stringify(updateMsg.Message),
                PermissionFunction: PermissionFunction,

            }));
        }
        else if (updateMsg.Status === true && !modalCss) {
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
        label: index.Name,
    }));

    function PermissionFunction() {
        let event = { preventDefault: () => { } }
        SaveHandler({ event, mode: true })
    }

    function Items_Dropdown_Handler(e) {
        setItemTabDetails([])
        let Item = Items.filter((index) => {
            return index.id === e.value
        })
        let ItemUnits = Item[0].UnitDetails.map((data) => ({
            value: data.id,
            label: data.UnitName
        }))

        setItemUnitOptions(ItemUnits)

        setState((i) => {
            i.values.UnitName = "";
            i.hasValid.UnitName.valid = false
            return i
        })
    }

    const SaveHandler = ( event) => {
        event.preventDefault();
        const BOMItems = ItemTabDetails.map((index) => ({
            Item: index.Item,
            Quantity: index.Quantity,
            Unit: index.Unit
        }))
        if (formValid(state, setState)) {

            let BOMrefID = 0
            if ((pageMode === mode.edit) ) {
                BOMrefID = EditData.id
            };

            const jsonBody = JSON.stringify({
                BomDate: values.BomDate,
                EstimatedOutputQty: values.EstimatedOutputQty,
                Comment: values.Comment,
                IsActive: values.IsActive,
                Item: values.ItemName.value,
                Unit: values.UnitName.value,
                CreatedBy: createdBy(),
                Company: userCompany(),
                BOMItems: BOMItems,
                ReferenceBom: BOMrefID
            });
            if (BOMItems.length === 0) {
                dispatch(
                    AlertState({
                        Type: 4,
                        Status: true,
                        Message: "At Least One Matrial data Add in the table",
                        RedirectPath: false,
                        PermissionAction: false,
                    })
                );
                return;
            }

            // saveDissable(true);//save Button Is dissable function

            if (pageMode === mode.edit) {
                dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
            }
            else {
                dispatch(postBOM(jsonBody));
            }
        }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>
               
                    <form onSubmit={(event) => SaveHandler(event)} noValidate>
                        <div className="px-2 c_card_filter header text-black" >
                            <div className=" row  ">
                                <Col sm="6">
                                    <FormGroup className="mb-2 row mt-2  ">
                                        <Label className="mt-2" style={{ width: "115px" }}>{fieldLabel.BomDate} </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name="BomDate"
                                                value={values.BomDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="YYYY-MM-DD"
                                                autoComplete="0,''"
                                                disabled={pageMode === mode.edit ? true : false}
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: (pageMode === mode.edit) ? values.BomDate : "today"
                                                }}
                                                onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                                onReady={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                                            />
                                            {isError.BomDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.BomDate}</span>
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
                                                    Items_Dropdown_Handler(hasSelect);
                                                    dispatch(Breadcrumb_inputName(hasSelect.label))
                                                }
                                                }
                                            />
                                            {isError.ItemName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ItemName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row ">
                                        <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.EstimatedOutputQty} </Label>
                                        <Col sm="7">
                                            <Input
                                                style={{ textAlign: "right" }}
                                                name="EstimatedOutputQty"
                                                value={values.EstimatedOutputQty}
                                                type="text"
                                                className={isError.EstimatedOutputQty.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter EstimatedOutputQty"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.EstimatedOutputQty.length > 0 && (
                                                <span className="invalid-feedback">{isError.EstimatedOutputQty}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }}> {fieldLabel.UnitName} </Label>
                                        <Col sm={7}>
                                            <Select
                                                name="UnitName"
                                                value={values.UnitName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={pageMode === mode.edit ? ItemUnitOnEditData : ItemUnitOptions}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                            {isError.UnitName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.UnitName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="6">
                                    <FormGroup className="mb-2 row  ">
                                        <Label className="mt-2" style={{ width: "115px" }} >{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
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
                                </Col>

                                <Col sm="6">
                                    <FormGroup className=" row ">
                                        <Row className="justify-content-md-left">
                                            <Label className="col-sm-6 col-form-label mt-2" style={{ width: "115px" }} >{fieldLabel.IsActive}</Label>
                                            <Col md={7} style={{ marginTop: '10px' }} >

                                                <div className="form-check form-switch form-switch-md mb-3">
                                                    <Input type="checkbox" className="form-check-input"
                                                        checked={values.IsActive}
                                                        name="IsActive"
                                                        onChange={(e) => {
                                                            setState((i) => {
                                                                const a = { ...i }
                                                                a.values.IsActive = e.target.checked;
                                                                return a
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                            </div>
                        </div>

                        <div className="px-2 mb-1 mt-n3" style={{ marginRight: '-28px', marginLeft: "-8px" }}>
                            <Row>
                                <Row className="mt-3">
                                    <Col className=" col col-12">
                                        <ItemTab tableData={ItemTabDetails} func={setItemTabDetails} />
                                    </Col>
                                </Row>

                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "9px" }}>
                                        <SaveButton
                                            pageMode={pageMode}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"BOMMaster"}
                                        />
                                    </Col>
                                </FormGroup >
                            </Row>
                        </div>
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

export default BOMMaster