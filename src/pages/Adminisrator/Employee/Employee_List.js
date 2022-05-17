import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import MetaTags from "react-meta-tags";
import { Button } from "reactstrap";
import {
    Modal,
    Col,
    Row,
} from "reactstrap";
// import { useAlert } from "react-alert";
import {
    getEmployeelist,editEmployeeeId,delete_Employee_ID,updateEmployeeIDSuccess
} from "../../../store/Administrator/M_Employee/action";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider, SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, useDispatch } from "react-redux";
import AddEmployee from './AddEmployee';

const Employee_List = () => {
    const [EditId, setId] = useState('')
    // const alert1 = useAlert();
    const dispatch = useDispatch();
    const [deleteIn, setDeleteIn] = useState('');
    const history = useHistory();
    const { SearchBar } = Search;
    const [modal_center, setmodal_center] = useState(false);
     
   
    const { pages,editData,updateMessage} = useSelector((state) => ({
        pages:state.M_EmployeesReducer.pages, 
        // editData:state.CompanyReducer.editData,
        // updateMessage:state.CompanyReducer.updateMessage,
        
    }));
console.log("Data",pages)

useEffect(()=>{
    // dispatch(editModuleID(0));
    dispatch(getEmployeelist());
},[dispatch]);



const deleteHandeler = (id) => { 
    console.log("id",id)
    setDeleteIn(id);
    dispatch(delete_Employee_ID(id));
    dispatch(getEmployeelist());  
};

// useEffect(() => {
//     if (updateMessage.Status === 'true') {
//         dispatch(updateEmployeeIDSuccess({ Status: 'false' }));
//         tog_center()
//         dispatch(getEmployeelist());
//     }
// }, [updateMessage.Status]);

// console.log("updateMessage after useEffect in list ",updateMessage)

// useEffect(() => {
//     if (editData.Status === 'true') {
//         tog_center()
//     }
// }, [editData]);
// console.log("editData",editData)

const EditPageHandler = (id) => {
    dispatch(editEmployeeeId(id));
    console.log("selected id",id)
}
function tog_center() {
    setmodal_center(!modal_center)
}
const pageOptions = {
    sizePerPage: 15,
    totalSize: pages.length,
    custom:true,
};

const pagesListColumns = [
    {
        text: "PageID",
        dataField: "ID",
        sort: true,
        hidden: true,
        formatter: (cellContent, pages) => <>{pages.ID}</>,
    },

    {
        text: "Name",
        dataField: "Name",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.Name}</>,
    },

    {
        text: "Address",
        dataField: "Address",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.Address}</>,
    },

    {
        text: "Mobile",
        dataField: "Mobile",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.Mobile}</>,
    },
    {
        text: "EmailID",
        dataField: "EmailID",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.EmailID}</>,
    },
    {
        text: "BOD",
        dataField: "BOD",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.BOD}</>,
    },
    {
        text: "PAN",
        dataField: "PAN",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.PAN}</>,
    },
    {
        text: "AadharNo",
        dataField: "AadharNo",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.AadharNo}</>,
    },
    {
        text: "WorkingHours",
        dataField: "WorkingHours",
        sort: true,
        formatter: (cellContent, pages) => <>{pages.WorkingHours}</>,
    },
    {
        text: " ",
        dataField: "buttons",
        sort: true,
        formatter: (cellContent, pages) => (
            <>
               <div class="d-flex gap-3" style={{ display: 'flex', justifyContent: 'center' }} >

                    <buton
                        type="button"
                        onClick={() => {
                            EditPageHandler(pages.ID);
                        }}
                        className="badge badge-soft-primary font-size-12"
                        >
                        <i class="mdi mdi-pencil font-size-18" id="edittooltip"></i>
                    </buton>{" "}
                   
                    <button 
               
               className="badge badge-soft-danger font-size-12"                          className="badge badge-soft-danger font-size-12"
                            
                onClick={() => {
                    const deleteID= window.confirm(
                      "Are you sure you want to Delete ?"
                            )
                   if ( deleteID=== true) {
                    deleteHandeler(pages.ID );
                            }
                         
                        }}>
                      
                      <i class="mdi mdi-delete font-size-18" ></i>
                       </button>
                </div>
            </>
        ),
    },
]
   

    
return (
    <React.Fragment>
        <div className="page-content">
           
                                <PaginationProvider
                                    pagination={paginationFactory(pageOptions)}
                                >
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider
                                            keyField="id"
                                            data={pages}
                                            columns={pagesListColumns}
                                            bootstrap4
                                            search
                                        >
                                            
                               {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Employee List"}
                                        IsButtonVissible={true}
                                        a={toolkitProps.searchProps}
                                        breadcrumbCount={pages.length}
                                        Path={"/AddEmployee"}
                                    />
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    classes={
                                                        "table  table-bordered"
                                                    }
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone
                                                {...paginationProps}
                                            />
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )}
                                        </ToolkitProvider>
                                    )}
                                </PaginationProvider>
                                <Modal
                        isOpen={modal_center}
                        toggle={() => { tog_center() }}
                        size="xl"
                    >
                        <AddEmployee state={editData} />
                    </Modal>
                          </div>
                  </React.Fragment>
              );
        };

                            
export default Employee_List;