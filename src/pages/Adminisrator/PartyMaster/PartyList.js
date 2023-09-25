import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
    deletePartyID,
    deletePartyIDSuccess,
    editPartyID,
    getPartyListAPI,
    getPartyListAPISuccess,
    postPartyDataSuccess,
    updatePartyIDSuccess
} from '../../../store/Administrator/PartyRedux/action';
import PartyMaster from './MasterAdd/PartyIndex';
import { commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { mode, url, pageId } from "../../../routes/index";
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageLoadingSpinner } from '../../../components/Common/CommonButton';
import CommonPurchaseList from '../../../components/Common/CommonPurchaseList';
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { customAlert } from '../../../CustomAlert/ConfirmDialog';

const PartyList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [subPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
    });

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PartyMasterReducer.goBtnLoading,
            listBtnLoading: state.PartyMasterReducer.listBtnLoading,
            tableList: state.PartyMasterReducer.partyList,
            editData: state.PartyMasterReducer.editData,
            updateMsg: state.PartyMasterReducer.updateMsg,
            deleteMsg: state.PartyMasterReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            postMsg: state.PartyMasterReducer.postMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        })
    );
    const { pageField, goBtnLoading, commonPartyDropSelect } = reducers

    const action = {
        editId: editPartyID,
        deleteId: deletePartyID,
        updateSucc: updatePartyIDSuccess,
        deleteSucc: deletePartyIDSuccess,
        postSucc: postPartyDataSuccess
    }
    // Common Party Dropdown useEffect
    useEffect(() => {
        
        if ((commonPartyDropSelect.value > 0 && (subPageMode === url.RETAILER_LIST || subPageMode === url.NON_RETAILER_PARTY))) {
            goButtonHandler()
        }
        else if (subPageMode === url.PARTY_lIST) {
            dispatch(getPartyListAPI({
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginPartyID(),
                IsRetailer: 0
            }));
        }
        return () => {
            dispatch(updatePartyIDSuccess([])); //for clear privious order list 
            dispatch(getPartyListAPISuccess([]));
        }
    }, [commonPartyDropSelect]);

    //  This UseEffect => Featch Modules List data  First Rendering
    useLayoutEffect(() => {
        
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = '';
        if (subPageMode === url.PARTY_lIST) {
            page_Id = pageId.PARTY_lIST;
            masterPath = url.PARTY;
            newBtnPath = url.PARTY;
        }
        else if (subPageMode === url.RETAILER_LIST) {
            page_Id = pageId.RETAILER_LIST
            masterPath = url.RETAILER_MASTER;
            newBtnPath = url.RETAILER_MASTER;
        }
        else if (subPageMode === url.NON_RETAILER_PARTY_lIST) {
            page_Id = pageId.NON_RETAILER_PARTY_lIST
            masterPath = url.NON_RETAILER_PARTY;
            newBtnPath = url.NON_RETAILER_PARTY;
        }
        setOtherState({ masterPath, newBtnPath, })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        return () => {
            dispatch(updatePartyIDSuccess([])); //for clear privious order list 
            dispatch(getPartyListAPISuccess([]));
        }
    }, []);

    function goButtonHandler() {

        try {
            if ((_cfunc.loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: _cfunc.loginSelectedPartyID(),
                IsRetailer: subPageMode === url.RETAILER_LIST ? 1 : 0
            }
            dispatch(getPartyListAPI(jsonBody));
        }
        catch (error) { }
        return
    };

    function partyOnChngeButtonHandler() {
        dispatch(getPartyListAPISuccess([]));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <PageLoadingSpinner isLoading={(goBtnLoading || !pageField)} />
                {(subPageMode === url.RETAILER_LIST || (subPageMode === url.NON_RETAILER_PARTY_lIST)) &&
                    <PartyDropdown_Common pageMode={pageMode}
                        goBtnLoading={goBtnLoading}
                        goButtonHandler={goButtonHandler}
                        changeButtonHandler={partyOnChngeButtonHandler}
                    />
                }
                {
                    (pageField) &&
                    <CommonPurchaseList
                        action={action}
                        reducers={reducers}
                        showBreadcrumb={false}
                        MasterModal={PartyMaster}
                        masterPath={otherState.masterPath}
                        newBtnPath={otherState.newBtnPath}
                        pageMode={pageMode}
                        ButtonMsgLable={"Party"}
                        deleteName={"Name"}
                    />
                }
            </div>
        </React.Fragment>
    )
}

export default PartyList;