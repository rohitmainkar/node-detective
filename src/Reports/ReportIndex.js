import InvioceReport from "./InvioceReport/Page";
import ordeRreport from "./OrderReport/Page";
import StockReport from "./StockReport/Page";
import ItemRegisterReport from "./ItemRegisterReport/Page";
import VanLoadingSheet from "./Van Loading Party Wise InvoiceList/Page";
import Receipts from "./Receipts/Page";
import CreditNote from "./CRDRNote Report/Page";
import PartyLedgerReport from "./PratyLedger/Page";
import ReturnReport from "./PurchaseReturnReport/Page";
import CompanyWiseBudgetReport from "./CompanyWiseBugetReport/Page";
import ClaimSummaryReport from "./ClaimReportSummary/Page";
import CustomerWiseReturnReport from "./CustomerWiseReturnReport/Page";


export const order1 = "order1"
export const invoice = "invoice"
export const Stock = "Stock"
export const ItemRegister = "ItemRegisterReport"
export const IBinvoice = "IBinvoice"
export const VanLoadingSheetSKU = "VanLoadingSheetSKU"
export const VanLoadingPartyWiseInvoice = "VanLoadingPartyWiseInvoice"
export const Receipt = "Receipt"
export const Credit = "Credit"
export const PartyLedger = "PartyLedger"
export const Return = "Return"
export const CompanyWiseBudget = "CompanyWiseBudget"
export const ClaimSummary = "ClaimSummary"
export const CustomerWiseReturn = "CustomerWiseReturn"



const generateReport = (resp) => {

    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;
        case invoice:
            InvioceReport(resp.Data)
            break;
        case Stock:
            StockReport(resp.Data)
            break;
        case ItemRegister:
            ItemRegisterReport(resp.Data)
            break;
        case IBinvoice:
            InvioceReport(resp.Data)
            break;
        case VanLoadingPartyWiseInvoice:
            VanLoadingSheet(resp.Data)
            break;
        case Receipt:
            Receipts(resp.Data)
            break;
        case Credit:
            CreditNote(resp.Data)
            break;
        case PartyLedger:
            PartyLedgerReport(resp.Data)
            break;
        case Return:
            ReturnReport(resp.Data)
            break;
        case CompanyWiseBudget:
            CompanyWiseBudgetReport(resp.Data)
            break;
        case ClaimSummary:
            ClaimSummaryReport(resp.Data)
            break;
        case CustomerWiseReturn:
            CustomerWiseReturnReport(resp.Data)
            break;


        default:
            break;
    }
}


export default generateReport;