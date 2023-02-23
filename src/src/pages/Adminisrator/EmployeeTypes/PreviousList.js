import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Button, Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import { AlertState } from "../../../store/actions";

import "../../../assets/scss/CustomTable2/datatables.scss"
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { deleteEmployeeTypeIDSuccess, delete_EmployeeType_ID, editEmployeeTypeId, getEmployeeTypelist, PostEmployeeTypeSubmitSuccess, updateEmployeeTypeIDSuccess } from "../../../store/Administrator/EmployeeTypeRedux/action";
import EmployeeTypesMaster from "./EmployeeTypesMaster";
import { listPageCommonButtonFunction } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";



const EmployeeTypeList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  // get Access redux data
  const { TableListData, editData, updateMessage, deleteMessage,RoleAccessModifiedinSingleArray,PostAPIResponse } = useSelector(
    (state) => ({
      TableListData: state.EmployeeTypeReducer.EmployeeTypeList,
      editData: state.EmployeeTypeReducer.editData,
      updateMessage: state.EmployeeTypeReducer.updateMessage,
      deleteMessage: state.EmployeeTypeReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.EmployeeTypeReducer.PostEmployeeType,
    })
  );

  useEffect(() => {
    const locationPath = history.location.pathname
    let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [RoleAccessModifiedinSingleArray])

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(getEmployeeTypelist());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateEmployeeTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getEmployeeTypelist,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateEmployeeTypeIDSuccess({ Status: false }));
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
      dispatch(deleteEmployeeTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getEmployeeTypelist,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteEmployeeTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(deleteMessage.Message),
        })
      );
    }
  }, [deleteMessage]);


  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
        dispatch(PostEmployeeTypeSubmitSuccess({ Status: false }))
        tog_center();
        dispatch(getEmployeeTypelist());
        dispatch(AlertState({
            Type: 1,
            Status: true,
            Message: PostAPIResponse.Message,
        }))
    }

    else if ((PostAPIResponse.Status === true)) {
        dispatch(PostEmployeeTypeSubmitSuccess({ Status: false }))
        dispatch(AlertState({
            Type: 4,
            Status: true,
            Message: JSON.stringify(PostAPIResponse.Message),
            RedirectPath: false,
            AfterResponseAction: false
        }));
    }
}, [PostAPIResponse.Status])
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
      text: "Is PartyConnection",
      dataField: "IsPartyConnection",
      sort: true,
    },

    {
      text: "Is SCM ",
      dataField: "IsSCM",
      sort: true,
    },
    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      ButtonMsgLable: "Employee Type",
      deleteName:"Name",
      userPageAccessState: userPageAccessState,
      editActionFun: editEmployeeTypeId,
      deleteActionFun: delete_EmployeeType_ID
    })

  ];

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>EmployeeTypeList| FoodERP-React FrontEnd</title>
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
                      breadcrumbCount={`EmployeeType Count: ${TableListData.length}`}
                      IsSearchVissible={true}
                      ExcelData={TableListData}
                      isExcelButtonVisible={true}
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
            <EmployeeTypesMaster state={editData.Data} relatatedPage={"/EmployeeType"} pageMode={editData.pageMode} />
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

export default EmployeeTypeList;