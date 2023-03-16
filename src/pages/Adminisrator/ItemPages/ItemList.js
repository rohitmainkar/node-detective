import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemID,
  deleteItemIdSuccess,
  editItemId,
  getItemList,
  SaveItemMasterActionSuccess,
  updateItemMasterActionSuccess,
} from "../../../store/Administrator/ItemsRedux/action";
import ItemsMaster from "./ItemMaster/itemIndex";
import CommonListPage from "../../../components/Common/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { ITEM } from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import * as pageId from "../../../routes/allPageID"

const ItemsList = () => {

  const dispatch = useDispatch();
  const reducers = useSelector(
    (state) => ({
      tableList: state.ItemMastersReducer.pages,
      editData: state.ItemMastersReducer.editData,
      updateMsg: state.ItemMastersReducer.updateMsg,
      deleteMsg: state.ItemMastersReducer.deleteMsg,
      userAccess: state.Login.RoleAccessUpdateData,
      postMsg: state.ItemMastersReducer.postMsg,
      pageField: state.CommonPageFieldReducer.pageFieldList
    })
  );

  const action = {
    getList: getItemList,
    editId: editItemId,
    deleteId: deleteItemID,
    postSucc: SaveItemMasterActionSuccess,
    updateSucc: updateItemMasterActionSuccess,
    deleteSucc: deleteItemIdSuccess
  }

  //  This UseEffect => Featch Modules List data  First Rendering
  useEffect(() => {
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(pageId.ITEM_lIST))
    dispatch(getItemList());
  }, []);

  const { pageField,userAccess=[] } = reducers

  return (
    <React.Fragment>
      <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
      {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.ITEM_lIST} /> */}
      {
        (pageField) ?
          <CommonListPage
            action={action}
            reducers={reducers}
            MasterModal={ItemsMaster}
            masterPath={ITEM}
            ButtonMsgLable={"Item"}
            deleteName={"Name"}
          />
          : null
      }

    </React.Fragment>
  )
}

export default ItemsList;
