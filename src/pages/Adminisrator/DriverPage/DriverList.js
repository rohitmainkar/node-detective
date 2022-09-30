import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Col, Modal, Row } from "reactstrap";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/scss/CustomeTable/datatables.scss";
import DriverMaster from "./DriverMaster";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  deleteDriverTypeIDSuccess,
  updateDriverTypeIDSuccess,
  getMethodForDriverList,
  editDriverTypeId,
  delete_DriverType_ID,
  PostMethod_ForDriverMasterSuccess,
} from "../../../store/Administrator/DriverRedux/action";
import { AlertState } from "../../../store/actions";
import { listPageCommonButtonFunction }
  from "../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";

const DriverList = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modal_center, setmodal_center] = useState(false);

  const {
    TableListData,
    editData,
    updateMessage,
    deleteMessage,
    PostAPIResponse,
    RoleAccessModifiedinSingleArray,
  } = useSelector(
    (state) => ({
      TableListData: state.DriverReducer.DriverList,
      editData: state.DriverReducer.editData,
      updateMessage: state.DriverReducer.updateMessage,
      deleteMessage: state.DriverReducer.deleteMessage,
      RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
      PostAPIResponse: state.DriverReducer.PostDataMessage,
    })
  );
  console.log("TableListData", TableListData)
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
    dispatch(getMethodForDriverList());
  }, []);

  // This UseEffect => UpadateModal Success/Unsucces  Show and Hide Control Alert_modal
  useEffect(() => {

    if (updateMessage.Status === true && updateMessage.StatusCode === 200) {
      dispatch(updateDriverTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: updateMessage.Message,
          AfterResponseAction: getMethodForDriverList,
        })
      );
      tog_center();
    } else if (updateMessage.Status === true) {
      dispatch(updateDriverTypeIDSuccess({ Status: false }));
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
      dispatch(deleteDriverTypeIDSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 1,
          Status: true,
          Message: deleteMessage.Message,
          AfterResponseAction: getMethodForDriverList,
        })
      );
    } else if (deleteMessage.Status === true) {
      dispatch(deleteDriverTypeIDSuccess({ Status: false }));
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
      dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
      tog_center();
      dispatch(getMethodForDriverList());
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: PostAPIResponse.Message,
      }))
    }

    else if ((PostAPIResponse.Status === true)) {
      dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
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
      text: "Date Of Birth",
      dataField: "DOB",
      sort: true,
    },
    {
      text: "Address",
      dataField: "Address",
      sort: true,
    },
    {
      text: "UID",
      dataField: "UID",
      sort: true,
    },

    // For Edit, Delete ,and View Button Common Code function
    listPageCommonButtonFunction({
      dispatchHook: dispatch,
      ButtonMsgLable: "DriverType",
      deleteName: "Name",
      userPageAccessState: userPageAccessState,
      editActionFun: editDriverTypeId,
      deleteActionFun: delete_DriverType_ID
    })
  ];


  


    return (
      <React.Fragment>
        </React.Fragment>
       )
}

export default DriverList;
