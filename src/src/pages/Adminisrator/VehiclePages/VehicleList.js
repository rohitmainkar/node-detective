import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VehicleMaster from "./VehicleMaster";
import {
  deleteVehicleTypeIDSuccess,
  updateVehicleTypeIDSuccess,
  getMethodForVehicleList,
  editVehicleTypeId,
  delete_VehicleType_ID,
  PostMethod_ForVehicleMasterSuccess
} from "../../../store/Administrator/VehicleRedux/action";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";


const VehicleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.VehicleReducer.VehicleList,
      postMsg: state.VehicleReducer.postMsg,
      editData: state.VehicleReducer.editData,
      updateMsg: state.VehicleReducer.updateMsg,
      deleteMsg: state.VehicleReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getMethodForVehicleList,
    editId: editVehicleTypeId,
    deleteId: delete_VehicleType_ID,
    postSucc: PostMethod_ForVehicleMasterSuccess,
    updateSucc: updateVehicleTypeIDSuccess,
    deleteSucc: deleteVehicleTypeIDSuccess,
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    const page_Id = pageId.VEHICLE_lIST
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(page_Id))
    dispatch(getMethodForVehicleList());
  }, []);

  const { pageField ,userAccess=[]} = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.VEHICLE_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={VehicleMaster}
            masterPath={url.VEHICLE}
            ButtonMsgLable={"Vehicle"}
            deleteName={"VehicleNumber"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default VehicleList;