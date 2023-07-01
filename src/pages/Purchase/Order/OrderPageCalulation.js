import { compareGSTINState } from "../../../components/Common/CommonFunction";

export const orderCalculateFunc = (row, IsComparGstIn) => {

  // Retrieve values from input object
  const rate = Number(row.Rate) || 0;
  const quantity = Number(row.Quantity) || 0;
  const gstPercentage = Number(row.GSTPercentage) || 0;

  // Calculate basic amount
  const basicAmount = rate * quantity;

  // Calculate GST amount
  const gstAmount = (basicAmount * gstPercentage) / 100;

  // Calculate CGST and SGST amounts
  let CGST_Amount = Number((gstAmount / 2).toFixed(2));
  let SGST_Amount = CGST_Amount;
  let IGST_Amount = 0 //initial GST Amount 

  // Calculate rounded GST amount
  const roundedGstAmount = CGST_Amount + SGST_Amount;

  // Calculate total amount
  const totalAmount = gstAmount + basicAmount;

  if (IsComparGstIn) {  //compare Supplier and Customer are Same State by GSTIn Number
    debugger
    let isSameSate = compareGSTINState(IsComparGstIn.GSTIn_1, IsComparGstIn.GSTIn_2)
    if (isSameSate) {// iF isSameSate = true ===not same GSTIn
      CGST_Amount = 0;
      SGST_Amount = 0;
      IGST_Amount = roundedGstAmount.toFixed(2)
    }
  }
  return {
    basicAmount: basicAmount.toFixed(2),
    roundedTotalAmount: totalAmount.toFixed(2),
    roundedGstAmount: roundedGstAmount.toFixed(2),
    CGST_Amount: CGST_Amount.toFixed(2),
    SGST_Amount: SGST_Amount.toFixed(2),
    IGST_Amount
  };
};
