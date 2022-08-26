import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Button, Col, Modal, Row } from "reactstrap";
import {
  getRole,
  deleteRole,
  editRoleId,
  updateSuccess,
  deleteSuccess,
} from "../../../store/Administrator/RoleMasterRedux/action";

import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumb from "../../../components/Common/Breadcrumb"

import "../../../assets/scss/CustomeTable/datatables.scss";
import RoleMaster from "./RoleMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { listPageCommonButtonFunction } from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";
import { AlertState } from "../../../store/actions";

const RoleList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage } = useSelector(
    (state) => ({
      TableListData: state.RoleMaster_Reducer.pages,
      editData: state.RoleMaster_Reducer.editData,
      updateMessage: state.RoleMaster_Reducer.updateMessage,
      deleteMessage: state.RoleMaster_Reducer.deleteMessage,
    })
  );

  useEffect(() => {
    const userAcc = CommonGetRoleAccessFunction(history)
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [history])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getRole());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getRole,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMessage.Message),
        })
      );
    }
  }, [updateMessage]);

  useEffect(() => {
    if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {
      dispatch(deleteSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getRole,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);

  // Edit Modal Show When Edit Data is true
  useEffect(() => {
    if (editData.Status === true) {
      tog_center();
    }
  }, [editData]);

  function tog_center() {
    setmodal_center(!modal_center);
  }

  const defaultSorted = [
    {
      dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc", // desc or asc
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: TableListData.length,
    custom: true,
  };

  const pagesListColumns = [
    {
      text: "Name",
      dataField: "Name",
      sort: true,
    },
    {
      text: "Description",
      dataField: "Description",
      sort: true,
    },
    {
      text: "Active",
      dataField: "isActive",
      sort: true,
    },
    {
      text: "Is SCM Role",
      dataField: "isSCMRole",
      sort: true,
    },
    {
      text: "Dashboard",
      dataField: "Dashboard",
      sort: true,
    },

    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      deletemsgLable: "Role",
      userPageAccessState: userPageAccessState,
      editActionFun: editRoleId,
      deleteActionFun: deleteRole
  })
   
  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Role List| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content">
          <PaginationProvider pagination={paginationFactory(pageOptions)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                defaultSorted={defaultSorted}
                data={TableListData}
                columns={pagesListColumns}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Breadcrumbs
                      title={"Count :"}
                      breadcrumbItem={userPageAccessState.PageHeading}
                      IsButtonVissible={(userPageAccessState.RoleAccess_IsSave) ? true : false}
                      SearchProps={toolkitProps.searchProps}
                      breadcrumbCount={`Role Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                    // RedirctPath={`/RoleMaster`}
                    />
                    <Row>
                      <Col xl="12">
                        <div className="table-responsive">
                          <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            classes={"table  table-bordered"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="align-items-md-center mt-30">
                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                        <PaginationListStandalone {...paginationProps} />
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
          <Modal
            isOpen={modal_center}
            toggle={() => {
              tog_center();
            }}
            size="xl"
          >
            <RoleMaster state={editData.Data} relatatedPage={userPageAccessState.ActualPagePath} />
          </Modal>
        </div>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}

export default RoleList;
