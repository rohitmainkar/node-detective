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
    saveGroupMaster,
    saveGroupMaster_Success,
    updateGroupIDSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,

    resetFunction
} from "../../../components/Common/validationFunction";
import { getGroupTypeslist } from "../../../store/Administrator/GroupTypeRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    btnIsDissablefunc,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { saveMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";

const InvoiceConfiguration = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        PaymentQR: "",
        HSNCodeDigit: "",
        TCSAmountRound: false,
        InvoiceAmountRound: false,
        Invoicea4: false,
        ShowBatch: false,
        AddressInInvoice: false,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [hsnDropOption] = useState([{ value: 1, label: "4 Digits" }, { value: 2, label: "6 Digits" }, { value: 2, label: "8 Digits" }])
    const [editCreatedBy, seteditCreatedBy] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        updateMsg,
        pageField,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GroupReducer.saveBtnloading,
            postMsg: state.GroupReducer.postMsg,
            updateMsg: state.GroupReducer.updateMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.INVOICE_CONFIGURATION
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getGroupTypeslist())

    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);


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

                hasValid.Name.valid = true;
                hasValid.GroupTypeName.valid = true;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editGroupIDSuccess({ Status: false }))
        }
    }, [])



    useEffect(() => saveMsgUseEffect({
        postMsg, pageMode,
        history, dispatch,
        postSuccss: saveGroupMaster_Success,
        resetFunc: { fileds, state, setState },
        listPath: url.GROUP_lIST
    }), [postMsg])


    useEffect(() => {
        if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
            setState(() => resetFunction(fileds, state))// Clear form values
            history.push({
                pathname: url.GROUP_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateGroupIDSuccess({ Status: false }));
            customAlert({
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



    const onchangeHandler = async (event, key, type) => {
        debugger
        const file = event.target.files[0]

        const convertBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    resolve(fileReader.result)
                };
                fileReader.onerror = (error) => {
                    reject(error)
                }
            })
        }
        const base64 = await convertBase64(file);
        setState((i) => {
            const a = { ...i }
            a.values.PaymentQR = base64;
            return a
        })

    }

    const SaveHandler = async (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                const jsonBody = JSON.stringify({
                    Name: values.Name,

                });

                // dispatch(saveGroupMaster({ jsonBody, btnId }));

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
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <form noValidate>

                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <FormGroup className="mb-2 col col-sm-4 ">
                                                    <Label htmlFor="validationCustom01">{fieldLabel.PaymentQR}</Label>
                                                    <Input type="file" className="form-control "
                                                        name="image"
                                                        id="file"
                                                        accept=".jpg, .jpeg, .png"
                                                        onChange={(event) => { onchangeHandler(event, "ImageUpload") }}
                                                    />

                                                </FormGroup>
                                                <Col md="4" >
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01"> {fieldLabel.HSNCodeDigit} </Label>
                                                        <Col sm={12} >
                                                            <Select
                                                                name="HSNCodeDigit"
                                                                value={values.HSNCodeDigit}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={hsnDropOption}
                                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}

                                                            />

                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.TCSAmountRound} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    name="Sunday"
                                                                    checked={values.TCSAmountRound}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.TCSAmountRound = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                                {/* </Row> */}

                                                <Col sm={8}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={3} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.InvoiceAmountRound} </Label>
                                                            </Col>
                                                            <Col sm={9} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    name="Sunday"
                                                                    checked={values.InvoiceAmountRound}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.InvoiceAmountRound = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>



                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01">{fieldLabel.Invoicea4} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    name="Sunday"
                                                                    checked={values.Invoicea4}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.Invoicea4 = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                                {/* </Row> */}

                                                <Col sm={8}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={3} >
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.ShowBatch} </Label>
                                                            </Col>
                                                            <Col sm={9} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    name="Sunday"
                                                                    checked={values.ShowBatch}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.ShowBatch = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>



                                            </Row>
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            <Col sm={5} >
                                                                <Label htmlFor="validationCustom01">  {fieldLabel.AddressInInvoice} </Label>
                                                            </Col>
                                                            <Col sm={7} >
                                                                <Input
                                                                    style={{ marginLeft: "53px" }}
                                                                    type="checkbox"
                                                                    className="p-2"
                                                                    name="Sunday"
                                                                    checked={values.AddressInInvoice}
                                                                    onChange={(e) => {
                                                                        setState((i) => {
                                                                            const a = { ...i }
                                                                            a.values.AddressInInvoice = e.target.checked;
                                                                            return a
                                                                        })
                                                                    }}
                                                                >
                                                                </Input>

                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                            </Row>


                                            <FormGroup className="mt-1">
                                                <Row>
                                                    <Col sm={2}>
                                                        <SaveButton
                                                            loading={saveBtnloading}
                                                            pageMode={pageMode}
                                                            onClick={SaveHandler}
                                                            userAcc={userPageAccessState}
                                                            editCreatedBy={editCreatedBy}
                                                            module={"GroupMaster"}
                                                        />
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
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

export default InvoiceConfiguration

