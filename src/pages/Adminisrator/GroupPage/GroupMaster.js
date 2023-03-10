import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editGroupIDSuccess,
    getGroupListSuccess,
    saveGroupMaster,
    saveGroupMaster_Success,
    updateGroupID,
    updateGroupIDSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { breadcrumbReturn, btnIsDissablefunc, loginUserID, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";

const GroupMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        GroupTypeName: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        GroupTypeAPI,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.GroupReducer.postMsg,
            updateMsg: state.GroupReducer.updateMsg,
            GroupTypeAPI: state.GroupTypeReducer.GroupType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.GROUP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getGroupTypeslist())

    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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

                const { id, Name, GroupType, GroupTypeName } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.Name = Name;
                values.id = id
                values.GroupTypeName = { label: GroupTypeName, value: GroupType };

                hasValid.id.valid = true;
                hasValid.Name.valid = true;
                hasValid.GroupTypeName.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveGroupMaster_Success({ Status: false }))
            setState(() => resetFunction(fileds, state))//Clear form values
            saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
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
                    RedirectPath: url.GROUP_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(getGroupListSuccess({ Status: false }))
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

        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.GROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updateGroupIDSuccess({ Status: false }));
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

    const GroupTypesValues = GroupTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    GroupType: values.GroupTypeName.value,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateGroupID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveGroupMaster({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12} style={{ height: "9cm" }}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.Name}</Label>
                                                            <Col md={4}  >
                                                                <Input
                                                                    name="Name"
                                                                    id="txtName"
                                                                    value={values.Name}
                                                                    type="text"
                                                                    className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter Name"
                                                                    autoComplete='off'
                                                                    autoFocus={true}
                                                                    onChange={(event) => {
                                                                        dispatch(Breadcrumb_inputName(event.target.value));
                                                                        onChangeText({ event, state, setState });
                                                                    }}
                                                                />
                                                                {isError.Name.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.Name}</span>
                                                                )}

                                                            </Col>
                                                        </FormGroup>
                                                        <Row>
                                                            <FormGroup className="mb-3  " style={{ marginLeft: "8px", paddingLeft: "4px" }}>

                                                                <Label htmlFor="validationCustom01"> {fieldLabel.GroupTypeName} </Label>
                                                                <Col md={4} >
                                                                    <Select
                                                                        name="GroupTypeName"
                                                                        value={values.GroupTypeName}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        options={GroupTypesValues}
                                                                        onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                                                        classNamePrefix="dropdown"
                                                                    />
                                                                    {isError.GroupTypeName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.GroupTypeName}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Row>

                                                        <FormGroup >
                                                            <Row>
                                                                <Col sm={4}>
                                                                    <SaveButton
                                                                        pageMode={pageMode}
                                                                        onClick={SaveHandler}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"GroupMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>

                        </Card>

                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default GroupMaster

