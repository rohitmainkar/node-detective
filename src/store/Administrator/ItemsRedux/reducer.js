import {
    DELETE_ITEM_ID_SUCCESS,
    EDIT_ITEM_ID_SUCCESS,
    GET_BASEUNIT_FOR_DROPDOWN_SUCCESS,
    GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS,
    GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS,
    GET_ITEM_LIST_API_SUCCESS,
    GET_MRPTYPE_FOR_DROPDOWN_SUCCESS,
    GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS,
    POST_ITEM_DATA_SUCCESS,
    UPDATE_ITEM_ID_SUCCESS
} from "./actionType";


const INIT_STATE = {
    pages: [],
    postMessage: { Status: false },
    deleteRoleID: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    ItemGroupList: [],
    BaseUnit: [],
    CategoryType:[],
    CategoryByCategoryType:{Data:[],key:null},
    SubCategoryByCategoryType:{Data:[],key:null},
    ImageType:[],
    MRPType:[],
};

const ItemMastersReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_ITEM_LIST_API_SUCCESS:
            return {
                ...state,
                pages: action.payload,
            }

        case GET_BASEUNIT_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                BaseUnit: action.payload,
            }

        // get group itms
        case GET_ITEM_GROUP_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                ItemGroupList: action.payload,
            }

        case POST_ITEM_DATA_SUCCESS:
            return {
                ...state,
                postMessage: action.payload,
            };

        // delete api
        case DELETE_ITEM_ID_SUCCESS:
            return {
                ...state,
                deleteMessage: action.payload,
            };

        // edit api
        case EDIT_ITEM_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api
        case UPDATE_ITEM_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
            };

        case GET_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                CategoryType: action.payload,
            }

        case GET_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                CategoryByCategoryType: action.payload,
            }

        case GET_SUB_CATEGORY_BY_CATEGORYTYPE_FOR_DROPDOWN_SUCCESS:
            return {
                ...state,
                SubCategoryByCategoryType: action.payload,
            }

            case GET_IMAGETYPE_FOR_DROPDOWN_SUCCESS:
                return {
                    ...state,
                    ImageType: action.payload,
                }
    
                case GET_MRPTYPE_FOR_DROPDOWN_SUCCESS:
                    return {
                        ...state,
                        MRPType: action.payload,
                    }
        default:
            return state;
    }
};
export default ItemMastersReducer;
