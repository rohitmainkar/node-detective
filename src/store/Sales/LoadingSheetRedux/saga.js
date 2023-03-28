import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, convertDatefunc, convertTimefunc,  } from "../../../components/Common/CommonFunction";
import { Loading_Sheet_get_API, Loading_Sheet_Go_Button_API, Loading_Sheet_Post_API } from "../../../helpers/backend_helper";
import { LoadingSheetListActionSuccess, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMasterSucccess } from "./action";
import { LOADING_SHEET_LIST_ACTION, LOADING_SHEET_GO_BUTTON_API, SAVE_LOADING_SHEET_MASTER } from "./actionType";

// GoButton Post API for Loading Sheet
function* goBtn_Post_API_GenFun({ filters }) {
     
    try {
        const response = yield call(Loading_Sheet_Go_Button_API, filters);
        response.Data.map((index) => {
            index["Check"] = false
            return index
        });
        yield put(LoadingSheet_GoBtn_API_Succcess(response));
    } catch (error) { CommonConsole(error) }
}

// Post API For Master Page
function* save_LoadingSheet_GenFun({ config }) {
    try {
        const response = yield call(Loading_Sheet_Post_API, config);
        yield put(SaveLoadingSheetMasterSucccess(response));
    } catch (error) { CommonConsole(error) }
}

// Post API For Master Page

function* get_LoadingSheet_List_GenFun({filters}) {
      
  
    try {
          
        const response = yield call(Loading_Sheet_get_API, filters);
        const newList = yield response.Data.map((i) => {
            var date = convertDatefunc(i.Date)
            var time = convertTimefunc(i.CreatedOn)
            i.Date = (`${date} ${time}`)
            return i
    })
        yield put(LoadingSheetListActionSuccess(newList));
    } catch (error) { CommonConsole(error) }
}


function* LoadingSheetSaga() {
    yield takeEvery(LOADING_SHEET_GO_BUTTON_API, goBtn_Post_API_GenFun)
    yield takeEvery(SAVE_LOADING_SHEET_MASTER, save_LoadingSheet_GenFun)
    yield takeEvery(LOADING_SHEET_LIST_ACTION, get_LoadingSheet_List_GenFun)
}

export default LoadingSheetSaga;