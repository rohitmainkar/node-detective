import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    TERMS_AND_CONDITIONS_API_ERROR_ACTION,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API
} from "./actionTypes";

const INIT_STATE = {
    PostData: { Status: false },
    tableList: [],
    updateMessage: { Status: false },
    editData: { Status: false },
    deleteMessage: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
}

const TermsAndConditionsReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API:
            return {
                ...state,
                saveBtnloading: true,

            }

        case POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
                saveBtnloading: false,

            }

            case GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API:
                return {
                    ...state,
                    loading: true,
                }

        case GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                tableList: action.payload,
                loading:false
            }

            case EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API:
                return {
                    ...state,
                    listBtnLoading: action.config.btnId,

                }
    
        case EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                listBtnLoading:false,
                editData: action.payload,
            }

        case UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API:
            return {
                ...state,
                saveBtnloading: true,

            }
        case UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
                saveBtnloading: false,
            }

            case DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }


        case DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                deleteMessage: action.payload,
            }

            case TERMS_AND_CONDITIONS_API_ERROR_ACTION:
                return {
                  ...state,
                  saveBtnloading: false,
                  listBtnLoading: false,
                  loading:false
                };
        default:
            return state
    }
}

export default TermsAndConditionsReducer        