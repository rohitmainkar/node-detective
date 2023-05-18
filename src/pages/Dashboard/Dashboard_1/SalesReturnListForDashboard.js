import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { currentDate_ymd, loginCompanyID, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as url from "../../../routes/route_url";
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import { Retailer_List } from '../../../store/CommonAPI/SupplierRedux/actions';
import { salesReturnListAPI } from '../../../store/Sales/SalesReturnRedux/action';

export default function SalesReturnListForDashboard() {

    const dispatch = useDispatch();
    const history = useHistory();

    const { tableList, } = useSelector((state) => ({
        tableList: state.SalesReturnReducer.salesReturnList,
    }));

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: currentDate_ymd,
            ToDate: currentDate_ymd,
            CustomerID: "",
            PartyID: loginPartyID(),
        });
        dispatch(salesReturnListAPI(jsonBody));
    }, [])


    const pagesListColumns = [
        {
            text: "ID",
            dataField: "id",
        },
        {
            text: "Return Date",
            dataField: "ReturnDate",
        },
        {
            text: "FullReturnNumber",
            dataField: "FullReturnNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "Return Reason",
            dataField: "ReturnReasonName",
        },

    ];

    return (

        <ToolkitProvider

            keyField="id"
            data={tableList}
            columns={pagesListColumns}

            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <div className="table table-responsive">
                        <BootstrapTable 
                            keyField={"id"}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />

                        {mySearchProps(toolkitProps.searchProps)}
                    </div>

                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

