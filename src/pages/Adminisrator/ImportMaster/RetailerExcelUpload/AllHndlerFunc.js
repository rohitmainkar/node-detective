
// import { groupBy } from 'lodash';
import { groupBy, date_ymd_func, date_dmy_func, btnIsDissablefunc, loginPartyID, loginUserID, loginCompanyID } from '../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../CustomAlert/ConfirmDialog';
import { InvoiceExcelUpload_save_action, RetailerExcelUpload_save_action } from '../../../../store/Administrator/ImportExcelPartyMapRedux/action';

const XLSX = require('xlsx');





//###############################################################################################


export const readExcelFile = async ({ file, compareParameter }) => {


    try {

        processing(5)

        function processing(t) {
        }


        const reader = new FileReader();
        reader.readAsBinaryString(file);

        const jsonResult = await new Promise(function (myResolve, myReject) {

            reader.onload = (e) => {
                try {
                    const bstr = e.target.result;
                    const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const result = XLSX.utils.sheet_to_json(worksheet);
                    myResolve(result)
                } catch (g) {
                    myReject([])
                }

            }

        });


        let invalidMsg = []
        let count = 0
        const comparefilter = compareParameter.filter(f => (f.Value !== null))
        if (comparefilter.length === 0) {
            invalidMsg.push(`Import filed Not Map`)
        }
    
        jsonResult.forEach((r1, k) => {
            comparefilter.forEach((c1) => {
                if (c1.ControlTypeName === "Date") { r1[c1.Value] = date_ymd_func(r1[c1.Value]) }
                const regExp = RegExp(c1.RegularExpression)

                if (((r1[c1.Value]) || (c1.IsCompulsory))) {

                    if (!(regExp.test(r1[c1.Value]))) {
                        invalidMsg.push(`${c1.Value} :${r1[c1.Value]} is invalid Format`)
                    }

                }
            })
            count = count + (70 / jsonResult.length)
            processing(count)
        })
        if (invalidMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(invalidMsg),
            })
            return []
        }

        return jsonResult

    } catch (e) { }

}

//###############################################################################################


export async function retailer_FileDetails({ compareParameter = [], readjson = [], }) {


    const fileFiled = {}

    await compareParameter.forEach(ele => {
        if ((ele.Value !== null)) {
            fileFiled[ele.FieldName] = ele.Value
        }
    })
    

    let invoiceNO = []
    let partyNO = []
    let invoiceDate = []
    let amount = 0

    readjson.forEach((index) => {

        var invoiceFound = invoiceNO.find(i => (i === (index[fileFiled.InvoiceNumber])))
        var partyFound = partyNO.find(i => (i === (index[fileFiled.Party])))
        var dateFound = partyNO.find(i => (i === (index[fileFiled.InvoiceDate])))
        amount = Number(amount) + Number(index[fileFiled.GrandTotal]);

        if ((invoiceFound === undefined)) {
            invoiceNO.push((index[fileFiled.InvoiceNumber]))
        };
        if ((partyFound === undefined)) {
            partyNO.push((index[fileFiled.Party]))
        };
        if ((dateFound === undefined)) {
            invoiceDate.push(date_dmy_func((index[fileFiled.InvoiceDate])))
        };

    })

    const invoice = await groupBy(readjson, (index) => {
        return (index[fileFiled.InvoiceNumber])
    })


    return { fileFiled, invoice, invoiceDate, amount, invoiceNO, partyNO }
}

//###############################################################################################





export const retailer_SaveHandler = async ({
    event,
    dispatch,
    compareParameter,
    readJsonDetail,
    partySelect,
    priceListSelect,
    retailerId }) => {
    

    event.preventDefault();
    const btnId = event.target.id
    try {
        btnIsDissablefunc({ btnId, state: true })
        const parArr = {}

        await compareParameter.forEach(ele => {
            if ((ele.Value !== null)) {
                parArr[ele.FieldName] = ele.Value
            }
        })
        const outerArr = []



        readJsonDetail.forEach(ele => {
            var a = {
                "Name": ele[parArr.Name] ? ele[parArr.Name] : "",
                "PriceList": priceListSelect.value,
                "PartyType": retailerId,
                "Company": loginCompanyID(),
                "PAN": ele[parArr.PAN] ? ele[parArr.PAN] : "",
                "Email": ele[parArr.Email] ? ele[parArr.Email] : "",
                "MobileNo": ele[parArr.MobileNo] ? ele[parArr.MobileNo] : "",
                "AlternateContactNo": ele[parArr.AlternateContactNo] ? ele[parArr.AlternateContactNo] : "",
                "State": ele[parArr.State] ? ele[parArr.State] : "",
                "District": ele[parArr.District] ? ele[parArr.District] : "",
                "City": ele[parArr.City] ? ele[parArr.City] : "",
                "GSTIN": ele[parArr.GSTIN] ? ele[parArr.GSTIN] : "",
                "MkUpMkDn": ele[parArr.MkUpMkDn] ? ele[parArr.MkUpMkDn] : false,
                "CreatedBy": loginUserID(),
                "UpdatedBy": loginUserID(),
                "PartySubParty": [
                    {
                        "Party": partySelect.value,
                        "CreatedBy": loginUserID(),
                        "UpdatedBy": loginUserID()
                    }
                ],
                "PartyAddress": [
                    {
                        "Address": ele[parArr.Address] ? ele[parArr.Address] : "",
                        "FSSAINo": ele[parArr.FSSAINo] ? ele[parArr.FSSAINo] : "",
                        "FSSAIExipry": ele[parArr.FSSAIExipry] ? ele[parArr.FSSAIExipry] : "",
                        "PIN": ele[parArr.PIN] ? ele[parArr.PIN] : "",
                        "IsDefault": ele[parArr.IsDefault] ? ele[parArr.IsDefault] : true,
                        "fssaidocument": ele[parArr.fssaidocument] ? ele[parArr.fssaidocument] : "",
                    }
                ],
                "PartyPrefix": [
                    {
                        "Orderprefix": "",
                        "Invoiceprefix": "",
                        "Grnprefix": "",
                        "Receiptprefix": "",
                        "WorkOrderprefix": "",
                        "MaterialIssueprefix": "",
                        "Demandprefix": "",
                        "IBChallanprefix": "",
                        "IBInwardprefix": ""
                    }
                ]
            }

            outerArr.push(a)

        });

        const jsonBody = JSON.stringify({ "BulkData": outerArr })
        dispatch(RetailerExcelUpload_save_action({ jsonBody, btnId }));

    } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
};