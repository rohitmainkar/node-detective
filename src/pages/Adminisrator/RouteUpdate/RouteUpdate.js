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

import { MetaTags } from "react-meta-tags";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeText,
    resetFunction
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { breadcrumbReturn, loginCompanyID, loginPartyID, loginUserID, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { mySearchProps } from "../../../components/Common/ComponentRelatedCommonFile/MySearch";
import { Post_RouteUpdate, Post_RouteUpdateSuccess, RouteUpdateListAPI } from "../../../store/Administrator/RouteUpdateRedux/action";
import { PostRouteslist } from "../../../store/Administrator/RoutesRedux/actions";
// import { RouteUpdateList } from "../../../../store/Administrator/RouteUpdateReducer/action";

const RouteUpdate = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IsActive: false
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        RouteUpdateList,
        pageField,
        RoutesList,
        userAccess } = useSelector((state) => ({
            postMsg: state.RouteUpdateReducer.postMsg,
            RouteUpdateList: state.RouteUpdateReducer.RouteUpdateList,
            RoutesList: state.RoutesReducer.RoutesList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));
    const { Data = [] } = RouteUpdateList

    useEffect(() => {
        const page_Id = pageId.ROUTE_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(RouteUpdateListAPI())
        dispatch(PostRouteslist())
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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(Post_RouteUpdateSuccess({ Status: false }))
            // setState(() => resetFunction(fileds, state)) // Clear form values 
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
                    RedirectPath: url.ROUTE_UPDATE,
                }))
            }
        }
        else if (postMsg.Status === true) {
            saveDissable(false);//save Button Is enable function
            dispatch(Post_RouteUpdateSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const RouteName_Options = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const SaveHandler = (event) => {
        event.preventDefault();
        const data = Data.map((index) => ({
            id: index.id,
            Party: index.Party,
            SubParty: index.SubParty,
            Route: index.Route,
        }))
        const jsonBody = JSON.stringify({
            Data: data
        })
        dispatch(Post_RouteUpdate(jsonBody));
    };

   

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "SubPartyName",
        },
        {
            text: "RouteName",
            dataField: "RouteName",

            formatter: (value, row, key) => {

                return (
                    <Select
                        classNamePrefix="select2-selection"
                        defaultValue={{ value: row.Route, label: row.RouteName }}
                        options={RouteName_Options}
                        onChange={e => {
                            row["Route"] = e.value;
                            row["RouteName"] = e.label
                           
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '300px', textAlign: 'center' };
            }
        },
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };
    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>

                    <form onSubmit={SaveHandler} noValidate>
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
                                                    noDataIndication={<div className="text-danger text-center ">Party Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, paginationProps, dispatch, "Route Update")}
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
                                        module={"RouteUpdate"}
                                    />
                                </Col>
                            </Row>
                        </FormGroup >
                            : null
                        }

                        </form>
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

export default RouteUpdate
