export const discountCalculate = (row,index) => {
    
    let rate = 0
    let qty = 0
    let gstPercentage = 0
    let disCountAmt = 0


    if (!(row.Rate == '')) { rate = row.Rate; };
    if (!(row.Qty == '')) { qty = row.Qty; };

    let baseAmt = parseFloat(rate) * parseFloat(qty)
    if (!baseAmt) { baseAmt = 0 }

    if (index.DiscountType === 2) {
        disCountAmt = (baseAmt * index.Discount) / 100
    } else {
        disCountAmt = (parseFloat(qty) * index.Discount)
    }

    if (!(row.GST == '')) {
        gstPercentage = row.GST;
    };

    let discountBaseAmt = (baseAmt - disCountAmt)
    const gstAmt = ((discountBaseAmt * parseFloat(gstPercentage) / 100))
    const total = gstAmt + parseFloat(discountBaseAmt)
    const CGST = (gstAmt / 2).toFixed(2);
    const SGST = (gstAmt / 2).toFixed(2);
    gstAmt.toFixed(2)
    disCountAmt.toFixed(2)
    discountBaseAmt.toFixed(2)
    const tAmount = total.toFixed(2)

    return { discountBaseAmt, disCountAmt, gstAmt, tAmount, CGST, SGST }
}