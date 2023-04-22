import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
    CardHeader,
    FormGroup,
    Input
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { MetaTags } from "react-meta-tags";
import {
    AlertState,
    commonPageField,
    commonPageFieldSuccess,
    getControlTypes,
    getFieldValidations
} from "../../../../store/actions";
import { Breadcrumb_inputName } from "../../../../store/Utilites/Breadcrumb/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../../components/Common/validationFunction";
import { SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginUserID, btnIsDissablefunc, loginCompanyID } from "../../../../components/Common/CommonFunction";
import * as url from "../../../../routes/route_url";
import * as pageId from "../../../../routes/allPageID"
import * as mode from "../../../../routes/PageMode"
import {
    edit_ImportFiledAdd_Success,
    save_ImportFiledAdd,
    save_ImportFiledAdd_Success,
    update_ImportFiledAdd,
    update_ImportFiledAdd_Success
} from "../../../../store/Administrator/ImportFieldAddRedux/action";
import { CustomAlert } from "../../../../CustomAlert/ConfirmDialog";

const ImportFieldAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        FieldName: "",
        ControlTypeName: "",
        FieldValidationName: "",
        IsCompulsory: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const {
        postMsg,
        pageField,
        updateMsg,
        controlType = [],
        validationType = [],
        userAccess } = useSelector((state) => ({
            postMsg: state.ImportFieldAdd_Reducer.postMsg,
            updateMsg: state.ImportFieldAdd_Reducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            controlType: state.H_Pages.ControlTypes,
            validationType: state.H_Pages.FieldValidations,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.IMPORT_FIELD_ADD
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getControlTypes());
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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

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

                const { id, FieldName, ControlTypeName,ControlTypeID, IsCompulsory, FieldValidationName,FieldValidationID } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.FieldName.valid = true;
                hasValid.ControlTypeName.valid = true;
                hasValid.IsCompulsory.valid = true;
                hasValid.FieldValidationName.valid = true;

                values.FieldName = FieldName;
                values.ControlTypeName = { label: ControlTypeName, value: ControlTypeID };
                values.IsCompulsory = IsCompulsory;
                values.FieldValidationName = { label: FieldValidationName, value: FieldValidationID };
                values.id = id
                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.FieldName))
                dispatch(getFieldValidations(hasEditVal.ControlTypeID))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(edit_ImportFiledAdd_Success({ Status: false }))
        }
    }, [])

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(save_ImportFiledAdd_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
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
                    RedirectPath: url.IMPORT_FIELD_ADD_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(save_ImportFiledAdd_Success({ Status: false }))
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
                pathname: url.IMPORT_FIELD_ADD_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(update_ImportFiledAdd_Success({ Status: false }));
            CustomAlert({
                Type: 3,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const controlType_Options = controlType.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const validationType_Options = validationType.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function controlTypeHandler(hasSelect, evn) {
        dispatch(getFieldValidations(hasSelect.value))
        onChangeSelect({ hasSelect, evn, state, setState })
    }

    const SaveHandler = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    FieldName: values.FieldName,
                    IsCompulsory: values.IsCompulsory,
                    ControlType: values.ControlTypeName.value,
                    FieldValidation: values.FieldValidationName.value,
                    Company: loginCompanyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });
                if (pageMode === mode.edit) {
                    dispatch(update_ImportFiledAdd({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(save_ImportFiledAdd({ jsonBody, btnId }));
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
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                    <Container fluid  >

                        <Card className="text-black" >
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>
                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>

                                    <Row className="">
                                        <Col md={12} >
                                            <Card >
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">{fieldLabel.FieldName} </Label>
                                                            <Input
                                                                name="FieldName"
                                                                value={values.FieldName}
                                                                type="text"
                                                                className={isError.FieldName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                autoFocus={true}
                                                                onChange={(event) => {
                                                                    onChangeText({ event, state, setState })
                                                                    dispatch(Breadcrumb_inputName(event.target.value))
                                                                }}
                                                            />
                                                            {isError.FieldName.length > 0 && (
                                                                <span className="invalid-feedback">{isError.FieldName}</span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">{fieldLabel.ControlTypeName} </Label>
                                                            <Select
                                                                name="ControlTypeName"
                                                                value={values.ControlTypeName}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={controlType_Options}
                                                                 onChange={controlTypeHandler}
                                                            />
                                                            {isError.ControlTypeName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.ControlTypeName}</small></span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 " >
                                                            <Label htmlFor="validationCustom01">{fieldLabel.FieldValidationName} </Label>
                                                            <Select
                                                                name="FieldValidationName"
                                                                value={values.FieldValidationName}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={validationType_Options}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState })}
                                                            />
                                                            {isError.FieldValidationName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.FieldValidationName}</small></span>
                                                            )}
                                                        </FormGroup>
                                                    </Row>

                                                    <FormGroup className="mb-2 col col-sm-5">
                                                        <Row className="justify-content-md-left">
                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" >{fieldLabel.IsCompulsory}  </Label>
                                                            <Col md={2} style={{ marginTop: '9px' }} >
                                                                <div className="form-check form-switch form-switch-md mb-3">
                                                                    <Input type="checkbox" className="form-check-input"
                                                                        checked={values.IsCompulsory}
                                                                        name="IsCompulsory"
                                                                        onChange={(e) => {
                                                                            setState((i) => {
                                                                                const a = { ...i }
                                                                                a.values.IsCompulsory = e.target.checked;
                                                                                return a
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    <FormGroup >
                                                        <Row >
                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    onClick={SaveHandler}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"ImportFieldAdd"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup >
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>

                    </Container>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default ImportFieldAdd
