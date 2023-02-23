import { call, put, takeEvery } from "redux-saga/effects";
import {
  Role_Master_Delete_API,
  Role_Master_Edit_API,
  Role_Master_Get_API,
  Role_Master_Post_API,
  Role_Master_Update_API
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  getRoleSuccess,
  PostSuccess, editSuccess,
  updateSuccess,
  deleteSuccess
} from "./action";
import {
  GET_ROLE_LIST_API,
  POST_ROLE_MASTER,
  EDIT_ROLE_LIST_ID,
  DELETE_ROLE_LIST_ID,
  UPDATE_ROLE_LIST_ID
} from "./actionTypes";

function* Get_Roles_GenratorFunction() {

  try {
    const response = yield call(Role_Master_Get_API);
    yield put(getRoleSuccess(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Submit_Roles_GenratorFunction({ Data }) {

  try {
    const response = yield call(Role_Master_Post_API, Data);
   
    yield put(PostSuccess(response));
  
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Delete_Roles_GenratorFunction({ id }) {
  try {
  
    const response = yield call(Role_Master_Delete_API, id);
   
    yield put(deleteSuccess(response))
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Edit_Roles_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(Role_Master_Edit_API, id);
    response.pageMode = pageMode
    yield put(editSuccess(response));
    console.log("response in saga" , response)
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* Update_Roles_GenratorFunction({ data,ID }) {
  try {
  
    const response = yield call(Role_Master_Update_API, data,ID);
   
    yield put(updateSuccess(response))
  }
  catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* RoleMaster_Saga() {
  yield takeEvery(GET_ROLE_LIST_API, Get_Roles_GenratorFunction);
  yield takeEvery(POST_ROLE_MASTER, Submit_Roles_GenratorFunction);
  yield takeEvery(EDIT_ROLE_LIST_ID, Edit_Roles_GenratorFunction);
  yield takeEvery(DELETE_ROLE_LIST_ID, Delete_Roles_GenratorFunction);
  yield takeEvery(UPDATE_ROLE_LIST_ID, Update_Roles_GenratorFunction);
}

export default RoleMaster_Saga;