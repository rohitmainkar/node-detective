import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import {
  commonPageFieldList,
  commonPageFieldListSuccess
} from "../../../store/actions";
import {
  deleteGroupType_ID,
  deleteGroupType_IDSuccess,
  editGroupTypeId,
  getGroupTypeslist,
  PostGroupTypeSubmitSuccess,
  updateGroupTypeIDSuccess
} from "../../../store/Administrator/GroupTypeRedux/action";
import GroupTypeMaster from "./GroupTypeMaster";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";

const GroupTypeList = (props) => {
  const dispatch = useDispatch();

  const reducers = useSelector(
    (state) => ({
      tableList: state.GroupTypeReducer.GroupType,
      editData: state.GroupTypeReducer.editData,
      updateMsg: state.GroupTypeReducer.updateMessage,
      deleteMsg: state.GroupTypeReducer.deleteMessage,
      postMsg: state.GroupTypeReducer.PostData,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getGroupTypeslist,
    editId: editGroupTypeId,
    deleteId: deleteGroupType_ID,
    postSucc: PostGroupTypeSubmitSuccess,
    updateSucc: updateGroupTypeIDSuccess,
    deleteSucc: deleteGroupType_IDSuccess
  }
  useEffect(() => {
    const page_Id = pageId.GROUPTYPE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getGroupTypeslist())
  }, []);

  const { pageField ,userAccess=[]} = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.GROUPTYPE_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={GroupTypeMaster}
            masterPath={url.GROUPTYPE}
            ButtonMsgLable={"Group Type"}
            deleteName={"Name"}
          />
          : null
      }
    </React.Fragment>
  )
}

export default GroupTypeList;