import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    deleteModuleID,
    deleteModuleIDSuccess,
    editModuleID,
    fetchModelsList,
    PostModelsSubmitSuccess,
    updateModuleIDSuccess
} from "../../../store/actions";
import Modules from "./Modules";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

const ModulesList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.Modules.modulesList,
            updateMsg: state.Modules.updateMessage,
            editData: state.Modules.editData,
            deleteMsg: state.Modules.deleteModuleIDSuccess,
            postMsg: state.Modules.modulesSubmitSuccesss,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField

        })
    );

    const action = {
        getList: fetchModelsList,
        editId: editModuleID,
        deleteId: deleteModuleID,
        updateSucc: updateModuleIDSuccess,
        deleteSucc: deleteModuleIDSuccess,
        postSucc: PostModelsSubmitSuccess
    }

    //  This UseEffect => Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldSuccess([]))
        dispatch(commonPageField(15))
        dispatch(fetchModelsList());
    }, []);

    const { pageField } = reducers

    return (
        <React.Fragment>
            {
                (pageField.length > 0) ?
                    <CommonListPage
                        action={action}
                        reducers={reducers}
                        MasterModal={Modules}
                        masterPath={"/Modules"}
                        ButtonMsgLable={"Module"}
                        deleteName={"Name"}
                    />
                    : null
            }

        </React.Fragment>
    )
}

export default ModulesList
