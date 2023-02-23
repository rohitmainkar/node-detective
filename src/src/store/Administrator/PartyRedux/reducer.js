import { getAddressTypes } from "./action";
import {
    DELETE_PARTY_ID_SUCCESS,
    EDIT_PARTY_ID_SUCCESS,
    GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_DISTRICT_ON_STATE_SUCCESS,
    GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS,
    GET_PRICELIST_SUCCESS,
    GET_PARTYTYPES_SUCCESS,
    GET_COMPANY_SUCCESS,
    GET_ADDRESSTYPES_SUCCESS,
    GET_PARTY_LIST_API_SUCCESS,
    POST_PARTY_DATA_SUCCESS,
    UPDATE_PARTY_ID_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    partyList: [],
    PartySaveSuccess: { Status: false },
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    DistrictOnState:[],
    PartyTypes:[],
    Company:[],
    AddressTypes:[]
};

const PartyMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // get api
        case GET_PARTY_LIST_API_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
            }

        // post api
     
        case POST_PARTY_DATA_SUCCESS:
            return {
                ...state,
                PartySaveSuccess: action.payload,
            };

        // delete api
        case DELETE_PARTY_ID_SUCCESS:
            return {
                ...state,
                deleteMessage: action.payload,
            };

        // edit api
        case EDIT_PARTY_ID_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            };

        // update api
        case UPDATE_PARTY_ID_SUCCESS:
            return {
                ...state,
                updateMessage: action.payload,
            };

       // GetDistrictOnState API
        case GET_DISTRICT_ON_STATE_SUCCESS:
            return {
              ...state,
              DistrictOnState: action.payload,
            };
  

        //get PriceList
        case GET_PRICELIST_SUCCESS:
            return {
              ...state,
              PriceList: action.payload,
            };
  

          //get addresstypes
         case GET_ADDRESSTYPES_SUCCESS:
            return {
            ...state,
            AddressTypes: action.payload,
            };

            //get partytypes
            case GET_PARTYTYPES_SUCCESS:
          return {
               ...state,
            PartyTypes: action.payload,
               };


        //get company
        case GET_COMPANY_SUCCESS:
         return {
         ...state,
        Company: action.payload,
         };


          // GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
        case GET_PARTTYPE_BY_DIVISIONTYPES_ID_SUCCESS:
            return {
              ...state,
              PartyTypes: action.payload,
            };

            // GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
        case GET_COMPANY_BY_DIVISIONTYPES_ID_SUCCESS:
            return {
              ...state,
              CompanyName: action.payload,
            };
        default:
            return state;
    }
};
export default PartyMasterReducer;