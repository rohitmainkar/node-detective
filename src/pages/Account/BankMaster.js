import React, { useEffect, useState, } from "react";
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
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction,
} from "../../components/Common/validationFunction";
import { SaveButton } from "../../components/Common/CommonButton";

import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../components/Common/CommonFunction";
import * as url from "../../routes/route_url";
import * as pageId from "../../routes/allPageID"
import * as mode from "../../routes/PageMode"
import {
    editBankIDSuccess,
    saveBankMaster,
    saveBankMaster_Success,
    updateBankID,
    updateBankIDSuccess
} from "../../store/Account/BankRedux/action";

const BankMaster = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IFSC: "",
        BranchName: "",
        AccountNo: "",
        IsSelfDepositoryBank: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        updateMsg,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankReducer.postMsg,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.BANK//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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
                const { id, Name, BranchName, IFSC, AccountNo, IsSelfDepositoryBank } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;
                hasValid.BranchName.valid = true;
                hasValid.IFSC.valid = true;
                hasValid.AccountNo.valid = true;
                hasValid.IsSelfDepositoryBank.valid = true;

                values.id = id
                values.Name = Name;
                values.BranchName = BranchName;
                values.IFSC = IFSC;
                values.AccountNo = AccountNo;
                values.IsSelfDepositoryBank = IsSelfDepositoryBank;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editBankIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankMaster_Success({ Status: false }))
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
                    RedirectPath: url.BANK_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveBankMaster_Success({ Status: false }))
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
            setState(() => resetFunction(fileds, state)) // Clear form values 
            history.push({
                pathname: url.BANK_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBankIDSuccess({ Status: false }));
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



    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    BranchName: values.BranchName,
                    IFSC: values.IFSC,
                    AccountNo: values.AccountNo,
                    IsSelfDepositoryBank: values.IsSelfDepositoryBank,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Party: loginPartyID(),
                    Company: loginCompanyID(),
                });

                if (pageMode === mode.edit) {
                    dispatch(updateBankID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(saveBankMaster({ jsonBody, btnId }));
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
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Name </Label>
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
                                                        </FormGroup>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">IFSC </Label>
                                                                <Input
                                                                    name="IFSC"
                                                                    id="txtName"
                                                                    value={values.IFSC}
                                                                    type="text"
                                                                    className={isError.IFSC.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter IFSC"
                                                                    autoComplete='off'
                                                                    autoFocus={true}
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                        dispatch(Breadcrumb_inputName(event.target.value))
                                                                    }}
                                                                />
                                                                {isError.IFSC.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.IFSC}</span>
                                                                )}
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">Branch Name </Label>
                                                                <Input
                                                                    name="BranchName"
                                                                    id="txtName"
                                                                    value={values.BranchName}
                                                                    type="text"
                                                                    className={isError.BranchName.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter BranchName"
                                                                    autoComplete='off'
                                                                    autoFocus={true}
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                        dispatch(Breadcrumb_inputName(event.target.value))
                                                                    }}
                                                                />
                                                                {isError.BranchName.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.BranchName}</span>
                                                                )}
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">Account No </Label>
                                                                <Input
                                                                    name="AccountNo"
                                                                    id="txtName"
                                                                    value={values.AccountNo}
                                                                    type="text"
                                                                    className={isError.AccountNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter AccountNo"
                                                                    autoComplete='off'
                                                                    autoFocus={true}
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                        dispatch(Breadcrumb_inputName(event.target.value))
                                                                    }}
                                                                />
                                                                {isError.AccountNo.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.AccountNo}</span>
                                                                )}
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-5">
                                                                <Row className="justify-content-md-left">
                                                                    <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label" style={{ width: '180px' }}>Is Self Depository Bank</Label>
                                                                    <Col md={2} style={{ marginTop: '9px' }} >
                                                                        <div className="form-check form-switch form-switch-md mb-3">
                                                                            <Input type="checkbox" className="form-check-input"
                                                                                checked={values.IsSelfDepositoryBank}
                                                                                name="IsSelfDepositoryBank"
                                                                                onChange={(e) => {
                                                                                    setState((i) => {
                                                                                        const a = { ...i }
                                                                                        a.values.IsSelfDepositoryBank = e.target.checked;
                                                                                        return a
                                                                                    })
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        </Row>

                                                        <FormGroup >
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode}
                                                                        onClick={saveHandeller}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"BankMaster"}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
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

export default BankMaster
