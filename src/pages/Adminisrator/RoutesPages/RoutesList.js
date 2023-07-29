import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RoutesMaster from "./RoutesMaster";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import {
  deleteRoutesID_Success,
  deleteRoutesID,
  editRoutesID,
  SaveRoutesMasterSuccess,
  GetRoutesList,
  updateRoutesIDSuccess,
  GetRoutesListSuccess
} from "../../../store/Administrator/RoutesRedux/actions";
import { loginCompanyID, loginSelectedPartyID} from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const RoutesList = (props) => {

  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      goBtnLoading: state.RoutesReducer.goBtnLoading,
      listBtnLoading: state.RoutesReducer.listBtnLoading,
      tableList: state.RoutesReducer.RoutesList,
      postMsg: state.RoutesReducer.PostData,
      editData: state.RoutesReducer.editData,
      updateMsg: state.RoutesReducer.updateMessage,
      deleteMsg: state.RoutesReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const { pageField, goBtnLoading } = reducers;

  const action = {
    getList: GetRoutesList,
    editId: editRoutesID,
    deleteId: deleteRoutesID,
    postSucc: SaveRoutesMasterSuccess,
    updateSucc: updateRoutesIDSuccess,
    deleteSucc: deleteRoutesID_Success,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.ROUTES_LIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    if (!(loginSelectedPartyID() === 0)) {
      goButtonHandler()
    }
    return () => {
      dispatch(GetRoutesListSuccess([]));
    }
  }, []);

  const goButtonHandler = () => {
    try {
      if (loginSelectedPartyID() === 0) {
        customAlert({ Type: 3, Message: "Please Select Party" });
        return;
      };
      const jsonBody = JSON.stringify({
        CompanyID: loginCompanyID(),
        PartyID: loginSelectedPartyID(),
      });

      dispatch(GetRoutesList(jsonBody));
    } catch (error) { }
    return
  };

  const partyOnChngeButtonHandler = (e) => {
    dispatch(GetRoutesListSuccess([]));
  }

  return (
    <React.Fragment>
      <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
      <div className="page-content">

        <PartyDropdown_Common
          goBtnLoading={goBtnLoading}
          goButtonHandler={goButtonHandler}
          changeButtonHandler={partyOnChngeButtonHandler}
        />

        {
          (pageField) &&
          <div className="mt-n1">
            <CommonPurchaseList
              action={action}
              reducers={reducers}
              showBreadcrumb={false}
              MasterModal={RoutesMaster}
              masterPath={url.ROUTES}
              newBtnPath={url.ROUTES}
              ButtonMsgLable={"Routes"}
              deleteName={"Name"}
              goButnFunc={goButtonHandler}
            />
          </div>

        }
      </div>

    </React.Fragment>
  )
}

export default RoutesList;
