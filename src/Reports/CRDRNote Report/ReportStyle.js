
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { numberWithCommas, toWords } from "../Report_common_function";
import { convertDatefunc, convertOnlyTimefunc, convertTimefunc } from "../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 379, 30, 16);//vertical line (left)
    doc.line(570, 379, 570, 16);//vertical line (Right)
    doc.line(570, 379, 30, 379);//horizontal line (Bottom)   
}
let initial_y = 0

export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFont(undefined, 'bold')
    doc.setFontSize(15)
    if (data.NoteType === "CreditNote") {
        doc.text('CREDIT NOTE', 270, 34, "center")

    } else {
        doc.text(' GOODS CREDIT NOTE', 270, 34, "center")

    }
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 43, 30, 43) //horizontal line 1 billby upper
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Party", 80, 52)  //bill by 
    doc.text('Customer', 280, 52) //billed to
    doc.text('Note Details', 440, 52)
    

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 43, 30, 43) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 55, 30, 55);//horizontal line 3
    // doc.line(409, 69, 30, 69)//horizontal line 4
    // doc.line(30, 350, 30, 16);//vertical left 1
    // doc.line(570, 350, 570, 16);//vertical left 2
    doc.line(408, 145, 408, 43);//vertical right 1
    doc.line(220, 145, 220, 43);//vertical right 2

    doc.line(570, 145, 30, 145) //horizontal line 1 billby upper

    var BilledByStyle = {
        margin: {
            top: 45, left: 30, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'Normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 190,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",
        startY: 55,

    };
    var BilledToStyle = {
        margin: {
            top: 45, left: 220, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'Normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 188,
                halign: 'lfet',
            },
        },
        tableLineColor: "black",
        startY: 55,

    };
    var DetailsOfTransportStyle = {
        margin: {
            top: 45, left: 408, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'Normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 162,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 55,

    };

    // let initial_y = 0
    const priLength = () => {

        let final_y = doc.previousAutoTable.finalY

        if (final_y > initial_y) {
            initial_y = final_y
        }

    }

    doc.autoTable(table.BilledBy, table.BilledByRow(data), BilledByStyle);
    console.log("first", doc.previousAutoTable.finalY)
    priLength()

    doc.autoTable(table.BilledTo, table.BilledToRow(data), BilledToStyle);
    console.log("Second", doc.previousAutoTable.finalY)
    priLength()

    doc.autoTable(table.Details, table.DetailsRow(data), DetailsOfTransportStyle);
    console.log("third", doc.previousAutoTable.finalY)
    priLength()



}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont(undefined, 'bold')
    // doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 65)
    // doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 65)
}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    // doc.line(408, 42, 408, 16);//vertical right 1
    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.InvoiceNumber}`, 415, 25) //Invoice Id
    var date = convertDatefunc(data.InvoiceDate)
    var time = convertOnlyTimefunc(data.CreatedOn)
    doc.text(`Invoice Date: ${date}  ${time}`, 415, 40) //Invoice date


}


export const reportFooterForGoodsCredit = (doc, data) => {
    debugger
    const a = data.CRDRInvoices.map((data) => ({
        GrandTotal: Number(data.GrandTotal),
        PaidAmount: Number(data.PaidAmount),
      
    }));
    var GrandTotal = 0;
    var PaidAmount = 0;
    
    a.forEach(arg => {
        GrandTotal += arg.GrandTotal;
        PaidAmount += arg.PaidAmount;
       
    });
    const BalAmt = GrandTotal-PaidAmount
    let stringNumber = toWords(Number(PaidAmount))
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(435, 295, 435, 379);//vertical right1 Qr Left 1
    // doc.line(360, 308, 360, 379);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(435, 340, 30, 340);//horizontal line (Bottom)


    doc.setFontSize(9)

    // doc.text(`CGST:`, 440, 310,)
    // doc.text(`${totalCGST.toFixed(2)}`, 560, 310, 'right')

    doc.text(`Paid Amount:`, 440, 322,)
    doc.text(`${PaidAmount.toFixed(2)}`, 560, 322, 'right')

    doc.text(`Balance Amount:`, 440, 334,)
    doc.text(` ${BalAmt.toFixed(2)}`, 560, 334, 'right')

    doc.text(`Total Amount:`, 440, 346,)
    doc.text(`${GrandTotal.toFixed(2)}`, 560, 346, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount Paid :`, 439, 365,)
    const PaidTotal = Math.round(PaidAmount)
    const Total = numberWithCommas((PaidTotal).toFixed(2))
    doc.text(`${Total}`, 560, 365, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.text(`Prepared by `, 35, 785,)
    doc.text(`Received By `, 180, 785,)
    doc.setFontSize(10)
    // doc.text(`${data.PartyName} `, 390, 785,)
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 140, 811,)
    doc.setFontSize(9)
    doc.text(`Signature `, 400, 811,)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
     of the nature and quantity which it/these purports to be `, 34, 321,)
    // doc.text(`A/C No: 2715500354564564564564565456456 IFSC Code:BKID00015422 `, 34, 318,)
    // doc.setFontSize(10)

    // doc.text(`Note Comment : ${data.Narration}`, 34, 328,)
    doc.setFontSize(8)
    // doc.setFont(undefined, 'bold')
    doc.text(`Rupees: ${stringNumber}`, 33, 305,)
    doc.addFont("Arial", 'Normal')
    doc.setFontSize(11)
    doc.text(` Prepared By`, 34, 370,)
    doc.text(`Authorized Signatory `, 320, 370,)
    doc.setFontSize(9)
    doc.addFont("Arial", 'Normal')



}







export const reportFooterForCredit = (doc, data) => {
    debugger

    const a = data.CRDRInvoices.map((data) => ({
        GrandTotal: Number(data.GrandTotal),
        PaidAmount: Number(data.PaidAmount),
      
    }));
    var GrandTotal = 0;
    var PaidAmount = 0;
    
    a.forEach(arg => {
        GrandTotal += arg.GrandTotal;
        PaidAmount += arg.PaidAmount;
       
    });
    const BalAmt = GrandTotal-PaidAmount
    let stringNumber = toWords(Number(PaidAmount))
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1)
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    // doc.setLineWidth(0)

    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(435, 295, 435, 379);//vertical right1 Qr Left 1
    // doc.line(360, 308, 360, 379);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(435, 340, 30, 340);//horizontal line (Bottom)


    doc.setFontSize(9)

    // doc.text(`CGST:`, 440, 310,)
    // doc.text(`${totalCGST.toFixed(2)}`, 560, 310, 'right')

    // doc.text(`Paid Amount:`, 440, 322,)
    // doc.text(`${PaidAmount.toFixed(2)}`, 560, 322, 'right')

    // doc.text(`Balance Amount:`, 440, 334,)
    // doc.text(` ${BalAmt.toFixed(2)}`, 560, 334, 'right')

    // doc.text(`Total Amount:`, 440, 346,)
    // doc.text(`${GrandTotal.toFixed(2)}`, 560, 346, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount Paid :`, 439, 365,)
    const PaidTotal = Math.round(PaidAmount)
    const Total = numberWithCommas((PaidTotal).toFixed(2))
    doc.text(`${Total}`, 560, 365, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.text(`Prepared by `, 35, 785,)
    doc.text(`Received By `, 180, 785,)
    doc.setFontSize(10)
    // doc.text(`${data.PartyName} `, 390, 785,)
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 140, 811,)
    doc.setFontSize(9)
    doc.text(`Signature `, 400, 811,)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
     of the nature and quantity which it/these purports to be `, 34, 321,)
    // doc.text(`A/C No: 2715500354564564564564565456456 IFSC Code:BKID00015422 `, 34, 318,)
    // doc.setFontSize(10)

    // doc.text(`Note Comment : ${data.Narration}`, 34, 328,)
    doc.setFontSize(8)
    // doc.setFont(undefined, 'bold')
    doc.text(`Rupees: ${stringNumber}`, 33, 305,)
    doc.addFont("Arial", 'Normal')
    doc.setFontSize(11)
    doc.text(` Prepared By`, 34, 370,)
    doc.text(`Authorized Signatory `, 320, 370,)
    doc.setFontSize(9)
    doc.addFont("Arial", 'Normal')



}

export const tableBodyforCreditGoods = (doc, data) => {
    var options1 = {
        didParseCell: (data1) => {
            if (data1.row.cells[4].raw === "isaddition") {
                data1.row.cells[0].colSpan = 1
                data1.row.cells[1].colSpan = 4
                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2

                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[1].styles.fontSize = 8
                data1.row.cells[5].styles.fontSize = 8
                data1.row.cells[7].styles.fontSize = 8
                data1.row.cells[9].styles.fontSize = 8

                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
            }
            if (data1.row.cells[0].raw === "HSN Item Name") {
                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2
            }
        },
        margin: {
            left: 30, right: 22, top: 43
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 7,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 4,
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 160,
            },
            1: {
                columnWidth: 30,
                halign: 'right',
            },
            2: {
                columnWidth: 45,
                halign: 'right',
            },
            3: {
                columnWidth: 40,
                halign: 'right',
            },
            4: {
                columnWidth: 47,
                halign: 'right',
            },
            5: {
                columnWidth: 30,
                halign: 'right',
            },
            6: {
                columnWidth: 40,
                halign: 'right',
            },
            7: {
                columnWidth: 30,
                halign: 'right',
            },
            8: {
                columnWidth: 40,
                fontStyle: 'bold',
                halign: 'right',
            },
            
        },
        tableLineColor: "black",

        startY: initial_y,// 45,
        // startY:60
    };


    doc.autoTable(table.columns1, table.Rows1(data), options1,);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
        showHead: 'never',
        theme: '',
    };
    doc.autoTable(optionsTable4);
}


export const tableBodyforCredit = (doc, data) => {
    var options = {
        didParseCell: (data1) => {
            
            if (data1.row.cells[0].raw === "Total Amount Paid") {
              
                data1.row.cells[0].colSpan = 3
                 
                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[3].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
               

                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
            }

        
        },
        margin: {
            left: 30, right: 22, top: 43
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 9,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 4,
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 100,
                halign: 'right',
            },
            2: {
                columnWidth: 100,
                halign: 'right',
            },
            3: {
                columnWidth: 100,
                halign: 'right',
            },
            4: {
                columnWidth: 100,
                halign: 'right',
            },

        },
        tableLineColor: "black",

        startY: initial_y,// 45,
        // startY:60
    };


    doc.autoTable(table.columns, table.Rows(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
        showHead: 'never',
        theme: '',
    };
    doc.autoTable(optionsTable4);
}









export const pageFooter = (doc, data, islast = 0, array = []) => {

    const pageCount = doc.internal.getNumberOfPages()
    console.log(pageCount)

    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 40, 390,)
    }

    let condition1 = (array.length - 1 === islast)
    if (condition1) {
        for (let j = 1; j <= pageCount; j++) {
            doc.setPage(j)

            doc.text('PageAll ' + String(j) + ' of ' + String(pageCount), 500, 390,)

        }
    }
}

// original