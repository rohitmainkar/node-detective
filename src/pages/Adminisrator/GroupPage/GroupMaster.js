import React, { useEffect, useMemo, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
    editGroupIDSuccess,
    getGroupList,
    getGroupListSuccess,
    postGroupList,
    postGroupSuccess,
    updateGroupID,
    updategroupIDSuccess
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

} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { GROUP_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { createdBy } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


const GroupMaster = (props) => {

    const formRef = useRef(null);
    const history = useHistory()
    const dispatch = useDispatch();

    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserPageAccessState] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        GroupTypeAPI,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.GroupReducer.postMsg,
            updateMsg: state.CategoryReducer.updateMessage,
            GroupTypeAPI: state.GroupTypeReducer.GroupType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const initialFiled = useMemo(() => {

        const fileds = {
            id: "",
            Name: "",
            GroupTypeName: ""
        }
        return initialFiledFunc(fileds)
    }, []);

    const [state, setState] = useState(initialFiled)


    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(50))
        dispatch(getGroupTypeslist())
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

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

        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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
                setEditData(hasEditVal)

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

            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])


    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postGroupSuccess({ Status: false }))
            formRef.current.reset();
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
                    RedirectPath: GROUP_lIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
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
            history.push({
                pathname: GROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updategroupIDSuccess({ Status: false }));
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
        debugger
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })// new change
        }
    }, [pageField])


    // get method for dropdown
    useEffect(() => {
        dispatch(getGroupList());
    }, [dispatch]);

    const GroupTypesValues = GroupTypeAPI.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            debugger
            const jsonBody = JSON.stringify({
                Name: values.Name,
                GroupType: values.GroupTypeName.value,
                CreatedBy: createdBy(),
                CreatedOn: "0002-10-03T12:48:14.910491",
                UpdatedBy:createdBy(),
                UpdatedOn: "0002-10-03T12:48:14.910491"
            });

            if (pageMode === "edit") {

                dispatch(updateGroupID(jsonBody, values.id));


            }
            else {
                dispatch(postGroupList(jsonBody));
                // console.log("jsonBody", jsonBody)


            }
        }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>
                                    <Row className="">
                                        <Col md={12} style={{ height: "9cm" }}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>

                                                        <Col sm="4">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>

                                                                <Col>
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
                                                                            onChangeText({ event, state, setState })
                                                                            dispatch(Breadcrumb_inputName(event.target.value))
                                                                        }}

                                                                    />
                                                                    {isError.Name.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.Name}</span>
                                                                    )}


                                                                </Col>
                                                            </FormGroup>
                                                        </Col>


                                                        <Row>
                                                            <FormGroup className="mb-3 col col-sm-4 ">

                                                                <Label htmlFor="validationCustom01"> {fieldLabel.GroupTypeName} </Label>


                                                                <Select
                                                                    name="GroupTypeName"
                                                                    // defaultValue={EmployeeType_DropdownOptions[0]}
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



                                                            </FormGroup>

                                                        </Row>

                                                        <FormGroup >
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
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

