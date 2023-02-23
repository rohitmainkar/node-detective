import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForCategoryTypeMasterAPISuccess, } from "./actions";
import {
  deleteCategoryTypeIDSuccess,
  editCategoryTypeIDSuccess,
  getCategoryTypelistSuccess,
  updateCategoryTypeIDSuccess
} from "./actions";
import {
  detelet_CategoryType_List_Api,
  edit_CategoryType_List_Api,
  get_CategoryType_List_Api,
  Post_Category_Type_Master_API,
  update_CategoryType_List_Api
} from "../../../helpers/backend_helper";

import { SpinnerState } from "../../Utilites/Spinner/actions";

import {
  DELETE_CATEGORY_TYPE_ID,
  EDIT_CATEGORY_TYPE_ID,
  GET_CATEGORY_TYPE_LIST,
  POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API,
  UPDATE_CATEGORY_TYPE_ID
} from "./actionTypes";
import { AlertState } from "../../actions";
// post api
function* Post_Method_ForCategoryTypeMaster_GenFun({ data }) {

  try {
    const response = yield call(Post_Category_Type_Master_API, data);
   
    yield put(PostMethod_ForCategoryTypeMasterAPISuccess(response));
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get api
function* Get_CategoryType_List_GenratorFunction() {

  try {
    const response = yield call(get_CategoryType_List_Api);
    yield put(getCategoryTypelistSuccess(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_CategoryType_ID_GenratorFunction({ id }) {
  try {
  
    const response = yield call(detelet_CategoryType_List_Api, id);
   
    yield put(deleteCategoryTypeIDSuccess(response))
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_CategoryType_ID_GenratorFunction({ id,pageMode }) {
  try {
    const response = yield call(edit_CategoryType_List_Api, id);
    response.pageMode=pageMode
    yield put(editCategoryTypeIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_CategoryType_ID_GenratorFunction({ updateData, ID }) {
  try {
  
    const response = yield call(update_CategoryType_List_Api, updateData, ID);
   
    yield put(updateCategoryTypeIDSuccess(response))
  }
  catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* CategoryTypeSaga () {
  yield takeEvery(POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API, Post_Method_ForCategoryTypeMaster_GenFun)
  yield takeEvery(GET_CATEGORY_TYPE_LIST, Get_CategoryType_List_GenratorFunction)
  yield takeEvery(DELETE_CATEGORY_TYPE_ID, Delete_CategoryType_ID_GenratorFunction)
  yield takeEvery(EDIT_CATEGORY_TYPE_ID, Edit_CategoryType_ID_GenratorFunction)
  yield takeEvery(UPDATE_CATEGORY_TYPE_ID, Update_CategoryType_ID_GenratorFunction)

}

export default CategoryTypeSaga;