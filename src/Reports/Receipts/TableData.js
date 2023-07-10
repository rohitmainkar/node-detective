import { date_dmy_func } from "../../components/Common/CommonFunction"
import { toWords } from "../Report_common_function"

export const Address = [
    "Address"
]

export const Details = [
    "ReceiptDetail"
]





export const ReceiptDetails = (doc, data) => {
    debugger
    let stringNumber = toWords(Number(data.AmountPaid))
    var ReceiptDetails = [

        [`Rs ${stringNumber}`],

    ]

    return ReceiptDetails;
}

export const AddressDetails = (data) => {


    var AddressDetails = [

        [`${data.Party}`],
        [`Address:${data.Address === null ? "" : data.Address}`],
        [`Contact:${data.MobileNo}`],
        [`Date:${date_dmy_func(data.ReceiptDate)}`],
        ""


    ]
    return AddressDetails;
}


