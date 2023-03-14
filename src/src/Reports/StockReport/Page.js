import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data } from "./DemoData";

var pageHeder = function (doc,data) {
    style.pageBorder(doc,data);
    style.pageHeder(doc,data);     //Title
    style.reportHeder1(doc,data);
    style.reportHeder2(doc,data);
    style.reportHeder3(doc,data);    //Invoice ID , Date  
    
};
function reportBody(doc, data) { 
    style.tableBody(doc, data);
}
function pageFooter(doc,data) {
    style.pageFooter(doc,data);
    style.reportFooter(doc,data);
}

 const StockReport=()=> {
   const data = Data
    var doc = new jsPDF('l', 'pt', 'a4');
    pageHeder(doc,data);
    reportBody(doc, data);
    pageFooter(doc,data);
     doc.setProperties({
          title: "Report"
      });
    window.open(doc.output('dataurlnewwindow'));
    return(<></>);
}
export default StockReport;