import * as actionType from "./actionTypes";

export const SavePartyTypeAction = (config = {}) => ({
  type: actionType.SAVE_PARTY_TYPE_API,
  config,
});

export const SavePartyTypeAPISuccess = (resp) => ({
  type: actionType.SAVE_PARTY_TYPE_API_SUCCESS,
  payload: resp,
});

/// get Empoyee list 
export const getPartyTypelist = () => ({
  type: actionType.GET_PARTY_TYPE_LIST,
});

export const getPartyTypelistSuccess = (resp) => ({
  type: actionType.GET_PARTY_TYPE_LIST_SUCCESS,
  payload: resp,
});

////delete api
export const delete_PartyType_ID = (config = {}) => ({
  type: actionType.DELETE_PARTY_TYPE_ID,
  config,
});
export const deletePartyTypeIDSuccess = (resp) => ({
  type: actionType.DELETE_PARTY_TYPE_ID_SUCCESS,
  payload: resp
});

// edit api
export const editPartyTypeId = (config = {}) => ({
  type: actionType.EDIT_PARTY_TYPE_ID,
  config,
})
export const editPartyTypeSuccess = (editData) => ({
  type: actionType.EDIT_PARTY_TYPE_ID_SUCCESS,
  payload: editData,
})

// update api
export const updatePartyTypeAction = (config = {}) => ({
  type: actionType.UPDATE_PARTY_TYPE_ID,
  config,
})
export const updatePartyTypeIDSuccess = (resp) => ({
  type: actionType.UPDATE_PARTY_TYPE_ID_SUCCESS,
  payload: resp,
})