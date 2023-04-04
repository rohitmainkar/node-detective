import {
    GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS,
    GET_PARTY_TABLE_LIST_SUCCESS,
    SAVE_MANAGEMENT_PARTIES_SUCCESS
} from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    partyList: [],
    employeeList:[]
}

const ManagementPartiesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // post
        case SAVE_MANAGEMENT_PARTIES_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        // After EmployeeID Select Party List API
        case GET_PARTY_TABLE_LIST_SUCCESS:
            return {
                ...state,
                partyList: action.payload,
            }

        // Employee Dropdown List API
        case GET_EMPLOYEE_DROPDWOPN_LIST_SUCCESS:
            return {
                ...state,
                employeeList: action.payload,
            }
        default:
            return state
    }
}

export default ManagementPartiesReducer