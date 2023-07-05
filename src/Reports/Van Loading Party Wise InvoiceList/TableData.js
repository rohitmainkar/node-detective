import { date_dmy_func } from "../../components/Common/CommonFunction";

export const columns = [
    "SR No.",
    "ItemName",
    // "BatchCode",
    "MRP",
    "Box",
    // "Outer ",
    "Pcs",
    "Quantity",
    // "Unit",
];
export const columns1 = [
    "SR No.",
    "Invoice Date",
    "Invoice Number",
    "Party Name",
    "Amount",
    "Cash ",
    "Cheque",
    "Credit",
    "Online RTGS/M Wallet",
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    "",
    '',
    "",
    ""
]

export const Rows = (data) => {
    const { InvoiceItems = [] } = data
    // InvoiceItemNames.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalMRP = 0
    let TotalBox = 0
    let TotalPcs = 0
    let TotalQuantity = 0
    let SrNO = 1


    const groupedItems = InvoiceItems.reduce((accumulator, currentItem) => {

        const { ItemName, MRP, BatchCode, Box, Outer, Quantity, UnitName, MRPValue, PiecesQuantity, BoxQuantity } = currentItem;
        const key = ItemName + '_' + MRP;
        if (accumulator[key]) {
            accumulator[key].PiecesQuantity += Number(PiecesQuantity);
            accumulator[key].Quantity += Number(Quantity);
            accumulator[key].BoxQuantity += Number(BoxQuantity);


        } else {
            accumulator[key] = { ItemName, MRPValue, BatchCode, Box, Outer, Quantity: Number(Quantity), UnitName, PiecesQuantity: Number(PiecesQuantity), BoxQuantity: Number(BoxQuantity) };
        }
        return accumulator;
    }, {});


    // Object.values(groupedItems).forEach((element, key) => {
    InvoiceItems.forEach((element, key) => {

        const tableitemRow = [
            SrNO++,
            element.ItemName,
            // element.BatchCode,
            element.MRPValue,
            Number(element.BoxQty).toFixed(2),
            Number(element.PiecesQty).toFixed(2),
            element.QtyInNo,
        ];

        function totalLots() {
            TotalMRP = Number(TotalMRP) + Number(element.MRPValue)
            TotalBox = Number(TotalBox) + Number(element.BoxQty)
            TotalPcs = Number(TotalPcs) + Number(element.PiecesQty)
            TotalQuantity = Number(TotalQuantity) + Number(element.QtyInNo)
        };

        function totalrow() {
            return [
                " ",
                "Total",
                "",
                `${Number(TotalBox).toFixed(2)}`,
                ` `,
                `${Number(TotalQuantity).toFixed(2)}`,
                // `${Number(TotalQuantity).toFixed(2)}`,


            ];
        };
        returnArr.push(tableitemRow);
        data["tableTot"] = totalLots()


        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const Rows1 = (data) => {
    const { InvoiceParent = [] } = data
    // InvoiceItemNames.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalAmount = 0
    let SrNO = 1

    InvoiceParent.forEach((element, key) => {
        const tableitemRow = [
            SrNO++,
            date_dmy_func(element.InvoiceDate),
            element.FullInvoiceNumber,
            element.CustomerName,
            element.GrandTotal,
            element.Cash,
            element.Cheque,
            element.Credit,
            element.OnlineRTGS,
        ];


        function totalLots() {
            TotalAmount = Number(TotalAmount) + Number(element.GrandTotal)

        };

        function totalrow() {
            return [
                " ",
                "Total",
                "",
                ``,
                `${Number(TotalAmount).toFixed(2)}`,
                "",
                ``,
                ``,


            ];
        };


        // if (Gst === 0) { Gst = element.GSTPercentage };
        // let aa = { TotalCGst: 0, totalSGst: 0 }
        // if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        // else {
        //     // returnArr.push(totalrow());
        //     returnArr.push(tableitemRow);
        //     data["tableTot"] = totalLots()
        // }
        returnArr.push(tableitemRow);
        data["tableTot"] = totalLots()

        if (key === InvoiceParent.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ReportHederRows = (doc, data) => {

    const Address = data.PartyDetails.PartyAddress
    const Routes = data.PartyDetails.RouteName
    const DriverName = data.PartyDetails.DriverName
    const VehicleNo = data.PartyDetails.VehicleNo

    var reportArray = [
        ["Address:", `${Address}`,],

        // ["Routes:", `${Routes}                   DriverName:${  DriverName}                      Vehicle No:${VehicleNo}     `],
        ["Routes:", `${Routes} `, " DriverName:", `${DriverName}`, "Vehicle No:", `${VehicleNo}`],


        //

        // [`FSSAI :f23dfxxxxxwe55`, ,`To Date:      ${data.Todate}`  ],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
} 