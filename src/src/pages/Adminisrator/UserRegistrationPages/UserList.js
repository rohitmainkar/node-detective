import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddUser from "./UserRegistration";
import {
    getUserList,
    userDeleteAction,
    userDeleteActionSuccess,
    userEditAction,
    userUpdateActionSuccess,
    saveUserMasterActionSuccess
} from "../../../store/Administrator/UserRegistrationRedux/actions";
import CommonListPage from "../../../components/Common/ComponentRelatedCommonFile/CommonMasterListPage";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { USER } from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";

import * as pageId from "../../../routes/allPageID"

const UserList = () => {
    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.User_Registration_Reducer.pages,
            editData: state.User_Registration_Reducer.editData,
            updateMsg: state.User_Registration_Reducer.updateMessage,
            deleteMsg: state.User_Registration_Reducer.deleteSuccessRole,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.User_Registration_Reducer.AddUserMessage,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const action = {
        getList: getUserList,
        editId: userEditAction,
        deleteId: userDeleteAction,
        postSucc: saveUserMasterActionSuccess,
        updateSucc: userUpdateActionSuccess,
        deleteSucc: userDeleteActionSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId.USER_lIST))
        dispatch(getUserList());
    }, []);

 
    const { pageField, userAccess = [] } = reducers

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {
                (pageField) ?
                    <CommonListPage
                        action={action}
                        showBreadcrumb={true}
                        reducers={reducers}
                        MasterModal={AddUser}
                        masterPath={USER}
                        ButtonMsgLable={"User"}
                        deleteName={"LoginName"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default UserList;


