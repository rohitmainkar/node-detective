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
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
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
    postParty_Master_Bulk_Update,
    postParty_Master_Bulk_Update_Success,
} from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { SSDD_List_under_Company } from "../../../store/CommonAPI/SupplierRedux/actions";

const PartyMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [RouteSelect, setRouteSelect] = useState([]);
    const [SelectFieldName, setSelectFieldName] = useState([]);
    const [PartyName, setPartyName] = useState([]);

    const fileds = {
        id: "",
        RoutesName: "",
        PartyName: "",
        SelectField: ""
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        RoutesList,
        SelectField,
        SSDD_List,
        Data
    } = useSelector((state) => ({
        postMsg: state.PartyMasterBulkUpdateReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        Data: state.CreditLimitReducer.goButtonCreditLimit,
        RoutesList: state.RoutesReducer.RoutesList,
        SelectField: state.PartyMasterBulkUpdateReducer.SelectField,
        SSDD_List: state.CommonAPI_Reducer.SSDD_List,
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
        dispatch(SSDD_List_under_Company());
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

    // useEffect(() => {

    //     if ((hasShowloction || hasShowModal)) {
    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             const { id, Route, RouteName } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }
    //             hasValid.RouteName.valid = true;

    //             values.id = id
    //             values.RouteName = { label: RouteName, value: Route };

    //             const jsonBody = JSON.stringify({
    //                 // Item: Item,
    //                 // Bom: Bom,
    //                 // Quantity: parseFloat(Quantity),
    //                 // Party: Party
    //             });
    //             // dispatch(postGoButtonForWorkOrder_Master(jsonBody));

    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             // dispatch(editWorkOrderListSuccess({ Status: false }))
    //             dispatch(Breadcrumb_inputName(hasEditVal.ItemName))
    //         }
    //     }
    // }, [])

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

    const PartyDropdown_Options = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const goButtonHandler = (event) => {
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Route: RouteSelect.value
        });
        dispatch(GoButton_For_Party_Master_Bulk_Update_Add(jsonBody));
    }


    const pagesListColumns = [
        {
            text: "SubPartyName",
            dataField: "SubPartyName",
        },
        {
            text: "Creditlimit",
            dataField: "Creditlimit",
            formatter: (cellContent, user) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Input
                                    id=""
                                    type="text"
                                    defaultValue={user.Creditlimit}
                                    className="col col-sm text-center"
                                // onChange={(e) => CreditlimitHandler(e, user)}
                                />
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const SaveHandler = (event) => {

        event.preventDefault();
        const data = Data.map((index) => ({
            id: index.id,
            Party: index.Party,
            Route: RouteSelect.value,
            SelectField:SelectField.value
         
        }))

        const Find = data.filter((index) => {
            return !(index.Creditlimit === '')
        })
        const jsonBody = JSON.stringify({
            Data: Find
        })

        dispatch(postParty_Master_Bulk_Update(jsonBody));
    }

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
                                                                            value={SelectField}
                                                                            isSearchable={true}
                                                                            // isDisabled={(Data.length > 0) ? true : false}
                                                                            className="react-dropdown"
                                                                            classNamePrefix="dropdown"
                                                                            options={SelectFieldDropdown_options}
                                                                            onChange={(e) => { setSelectFieldName(e) }}
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
                                                                            // isDisabled={(Data.length > 0) ? true : false}
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
                                                                        style={{ width: "100px" }}>{fieldLabel.PartyName} </Label>
                                                                    <div className="col col-6 sm-1">
                                                                    <Select
                                                                        name="PartyName"
                                                                        value={values.PartyName}
                                                                        isSearchable={true}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={PartyDropdown_Options}
                                                                        onChange={(hasSelect, evn) => {
                                                                            onChangeSelect({ hasSelect, evn, state, setState, })
                                                                        }}
                                                                    />
                                                                    </div>
                                                                    {/* {isError.PartyName.length > 0 && (
                                                                            <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                                        )} */}
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

