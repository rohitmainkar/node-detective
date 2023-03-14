import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";
import {
  delete_GSTList_API,
  GetGSTList_For_Listpage,
  GoButton_Post_API_For_GSTMaster,
  GST_MasterPage_delete_API,
  Post_GSTMaster_API
} from "../../../helpers/backend_helper";
import {
  deleteGSTForMasterPageSuccess,
  deleteGSTListPageSuccess,
  getGSTListPageSuccess,
  postGoButtonForGST_Master_Success,
  postGSTMasterDataSuccess
} from "./action";
import {
  DELETE_GST_FOR_MASTER_PAGE,
  DELETE_GST_LIST_PAGE,
  GET_GST_LIST_PAGE,
  POST_GO_BUTTON_FOR_GST_MASTER,
  POST_GST_MASTER_DATA
} from "./actionType";

function* Post_GSTMaster_GenratorFunction({ Data }) {
  try {
    const response = yield call(Post_GSTMaster_API, Data);
    yield put(postGSTMasterDataSuccess(response));
  } catch (error) { CommonConsole(error) }
}

//listpage
function* get_GSTListPage_GenratorFunction() {

  try {
    const response = yield call(GetGSTList_For_Listpage);

    yield put(getGSTListPageSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

//delete
function* delete_GSTListPage_GenratorFunction({ CommonID }) {
  try {
    const response = yield call(delete_GSTList_API, CommonID);
    yield put(deleteGSTListPageSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* GSTGoButton_post_GenratorFunction({ data }) {
  try {
    const response = yield call(GoButton_Post_API_For_GSTMaster, data);
    yield put(postGoButtonForGST_Master_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api for GST Master
function* deleteId_for_GSTMaster_GenratorFunction({ id }) {
  try {
    const response = yield call(GST_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(deleteGSTForMasterPageSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* GSTSaga() {
  yield takeEvery(POST_GST_MASTER_DATA, Post_GSTMaster_GenratorFunction);
  yield takeEvery(GET_GST_LIST_PAGE, get_GSTListPage_GenratorFunction);
  yield takeEvery(DELETE_GST_LIST_PAGE, delete_GSTListPage_GenratorFunction);
  yield takeEvery(POST_GO_BUTTON_FOR_GST_MASTER, GSTGoButton_post_GenratorFunction);
  yield takeEvery(DELETE_GST_FOR_MASTER_PAGE, deleteId_for_GSTMaster_GenratorFunction);

}

export default GSTSaga;
