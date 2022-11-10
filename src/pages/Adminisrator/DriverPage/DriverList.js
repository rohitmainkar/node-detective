import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import DriverMaster from "./DriverMaster";
import {
  deleteDriverTypeIDSuccess,
  updateDriverTypeIDSuccess,
  getMethodForDriverList,
  editDriverTypeId,
  delete_DriverType_ID,
  PostMethod_ForDriverMasterSuccess,
} from "../../../store/Administrator/DriverRedux/action";

import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { DRIVER } from "../../../routes/route_url";
import { useHistory } from "react-router-dom";

const DriverList = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const reducers = useSelector(
    (state) => ({
      tableList: state.DriverReducer.DriverList,
      editData: state.DriverReducer.editData,
      updateMsg: state.DriverReducer.updateMessage,
      deleteMsg: state.DriverReducer.deleteMessage,
      postMsg: state.DriverReducer.PostDataMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );


  const action = {
    getList: getMethodForDriverList,
    editId: editDriverTypeId,
    deleteId: delete_DriverType_ID,
    postSucc: PostMethod_ForDriverMasterSuccess,
    updateSucc: updateDriverTypeIDSuccess,
    deleteSucc: deleteDriverTypeIDSuccess

  }

  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(106))
    dispatch(getMethodForDriverList())

  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={DriverMaster}
            masterPath={DRIVER}
            ButtonMsgLable={"Driver"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default DriverList;
