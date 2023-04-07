import { DEPOSITOR_BANK_FILTER_SUCCESS, RECEIPT_GO_BUTTON_MASTER_SUCCESS, SAVE_RECEIPT_MASTER_SUCCESS, } from "./actionType"


const INIT_STATE = {
  ReceiptGoButton: [],
  DepositorBank:[],
  postMsg: { Status: false },
}

const ReceiptReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
      return {
        ...state,
        ReceiptGoButton: action.payload,
      }

      case DEPOSITOR_BANK_FILTER_SUCCESS:
        return {
          ...state,
          DepositorBank: action.payload,
        }

    case SAVE_RECEIPT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    default:
      return state
  }
}

export default ReceiptReducer