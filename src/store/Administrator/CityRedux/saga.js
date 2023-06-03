import { call, put, takeEvery } from "redux-saga/effects";
import {
    saveCityMaster_Success,
} from "./action";
import {
    Post_City_Master_API,
} from "../../../helpers/backend_helper";
import {
    SAVE_CITY_MASTER,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* Save_Method_ForCityMaster_GenFun({ config }) {             // Save API
    debugger
    try {
        debugger
        const response = yield call(Post_City_Master_API, config);
        debugger
        yield put(saveCityMaster_Success(response));
    } catch (error) { CommonConsole(error) }
}


function* CitySaga() {
    yield takeEvery(SAVE_CITY_MASTER, Save_Method_ForCityMaster_GenFun)
   
}

export default CitySaga;