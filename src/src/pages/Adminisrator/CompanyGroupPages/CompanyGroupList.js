import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CompanyGroupMaster from "./CompanyGroupMaster";
import {
  deleteCompanyGroupTypeIDSuccess,
  updateCompanyGroupTypeIDSuccess,
  getMethodForCompanyGroupList,
  editCompanyGroupTypeId,
  delete_CompanyGroupType_ID,
  PostMethod_ForCompanyGroupMasterSuccess,
} from "../../../store/Administrator/CompanyGroupRedux/action";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";

const CompanyGroupList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.CompanyGroupReducer.CompanyGroupList,
      editData: state.CompanyGroupReducer.editData,
      updateMsg: state.CompanyGroupReducer.updateMessage,
      deleteMsg: state.CompanyGroupReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.CompanyGroupReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getMethodForCompanyGroupList,
    editId: editCompanyGroupTypeId,
    deleteId: delete_CompanyGroupType_ID,
    postSucc: PostMethod_ForCompanyGroupMasterSuccess,
    updateSucc: updateCompanyGroupTypeIDSuccess,
    deleteSucc: deleteCompanyGroupTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.COMPANYGROUP_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getMethodForCompanyGroupList());
  }, []);

  const { pageField, userAccess } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.COMPANYGROUP_lIST} /> */}

      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={CompanyGroupMaster}
            masterPath={url.COMPANYGROUP}
            ButtonMsgLable={"Company Group"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default CompanyGroupList;