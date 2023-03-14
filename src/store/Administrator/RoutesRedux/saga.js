import { call, put, takeEvery } from "redux-saga/effects";
import {
    deleteRoutesID_Success,
    editRoutesIDSuccess,
    SaveRoutesMasterSuccess,
    GetRoutesListSuccess,
    updateRoutesIDSuccess
} from "./actions";
import {
    Routes_Delete_API,
    Routes_Edit_API,
    Routes_Post_API,
    Routes_Get_API,
    Routes_Update_API
} from "../../../helpers/backend_helper";
import {
    DELETE_ROUTES_ID,
    EDIT_ROUTES_ID,
    GET_ROUTES_LIST,
    SAVE_ROUTES_MASTER,
    UPDATE_ROUTES_ID
} from "./actionTypes";
import { CommonConsole, loginJsonBody } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";

function* save_Routes_Master_GenFun({ config = {} }) {
    try {
        const response = yield call(Routes_Post_API, config);
        yield put(SaveRoutesMasterSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Routes_List_GenratorFunction() { //Routes List Api Using Post Method
    const filters = loginJsonBody()
    try {
        const response = yield call(Routes_Get_API, filters);
        yield put(GetRoutesListSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* Edit_Routes_ID_GenratorFunction({ config = {} }) {
    const { btnmode } = config;
    try {
        const response = yield call(Routes_Edit_API, config);
        response.pageMode = btnmode
        yield put(editRoutesIDSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Update_Routes_ID_GenratorFunction({ config = {}}) {
    try {
        const response = yield call(Routes_Update_API, config);
        yield put(updateRoutesIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* Delete_Routes_ID_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(Routes_Delete_API, config);
        yield put(deleteRoutesID_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* RoutesSaga() {
    yield takeEvery(GET_ROUTES_LIST, Routes_List_GenratorFunction)
    yield takeEvery(SAVE_ROUTES_MASTER, save_Routes_Master_GenFun)
    yield takeEvery(EDIT_ROUTES_ID, Edit_Routes_ID_GenratorFunction)
    yield takeEvery(UPDATE_ROUTES_ID, Update_Routes_ID_GenratorFunction)
    yield takeEvery(DELETE_ROUTES_ID, Delete_Routes_ID_GenratorFunction)
}

export default RoutesSaga;