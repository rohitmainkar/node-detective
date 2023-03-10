import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginPartyID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Post_Route_Update_API, Route_Update_List_API } from "../../../helpers/backend_helper";
import { Post_RouteUpdateSuccess, RouteUpdateListSuccess } from "./action";
import { POST_ROUTE_UPDATE, ROUTE_UPDATE_LIST } from "./actionType";

//Routes List Api Using Post Method
function* RouteUpdate_List_GenratorFunction() {
    const jsonBody = {
        "Party": loginPartyID(),
    }
    try {
        const response = yield call(Route_Update_List_API, jsonBody);
        yield put(RouteUpdateListSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Post_RouteUpdate_GenratorFunction({data}) {
    // const jsonBody = {
    //     "Party": loginPartyID(),
    // }
    try {
        const response = yield call(Post_Route_Update_API, data);
        yield put(Post_RouteUpdateSuccess(response));
    } catch (error) { CommonConsole(error) }
}


function* RouteUpdateSaga() {
    yield takeEvery(ROUTE_UPDATE_LIST, RouteUpdate_List_GenratorFunction)
    yield takeEvery(POST_ROUTE_UPDATE, Post_RouteUpdate_GenratorFunction)

}

export default RouteUpdateSaga;