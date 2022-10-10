import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VehicleMaster from "./VehicleMaster";
import {
  deleteVehicleTypeIDSuccess,
  updateVehicleTypeIDSuccess,
  getMethodForVehicleList,
  editVehicleTypeId,
  delete_VehicleType_ID,
  PostMethod_ForVehicleMasterSuccess,
} from "../../../store/Administrator/VehicleRedux/action";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

const VehicleList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.VehicleReducer.VehicleList,
      editData: state.VehicleReducer.editData,
      updateMsg: state.VehicleReducer.updateMessage,
      deleteMsg: state.VehicleReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.VehicleReducer.PostDataMessage,
      pageField: state.CommonPageFieldReducer.pageField
    })
  );

  const action = {
    getList: getMethodForVehicleList,
    editId: editVehicleTypeId,
    deleteId: deleteVehicleTypeIDSuccess,
    postSucc: PostMethod_ForVehicleMasterSuccess,
    updateSucc: updateVehicleTypeIDSuccess,
    deleteSucc: delete_VehicleType_ID
  }


  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(31))
    dispatch(getMethodForVehicleList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={VehicleMaster}
            masterPath={"/VehicleMaster"}
            ButtonMsgLable={"Vehicle"}
            deleteName={"VehicleNumber"}

          />
          : null
      }

    </React.Fragment>
  )
}

export default VehicleList;
