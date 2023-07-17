import { GET_PDF_REPORT_DATA, GET_PDF_REPORT_DATA_ERROR, GET_PDF_REPORT_DATA_SUCCESS } from "./actionType"

const INIT_STATE = {
  pdfdata: { Status: false },
  ReportBtnLoading: false,
  goBtnLoading: false
}

const PdfReportReducers = (state = INIT_STATE, action) => {
  debugger
  switch (action.type) {
    case GET_PDF_REPORT_DATA:
      return {
        ...state,
        ReportBtnLoading: action.config.btnId,
        goBtnLoading: true
      }

    case GET_PDF_REPORT_DATA_SUCCESS:
      return {
        ...state,
        ReportBtnLoading: false,
        goBtnLoading: false,
        pdfdata: action.payload,

      }

    case GET_PDF_REPORT_DATA_ERROR:
      return {
        ...state,
        ReportBtnLoading: false,
      }
    default:
      return state
  }
}

export default PdfReportReducers;