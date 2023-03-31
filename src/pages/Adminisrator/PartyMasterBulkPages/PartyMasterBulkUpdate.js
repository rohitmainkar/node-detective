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
import Flatpickr from "react-flatpickr";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID
} from "../../../components/Common/CommonFunction";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect, useState } from "react";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import {
    GoButton_For_Party_Master_Bulk_Update_Add,
    GoButton_For_Party_Master_Bulk_Update_AddSuccess,
    postPartyName_for_dropdown,
    postParty_Master_Bulk_Update,
    postParty_Master_Bulk_Update_Success,
    postSelect_Field_for_dropdown,
} from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";


const PartyMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [RouteSelect, setRouteSelect] = useState([]);
    const [Party, setParty] = useState([]);
    const [SelectFieldName, setSelectFieldName] = useState([]);


    const fileds = {
        id: "",
        RoutesName: "",
        PartyName: "",
        SelectField: "",
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [val, setvalue] = useState()
    const [FSSAIExipry, setFSSAIExipry] = useState()


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        RoutesList,
        SelectField,
        PartyName,
        Data
    } = useSelector((state) => ({
        postMsg: state.PartyMasterBulkUpdateReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        Data: state.PartyMasterBulkUpdateReducer.goButton,
        RoutesList: state.RoutesReducer.RoutesList,
        SelectField: state.PartyMasterBulkUpdateReducer.SelectField,
        PartyName: state.PartyMasterBulkUpdateReducer.PartyName,
    }));

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
        const page_Id = pageId.PARTY_MASTER_BULK_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
    }, []);

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 2
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            CompanyID: loginCompanyID(),
            PartyID: loginPartyID(),
            Type: 1
        });
        dispatch(postPartyName_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }))
            dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
            setRouteSelect('')
            setState(() => resetFunction(fileds, state))// Clear form values  
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
                    RedirectPath: url.PARTY_MASTER_BULK_UPDATE,
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg.Status])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const SelectFieldDropdown_options = SelectField.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const PartyDropdown_Options = PartyName.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            Route: RouteSelect.value,
            Type: SelectFieldName.label
        });
        dispatch(GoButton_For_Party_Master_Bulk_Update_Add(jsonBody));
    }

    useEffect(async () => {

        if ((Data.Status === true) && (Data.StatusCode === 200)) {
            dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
            if (pageMode === "other") {
                CustomAlert({
                    Type: 1,
                    Message: Data.Message,
                })
            }
        }
    }, [Data])

    function SelectFieldHandler(event) {

        let val = event.label;
        setvalue(val)
        setSelectFieldName(val)
    }

    function tableSelectHandler(event, user) {

        //     let val = event.target.value;
        //     setvalue(val)

        //    if (val === "") {
        //         user.SelectFieldName = event.target.value;
        //     }
        //     else {
        //         event.target.value = user.SelectFieldName
        //     }
    }

    const pagesListColumns = [
        {
            text: "PartyName",
            dataField: "PartyName",
        },
        {
            text: val,
            dataField: val,
        },
        {
            text: "FSSAIExipry",
            dataField: "FSSAIExipry",
            hidden: SelectFieldName.label === "FSSAINo" ? false : true,
            formatter: () => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Flatpickr
                                    name='fromdate'
                                    //  value={FSSAIExipry}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                        defaultDate: FSSAIExipry
                                    }}
                                //    onChange={setFSSAIExipry}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
        // {
        //     text: "",
        //     dataField: "",
        //     // hidden: SelectFieldName.label === "State" ? false : true,
        //     formatter: (user) => (
        //         <>
        //             <div style={{ justifyContent: 'center' }}>
        //                 <Col>
        //                     <FormGroup className=" col col-sm-4 ">
        //                         <Input
        //                             id=""
        //                             type="text"
        //                             // defaultValue={user.SelectFieldName}
        //                             className="col col-sm text-center"
        //                             onChange={(e) => tableSelectHandler(e, user)}
        //                         />
        //                     </FormGroup>
        //                 </Col>
        //             </div>
        //         </>
        //     ),
        // },
        {
            text: "New value",
            dataField: "Newvalue",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    defaultValue={user.SelectFieldName}
                                    className="col col-sm text-center"
                                    onChange={(e) => tableSelectHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];
    console.log(SelectFieldName)
    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const SaveHandler = (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })
                arr.push(Data)
                const arr = Data.map(i => {
                    Data = {
                        SubPartyID: 2,
                        Value1:SelectFieldName.value
                    }
                })
                const jsonBody = JSON.stringify(arr)({
                    PartyID: loginPartyID(),
                    Route: RouteSelect.value,
                    Type: SelectFieldName.label,
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateGeneralID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(postParty_Master_Bulk_Update({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false })}
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, height: "18cm" }}>
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form onSubmit={SaveHandler} noValidate>
                                    <Row >
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">

                                                    <Row>
                                                        <Col md="4" >
                                                            <FormGroup className=" row  mt-2" >
                                                                <Label className="mt-1"
                                                                    style={{ width: "110px" }}>SelectField </Label>
                                                                <div className="col col-6 sm-1">
                                                                    <Select
                                                                        name="SelectField"
                                                                        value={SelectFieldName}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={SelectFieldDropdown_options}
                                                                        onChange={(e, v) => {
                                                                            SelectFieldHandler(e, v)
                                                                            setSelectFieldName(e, v)
                                                                        }
                                                                        }
                                                                    />
                                                                    {isError.SelectField.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.SelectField}</small></span>
                                                                    )}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md="4" >
                                                            <FormGroup className=" row  mt-2" >
                                                                <Label className="mt-1"
                                                                    style={{ width: "110px" }}>RoutesName </Label>
                                                                <div className="col col-6 sm-1">
                                                                    <Select
                                                                        name="RoutesName"
                                                                        value={RouteSelect}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={RouteName_Options}
                                                                        onChange={(e) => { setRouteSelect(e) }}
                                                                    />
                                                                    {isError.RoutesName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.RoutesName}</small></span>
                                                                    )}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md="3" >
                                                            <FormGroup className=" row  mt-2" >
                                                                <Label htmlFor="validationCustom01" className="mt-1"
                                                                    style={{ width: "100px" }}>PartyName </Label>
                                                                <div className="col col-6 sm-1">
                                                                    <Select
                                                                        name="PartyName"
                                                                        value={Party}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={PartyDropdown_Options}
                                                                        onChange={(e) => { setParty(e) }}
                                                                    />
                                                                </div>
                                                                {isError.PartyName.length > 0 && (
                                                                    <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                                )}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col sm={1}>
                                                            <div className="col col-1 mt-2">
                                                                < Go_Button onClick={(e) => goButtonHandler()} />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <PaginationProvider
                                        pagination={paginationFactory(pageOptions)}
                                    >
                                        {({ paginationProps, paginationTableProps }) => (
                                            <ToolkitProvider
                                                keyField="id"
                                                data={Data}
                                                columns={pagesListColumns}
                                                search
                                            >
                                                {toolkitProps => (
                                                    <React.Fragment>
                                                        <div className="table">
                                                            <BootstrapTable
                                                                keyField={"id"}
                                                                bordered={true}
                                                                striped={false}
                                                                noDataIndication={<div className="text-danger text-center ">PartyMasterbulk Not available</div>}
                                                                classes={"table align-middle table-nowrap table-hover"}
                                                                headerWrapperClasses={"thead-light"}

                                                                {...toolkitProps.baseProps}
                                                                {...paginationTableProps}
                                                            />
                                                            {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                            {mySearchProps(toolkitProps.searchProps)}
                                                        </div>

                                                        <Row className="align-items-md-center mt-30">
                                                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                                <PaginationListStandalone
                                                                    {...paginationProps}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment>
                                                )
                                                }
                                            </ToolkitProvider>
                                        )
                                        }
                                    </PaginationProvider>

                                    {Data.length > 0 ? <FormGroup style={{ marginTop: "-25px" }}>
                                        <Row >
                                            <Col sm={2} className="mt-n4">
                                                <SaveButton pageMode={pageMode}
                                                    onClick={SaveHandler}
                                                    userAcc={userPageAccessState}
                                                    module={"PartyMasterBulkUpdate"}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup >
                                        : null
                                    }
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


export default PartyMasterBulkUpdate

