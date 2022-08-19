import React, { useEffect, useState } from "react"
import { Row, Col, Modal,  } from "reactstrap"
import MetaTags from 'react-meta-tags'

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb"
import "../../../assets/scss/CustomeTable/datatables.scss"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID, deleteModuleIDSuccess, editModuleID, fetchModelsList,
    updateModuleIDSuccess
} from "../../../store/actions";
import Modules from "./Modules";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { commonDefaultSorted,  commonListPageDelete_UpdateMsgFunction, commonPageOptions, listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const ModulesList = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [modal_center, setmodal_center] = useState(false);

    // get Access redux data
    const { TableListData, editData, deleteAPIResponse, updateAPIResponse } = useSelector((state) => ({
        TableListData: state.Modules.modulesList,
        updateAPIResponse: state.Modules.updateMessage,
        editData: state.Modules.editData,
        deleteAPIResponse: state.Modules.deleteModuleIDSuccess,
    }));

    useEffect(() => {
       
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(fetchModelsList());
    }, []);

    useEffect(() => {
     if(!(userPageAccessState === '')){
        debugger
        var a= document.getElementById("search-bar-0");
        a.focus();
     }
    }, [userPageAccessState]);

    // This UseEffect => Edit Modal Show When Edit Data is true
    useEffect(() => {
        if (editData.Status === true) {
            tog_center()
        }
    }, [editData]);

 
    function tog_center() {
        setmodal_center(!modal_center)
    }
    useEffect(() => {
        if ((updateAPIResponse.Status === true)) {
            
            commonListPageDelete_UpdateMsgFunction(
               // common function parameters ,data type=> object
                {
                    dispatch: dispatch,
                    response: updateAPIResponse,
                    resetAction: updateModuleIDSuccess,
                    afterResponseAction: fetchModelsList
                }
            )
            tog_center()
        }

    }, [updateAPIResponse])

    useEffect(() => {

        if ((deleteAPIResponse.Status === true)) {
            commonListPageDelete_UpdateMsgFunction(
                {
                    dispatch: dispatch,
                    response: deleteAPIResponse,
                    resetAction: deleteModuleIDSuccess,
                    afterResponseAction: fetchModelsList
                }
            )
        }
    }, [deleteAPIResponse])


    //Modules list component table columns 
    const TableColumns = [
        {
            dataField: 'Name',
            text: 'Name',
            sort: true
        }, {
            dataField: 'DisplayIndex',
            text: 'Display Index',
            sort: true
        }, {
            dataField: 'isActive',
            text: 'IsActive',
            sort: true
        },

        // For Edit, Delete ,and View Button Common Code function
        listPageCommonButtonFunction({
            dispatchHook: dispatch,
            deletemsgLable: "Module",
            userPageAccessState: userPageAccessState,
            editActionFun: editModuleID,
            deleteActionFun: deleteModuleID
        })


    ];

    // tag_center -- Control the Edit Modal show and close
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Modules List| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <PaginationProvider
                            pagination={paginationFactory(commonPageOptions(TableListData))}

                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField='id'
                                    columns={TableColumns}
                                    data={TableListData}
                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <Breadcrumb
                                                title={"Count :"}
                                                breadcrumbItem={userPageAccessState.PageHeading}
                                                IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                                                SearchProps={toolkitProps.searchProps}
                                                breadcrumbCount={`Module Count: ${TableListData.length}`}
                                                IsSearchVissible={true}
                                            // RedirctPath={"/moduleMaster"}
                                            />
                                            <Row>
                                                <Col xl="12">
                                                    <div className="table-responsive">
                                                        <BootstrapTable
                                                            keyField={"id"}
                                                            responsive
                                                            bordered={true}
                                                            striped={false}
                                                            defaultSorted={commonDefaultSorted("Name")}
                                                            classes={"table align-middle table-nowrap table-hover"}
                                                            headerWrapperClasses={"thead-light"}
                                                            {...toolkitProps.baseProps}
                                                            {...paginationTableProps}
                                                        />

                                                    </div>
                                                </Col>
                                            </Row>

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
                        <Modal
                            isOpen={modal_center}
                            toggle={() => { tog_center() }}
                            size="xl"
                        >
                            {/* <PartyUIDemo state={editData.Data} /> */}
                            <Modules state={editData.Data} />
                        </Modal>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }

}

export default ModulesList
