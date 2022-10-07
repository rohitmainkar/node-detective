import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  getItemList,
  PostItemDataSuccess,
  updateItemSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster/index";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";


const ItemsList = (props) => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMsg: state.ItemMastersReducer.updateMessage,
      deleteMsg: state.ItemMastersReducer.deleteMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.ItemMastersReducer.postMessage,
      pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const action = {
      getList: getItemList,
      editId: editItemId,
      deleteId: deleteItemID,
      postSucc: PostItemDataSuccess,
      updateSucc: updateItemSuccess,
      deleteSucc: deleteItemIdSuccess
    }
  
  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldSuccess([]))
    dispatch(commonPageField(21))
    dispatch(getItemList());
  }, []);

  const { pageField } = reducers

  return (
    <React.Fragment>
      {
        (pageField.length > 0) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={ItemsMaster}
            masterPath={"/ItemMaster/index"}
            ButtonMsgLable={"Item"}
            deleteName={"id"}
          />
          : null
      }

    </React.Fragment>
  )
}
 
export default ItemsList;
