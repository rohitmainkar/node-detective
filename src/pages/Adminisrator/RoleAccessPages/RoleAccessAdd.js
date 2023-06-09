import React, { useEffect, useState } from "react";
import {

    CardBody,
    Col,
    Container,
    Row,
    Label,
    Input,
    CardHeader,
    FormGroup,
    Button,
    Table,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import Select from "react-select";
import {
    getPartyListAPI,
} from "../../../store/Administrator/PartyRedux/action";
import { Tbody } from "react-super-responsive-table";
import { MetaTags } from "react-meta-tags";
import {
    AddPageHandlerForRoleAccessListPage,
    deleteRoleAcessMasterAction,
    getPageAccess_DropDown_API,
    GO_Button_RoleAccess_AddPage_Action,
    PageDropdownForRoleAccessList,
    PageDropdownForRoleAccessList_Success,
    saveRoleAccessAddAction,
    saveRoleAccessAddActionSuccess,
    setTableData_roleAccss_AddPageSuccess,
} from "../../../store/actions";
import { getModuleList } from "../../../store/actions";
import { useHistory, } from "react-router-dom";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID, metaTagLabel } from "../../../components/Common/CommonFunction";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as url from "../../../routes/route_url"
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { deltBtnCss } from "../../../components/Common/ListActionsButtons";



const RoleAccessAdd = () => {
    const dispatch = useDispatch();
    const history = useHistory()

    const InitialCol = [
        {
            text: "Action",
            dataField: "",
            formatter: (cellContent, user) => {
                const btnId = `roleAccDelete-${user.id}`
                const config = { btnId, deleteId: user.id }
                return (
                    <div style={{ justifyContent: 'center' }} >
                        <Button className={deltBtnCss} id={btnId}> <i className="mdi mdi-delete font-size-18 text-danger text-right"
                            onClick={() => { DeleteRolePage_Handler({ ...config }) }}></i></Button>
                    </div>
                )
            },
            style: (cell, row) => {
                if (row) {
                    return {
                        position: "sticky",
                        left: "0",
                        backgroundColor: "white"
                    };
                }

            },
            headerStyle: {
                position: "sticky",
                left: "0",
                backgroundColor: "white",
                top: "0",
                zIndex: 2

            },

        },
        {
            text: "Module Name",
            dataField: "ModuleName",
            headerStyle: {
                position: "sticky",
                backgroundColor: "white",
                top: "0",

            },
        },
        {
            text: "PageName",
            dataField: "PageName",
            style: (cell, row, rowIndex, colIndex) => {
                if (colIndex) {
                    return {
                        position: "sticky",
                        left: "1.7cm",
                        backgroundColor: "white"

                    };
                }
            },
            headerStyle: {
                position: "sticky",
                left: "1.7cm",
                backgroundColor: "white",
                top: "0",
                zIndex: 2
            },
        }
    ]

    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [editCreatedBy, setEditCreatedBy] = useState('');
    const [tableHederList, setTableHederList] = useState(InitialCol)
    const [showTableOnUI, setShowTableOnUI] = useState(false)
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState({ value: 0, label: "All Pages" });
    const [company_dropdown_Select, setCompany_dropdown_Select] = useState({ label: "Select...", value: 0 });

    //Access redux store Data /  'save_ModuleSuccess' action data
    const location = { ...history.location };

    const {
        PageAccess = [],
        ModuleData,
        PageDropdownRedux,
        postMsg,
        Roles,
        partyList,
        userAccess = [],
        company,
        tableDataRedux = []
    } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        companyList: state.Company.companyList,
        partyList: state.PartyMasterReducer.partyList,
        Roles: state.RoleMaster_Reducer.roleList,
        ModuleData: state.Modules.modulesList,
        PageAccess: state.H_Pages.PageAccess,
        PageDropdownRedux: state.RoleAccessReducer.PageDropdownForRoleAccess,
        postMsg: state.RoleAccessReducer.postMsg,
        tableDataRedux: state.RoleAccessReducer.AddPageTableDataRedux,
        userAccess: state.Login.RoleAccessUpdateData,
        company: state.Company.companyList,

    }));


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        });

        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    useEffect(() => {
        const hasEditVal = history.location.state;
        if (!(hasEditVal === undefined)) {
            const { rowData = {}, btnmode } = hasEditVal
            const { Division_id, DivisionName, Role_id, RoleName, Company_id, CompanyName, CreatedBy } = rowData;
            if (Role_id > 0) {
                setPageMode(btnmode)
                setEditCreatedBy(CreatedBy)
                dispatch(GO_Button_RoleAccess_AddPage_Action(Role_id, Division_id, Company_id));
                setShowTableOnUI(true)
                setRoleDropDown({ label: RoleName, value: Role_id })
                setCompany_dropdown_Select({ label: CompanyName, value: Company_id })
                setDivision_dropdown_Select({ label: DivisionName, value: Division_id })
            }
        }
    }, [])

    useEffect(() => {
        dispatch(getPartyListAPI());//for division dropdown API
        dispatch(getRole());//for Role  dropdown API
        dispatch(getModuleList())//for Modules  dropdown API
        dispatch(getPageAccess_DropDown_API());//for Page Access  API from pages saga file
        dispatch(setTableData_roleAccss_AddPageSuccess([]))
        dispatch(PageDropdownForRoleAccessList_Success([]))// for clear page dropdown clear  list when first rendring
        dispatch(getcompanyList());
    }, []);


    useEffect(() => {

        const NewColoumList = []

        function columnFunc(text, checkShow, ischeck) {
            return {
                text: text,
                dataField: ischeck,
                headerStyle: {
                    position: "sticky",
                    // left: "1.7cm",
                    backgroundColor: "white",
                    top: "0",
                    zIndex: 1
                },

                formatter: (cellContent, user) => {
                    
                    let isSTP_page = user.PageType === 3 //PageTypeName :"SourceTransactionPage"
                    let isShowinlistAdd = (ischeck === "RoleAccess_IsShowOnMenuForMaster")

                    if (!(user[checkShow] > 0)) { return null }

                    else if ((isSTP_page && isShowinlistAdd)) {
                        user[ischeck] = 0;
                        return null
                    }
                    return (
                        <div style={{ justifyContent: 'center' }} >
                            <Col>
                                <FormGroup className=" col col-sm-4 ">
                                    <Input
                                        id={`check-id-${ischeck}-${user.PageID}`}
                                        key={user.PageID}
                                        type="checkbox"
                                        defaultChecked={user[ischeck]}
                                        className="col col-sm text-end"
                                        onChange={(e) => {

                                            user[ischeck] = e.target.checked ? 1 : 0;
                                            document.getElementById(`check-id-${ischeck}-${user.PageID}`).checked = e.target.checked;
                                            // dispatch(IscheckRoleAcessMasterAction(user.id, ischeck, e.target.checked))
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </div>
                    )
                }
            }
        }

        PageAccess.map((i) => {

            let checkShow = `PageAccess_${i.Name}`;
            if (i.Name === "IsShowOnMenu") {
                let textList = "ShowList";
                let textAdd = "ShowAdd";
                let ischeckList = "RoleAccess_IsShowOnMenuForList"
                let ischeckAdd = "RoleAccess_IsShowOnMenuForMaster";

                let colnObj2 = columnFunc(textList, checkShow, ischeckList);
                let colnObj1 = columnFunc(textAdd, checkShow, ischeckAdd);

                NewColoumList.push(colnObj1);
                NewColoumList.push(colnObj2);
            } else {
                let ischeckAdd = `RoleAccess_${i.Name}`;
                let colnObj3 = columnFunc(i.Name, checkShow, ischeckAdd)
                NewColoumList.push(colnObj3)
            }
        })
        const a = [...InitialCol, ...NewColoumList]
        setTableHederList(a)
    }, [PageAccess])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            const promise = await customAlert({ Type: 1, Message: postMsg.Message, })
            if (promise) {
                history.push({ pathname: url.ROLEACCESS_lIST })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            customAlert({ Type: 4, Message: JSON.stringify(postMsg.Message), })
        }
    }, [postMsg])



    const DivisionTypesValues = partyList.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const CompanyValues = company.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Role_DropdownOption = Roles.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Module_DropdownOption = ModuleData.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    useEffect(() => {
        if (company.length === 1) {
            setCompany_dropdown_Select({
                value: company[0].id,
                label: company[0].Name
            })
        }
    }, [company])

    // for Page dropdown
    const Page_DropdownOption = PageDropdownRedux.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        // dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        var module = e.value;
        var division = division_dropdown_Select.value
        setModule_DropdownSelect(e);
        setPage_DropdownSelect({ value: 0, label: "All Pages" })
        dispatch(PageDropdownForRoleAccessList(module, division));
    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {

        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        var company = company_dropdown_Select.value
        if (division === undefined) {
            division = 0
        }
        if (role > 0) {

            dispatch(GO_Button_RoleAccess_AddPage_Action(role, division, company));
            setShowTableOnUI(true)
        }
        else if (role === undefined) {
            customAlert({
                Type: 4,
                Message: "Please Select Role",
            })

        }
    }

    const AddPageButton_Handeler = () => {

        let selectePageID = page_DropdownSelect.value

        if (selectePageID === 0) {
            var pageId = 0
            PageDropdownRedux.forEach((i) => {
                pageId = i.id
                let found = tableDataRedux.find((inx) => { return inx.PageID === pageId })
                if ((found === undefined) && !(pageId === 0)) {
                    dispatch(AddPageHandlerForRoleAccessListPage(pageId));
                }
            })
        }
        else {

            let found = tableDataRedux.find((inx) => { return inx.PageID === selectePageID })

            if ((found === undefined) && !(selectePageID === undefined)) {
                dispatch(AddPageHandlerForRoleAccessListPage(selectePageID));
            }
            else if (found) {
                customAlert({
                    Type: 4,
                    Message: "Page Alredy Exist",
                })
            }
            else {
                customAlert({
                    Type: 4,
                    Message: "Please Select Page",
                })
            }
        }
    }

    function DeleteRolePage_Handler(config) {
        const { btnId } = config;
        btnIsDissablefunc({ btnId, state: false })
        dispatch(deleteRoleAcessMasterAction(config))
    }
    function ChangeButtonHandeler() {
        setShowTableOnUI(false);
        setModule_DropdownSelect('')
        setPage_DropdownSelect('')
        dispatch(setTableData_roleAccss_AddPageSuccess([]))
    }


    const pageOptions = {
        sizePerPage: tableDataRedux.length + 1,
        // totalSize: TableData.length,
        custom: true,
    };


    const saveHandeller = (event) => {
        event.preventDefault();
        const btnId = event.target.id
        // btnIsDissablefunc({ btnId, state: true })
        try {

            function ischeckboxCheck(i1) {
                let accArray = [];
                let isShowOnMenu_Id

                PageAccess.map((i2) => {

                    const roleCond = `RoleAccess_${i2.Name}`
                    const pageCond = `PageAccess_${i2.Name}`

                    if (((i2.Name === "IsShowOnMenu") && (i1[pageCond] > 0))) {
                        isShowOnMenu_Id = i2.id
                    }
                    else if (((i1[roleCond] > 0) && (i1[pageCond] > 0))) {
                        accArray.push({ "PageAccess": i2.id })
                    }
                })
                return { accArray, isShowOnMenu_Id }
            }

            const jsonArray = [];
            tableDataRedux.map((i1) => {

                let { accArray, isShowOnMenu_Id } = ischeckboxCheck(i1);
                let showList = i1.RoleAccess_IsShowOnMenuForList > 0
                let showAdd = i1.RoleAccess_IsShowOnMenuForMaster > 0
                let isAccess = accArray.length > 0;
                let isrelated = i1.RelatedPageID > 0;
                let divisionID = division_dropdown_Select.value
                let isSTP_page = i1.PageType === 3 //PageTypeName :"SourceTransactionPage"

                const listRowOBJFunc = () => {
                    let showArray = [];
                    if (showList) showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: i1.ModuleID,
                        Pages: i1.PageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                const addRowOBJFunc = () => {
                    let showArray = [];
                    if (showAdd) showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: i1.ModuleID,
                        Pages: i1.RelatedPageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                if (isAccess || showList || showAdd) {
                    jsonArray.push(listRowOBJFunc());
                    if (isrelated && isSTP_page) jsonArray.push(addRowOBJFunc());
                }
            })
            const jsonBody = JSON.stringify(jsonArray)

            dispatch(saveRoleAccessAddAction({ jsonBody, btnId }));

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    }



    const RoleAccTable = () => {
        return (
            <div className='sticky-div1 table-rsponsive mb-4'>

                <ToolkitProvider
                    keyField="id"
                    data={tableDataRedux}
                    columns={[...tableHederList]}
                    search
                >
                    {(toolkitProps) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive" id="TableDiv" >
                                        <BootstrapTable
                                            keyField={"id"}
                                            responsive
                                            bordered={false}
                                            striped={false}
                                            headerClasses="theader-class"
                                            classes={"table  table-bordered "}
                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps,)}
                                    </div>
                                </Col>
                            </Row>

                        </React.Fragment>
                    )}
                </ToolkitProvider>

            </div>
        )

    }

    let IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };



    return <React.Fragment>
        <div className="page-content"  >
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <Container fluid>
                {
                    !showTableOnUI ?
                        <CardHeader className="card-header   text-black  c_card_body"  >
                            <Row className="mt-3">
                                <Col sm={3}>
                                    <FormGroup className="mb-3 row ">
                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                        <Col sm={9} style={{ zIndex: "3" }}>
                                            <Select
                                                value={role_dropdown_Select}
                                                options={Role_DropdownOption}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Division</Label>
                                        <Col md="9" style={{ zIndex: "3" }}>
                                            <Select
                                                value={division_dropdown_Select}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                options={DivisionTypesValues}
                                                onChange={(e) => { handllerDivisionTypes(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Company</Label>
                                        <Col md="9" style={{ zIndex: "3" }}>
                                            <Select
                                                value={company_dropdown_Select}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                options={CompanyValues}
                                                onChange={(e) => { setCompany_dropdown_Select(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm={1}>
                                    <div className="col col-2">
                                        <Button type="button" color="primary" onClick={() => { GoButton_Handler() }}>Go</Button>
                                    </div>
                                </Col>
                            </Row>
                            <div>
                            </div>

                        </CardHeader>

                        :
                        <div>
                            <Row style={{ backgroundColor: "#dddddd", borderRadius: "5px" }} className='mb-1 mt-n head '>
                                <Row sm={12} >
                                    <Col sm={3} className="p-2 ">
                                        <Label className="p-2 col-sm-3">Role</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                            <h className="text-black">{role_dropdown_Select.label}</h></Button>
                                    </Col>

                                    <Col sm={4} className="p-2 ">
                                        {(division_dropdown_Select.value > 0)
                                            ?
                                            <> <Label className=" p-2 col-sm-3">Division</Label>
                                                <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                    <h className="text-black">{division_dropdown_Select.label}</h></Button>
                                            </>
                                            : null}
                                    </Col>

                                    <Col sm={4} className="p-2 ">
                                        <Label className="p-2 col-sm-4">Company</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                            <h className="text-black">{company_dropdown_Select.label}</h></Button>
                                    </Col>
                                    <Col sm={1} className="p-2 mt-1">
                                        <Button type="button"
                                            color="btn btn-outline-secondary"
                                            className="btn-sm"
                                            onClick={() => { ChangeButtonHandeler() }}>
                                            <h className="text-black">Change</h></Button>

                                    </Col>

                                </Row>
                            </Row>
                            <div className="card-header headbody  text-black"
                                style={{
                                    backgroundColor: "rgb(231 231 231)",
                                    marginLeft: "-8px",
                                    marginRight: "-8px",
                                    borderRadius: "5px"
                                }} >
                                <Row >
                                    <Col sm={4}>
                                        <FormGroup className="row">
                                            <Label className="col-sm-3 p-2 ml-n5">Module</Label>
                                            <Col sm={8} style={{ zIndex: "3" }}>
                                                <Select
                                                    value={module_DropdownSelect}
                                                    placeholder="select.."
                                                    options={Module_DropdownOption}
                                                    onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                    classNamePrefix="select2-selection"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={4}>
                                        <FormGroup className=" row ">
                                            <Label className="col-sm-3 p-2">Page</Label>
                                            <Col sm={8} style={{ zIndex: "3" }}>
                                                <Select
                                                    value={page_DropdownSelect}
                                                    placeholder="select.."
                                                    options={Page_DropdownOption}
                                                    onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                    classNamePrefix="select2-selection"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm={2} >
                                        <Button type="button" color="btn btn-outline-success" className=""
                                            onClick={() => { AddPageButton_Handeler() }}>
                                            {page_DropdownSelect.value === 0 ? 'Add All Page' : "Add Page"}</Button>
                                    </Col>
                                    <Col sm={1} >
                                        {/* <Button type="button" color="primary" onClick={() => { saveHandeller() }}>Save</Button> */}
                                        <SaveButton
                                            pageMode={pageMode}
                                            userAcc={userPageAccessState}
                                            module={"RoleAccess"}
                                            onClick={saveHandeller}
                                            editCreatedBy={editCreatedBy}
                                        />
                                    </Col>
                                </Row>

                            </div>

                        </div>
                }
                <div style={{
                    marginLeft: "-7px",
                    paddingTop: '4px'
                }}>
                    <RoleAccTable ></RoleAccTable>
                </div>

            </Container>



        </div>
    </React.Fragment>
}



export default RoleAccessAdd
