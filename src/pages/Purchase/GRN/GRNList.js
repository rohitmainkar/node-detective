import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderId,
    getOrderListPage,
    updateOrderIdSuccess,
    // getOrderList
} from "../../../store/Purchase/OrderPageRedux/actions";
import {  commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage"
import Order from "../Order/Order";
import { ORDER } from "../../../routes/route_url";

const GRNList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.OrderReducer.orderList,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg:state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
  
    const action = {
        getList: getOrderListPage,
        editId: editOrderId,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }


    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(50))
        dispatch(getOrderListPage());
    }, []);

    const { pageField } = reducers;
function func1(){

}
    return (
        <React.Fragment>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        showBreadcrumb={false}
                        reducers={reducers}
                        MasterModal={Order}
                        masterPath={ORDER}
                        ButtonMsgLable={"Order"}
                        deleteName={"Name"}
                        listHeader={func1()}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default GRNList;