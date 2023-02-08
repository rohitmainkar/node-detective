import InvioceReport from "./InvioceReport/Page";
import ordeRreport from "./OrderReport/Page";
import StockReport from "./StockReport/Page";
import MaterialReport from "./MaterialReport/Page";


export const order1 = "order1"
export const invoice = "invoice"
export const Stock = "Stock"
export const Materialreport1 = "Materialreport1"
export const IBinvoice = "IBinvoice"


const generateReport = (resp) => {
    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;

        case invoice:
            InvioceReport(resp.Data)
            // ordeRreport(resp.Data)
            break;

        case Stock:
            StockReport(resp.Data)
            break;

        case Materialreport1:
            MaterialReport(resp.Data)
            break;
        case IBinvoice:
            InvioceReport(resp.Data)
            // ordeRreport(resp.Data)
            break;


        default:
            break;
    }
}
export default generateReport;