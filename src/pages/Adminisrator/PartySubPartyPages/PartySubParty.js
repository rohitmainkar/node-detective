import React, { useEffect, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Label,
    Row,
    Table,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
    editPartySubPartySuccess,
    postPartySubParty,
    postPartySubPartySuccess,
    updatePartySubParty,
    updatePartySubPartySuccess
} from "../../../store/Administrator/PartySubPartyRedux/action";
import {
    AlertState,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    get_Division_ForDropDown,
    get_Party_ForDropDown
} from "../../../store/Administrator/ItemsRedux/action";
import { Tbody, Thead } from "react-super-responsive-table";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { createdBy, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";

const PartySubParty = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    const fileds = {
        id: "",
        Party: "",
        Division: "",
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState("");
    const [modalCss, setModalCss] = useState(false);
    const [PartyData, setPartyData] = useState([]);
    const [Division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [Party_dropdown_Select, setParty_dropdown_Select] = useState("");
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        Divisions,
        Party,
        updateMsg,
        pageField,
        userAccess } = useSelector((state) => ({
            postMsg: state.PartySubPartyReducer.postMsg,
            Divisions: state.ItemMastersReducer.Division,
            Party: state.ItemMastersReducer.Party,
            updateMsg: state.PartySubPartyReducer.updateMsg,
            pageField: state.CommonPageFieldReducer.pageField,
            userAccess: state.Login.RoleAccessUpdateData,
        }));

    useEffect(() => {
        const page_Id = pageId.PARTY_SUB_PARTY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
                const { id, Party, Division } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Party.valid = true;
                hasValid.Division.valid = true;

                values.id = id
                values.Party = { label: Party, value: Party };
                values.Division = { label: Division, value: Division };

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Party))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editPartySubPartySuccess({ Status: false }))
        }
    }, [])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postPartySubPartySuccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values 
            saveDissable(false);//save Button Is enable function
            dispatch(Breadcrumb_inputName(''))
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
                    RedirectPath: url.PARTY_SUB_PARTY_lIST,
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
            saveDissable(false);//save Button Is enable function
            dispatch(postPartySubPartySuccess({ Status: false }))
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
                pathname: url.PARTY_SUB_PARTY_lIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            saveDissable(false);//Update Button Is enable function
            dispatch(updatePartySubPartySuccess({ Status: false }));
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

    const DivisionValues = Divisions.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const PartyValues = Party.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerDivision(e) {
        setDivision_dropdown_Select(e)
    }

    function handllerParty(e) {
        setParty_dropdown_Select(e)
    }

    /// Role Table Validation
    function AddPartyHandler() {

        const find = PartyData.find((element) => {
            return element.value === Party_dropdown_Select.values
        });

        if (Party_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setPartyData([...PartyData, Party_dropdown_Select]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "Party already Exists ",
            }));
        }
    }

    // For Delete Button in table
    function UserRoles_DeleteButton_Handller(tableValue) {
        setPartyData(PartyData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }

    const SaveHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            const arr = PartyData.map(i => ({
                Party: values.Division.value,
                SubParty: i.value,
                CreatedBy: createdBy(),
                UpdatedBy: createdBy(),
            }))
            const jsonBody = JSON.stringify(arr);
            saveDissable(true);//save Button Is dissable function
            if (pageMode === "edit") {
                dispatch(updatePartySubParty(jsonBody, values.id,));
            }
            else {
                dispatch(postPartySubParty(jsonBody));
            }
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                        <BreadcrumbNew userAccess={userAccess} pageId={pageId.PARTY_SUB_PARTY} />
                        {/* <Breadcrumb pageHeading={userPageAccessState.PageHeading} /> */}

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <Row>
                                                        <FormGroup className="mb-3">
                                                            <Row>
                                                                <Col sm="4">
                                                                    <FormGroup className="mb-1">
                                                                        <Label htmlFor="validationCustom01">{fieldLabel.Division} </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                name="Division"
                                                                                value={values.Division}
                                                                                isSearchable={true}
                                                                                className="react-dropdown"
                                                                                classNamePrefix="dropdown"
                                                                                options={DivisionValues}
                                                                                onChange={(hasSelect, evn) => {
                                                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                                                    handllerDivision(hasSelect)
                                                                                }}
                                                                            />
                                                                            {isError.Division.length > 0 && (
                                                                                <span className="text-danger f-8"><small>{isError.Division}</small></span>
                                                                            )}
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>

                                                        <Row>
                                                            <Col sm="4">
                                                                <FormGroup>
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.Party}</Label>
                                                                    <Select
                                                                        name="Party"
                                                                        value={values.Party}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={PartyValues}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                            handllerParty(hasSelect)
                                                                        }}
                                                                    />
                                                                    {isError.Party.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.Party}</small></span>
                                                                    )}
                                                                </FormGroup>
                                                            </Col>

                                                            <Col sm={2} style={{ marginTop: '16px' }} >
                                                                <Button
                                                                    type="button"
                                                                    className=" button_add"
                                                                    color="btn btn-outline-primary border-2 font-size-12"
                                                                    onClick={() =>
                                                                        AddPartyHandler()
                                                                    }
                                                                >
                                                                    <i className="dripicons-plus"></i>
                                                                </Button>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col sm={3} style={{ marginTop: '28px' }}>
                                                                {PartyData.length > 0 ? (
                                                                    <div className="table">
                                                                        <Table className="table table-bordered  text-center" >
                                                                            <Thead>
                                                                                <tr>
                                                                                    <th>Party</th>
                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {PartyData.map((TableValue) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            {TableValue.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                UserRoles_DeleteButton_Handller(TableValue.value)
                                                                                            }} >
                                                                                            </i>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </Tbody>
                                                                        </Table>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                    </>
                                                                )}
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <SaveButton pageMode={pageMode}
                                                                        userAcc={userPageAccessState}
                                                                        editCreatedBy={editCreatedBy}
                                                                        module={"PartySubParty"}
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
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PartySubParty

