import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup, Button } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import {
    editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, getDivisionTypesID,
    GetPartyTypeByDivisionTypeID, postPartyData, postPartyDataSuccess, updatePartyID
} from "../../../store/Administrator/PartyRedux/action";

import { MetaTags } from "react-meta-tags";
// import { getRoles } from "../../../store/Administrator/UserRegistrationRedux/actions";
import { AddPageHandlerForRoleAccessListPage, GetHpageListData, getH_Modules, getPageAccess_DropDown_API, GetRoleListForRoleAccessListPage, getRoles, GO_Button_HandlerForRoleAccessListPage, PageDropdownForRoleAccessList, PageMasterForRoleAccessLit, PostMethodForRoleAccessListPage, PostMethod_ForRoleAccessListPage_Success, roleAceessAction } from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";

import { useHistory, useLocation, useParams } from "react-router-dom";

const RoleAccessList = (props) => {
    // const [EditData, setEditData] = useState([]);
    const history = useHistory()

    // useEffect(() => {
    //     console.log("testvalue,testvalue,testvalue,", props)

    //     const userPageAccess = history.location.state


    //     if ((userPageAccess === undefined)) {

    //         history.push("/Dashboard")
    //     }
    //     else {
    //         if (!(userPageAccess.fromDashboardAccess)) {
    //             history.push("/Dashboard")
    //         }
    //     };
    // }, [props])


    const formRef = useRef(null);
    const dispatch = useDispatch();



    const [PageMode, setPageMode] = useState(false);


    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PageMasterListForRoleAccess, PageAccess, ModuleData, PageDropdownForRoleAccess, PartySaveSuccess,
        AddPage_PageMasterListForRoleAccess, GO_buttonPageMasterListForRoleAccess, PostMessage_ForRoleAccessList,
        RoleListData_Reducer, companyList, DivisionTypes, Roles } = useSelector((state) => ({
            PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
            companyList: state.Company.companyList,
            DivisionTypes: state.PartyMasterReducer.DivisionTypes,
            PartyTypes: state.PartyMasterReducer.PartyTypes,
            Roles: state.User_Registration_Reducer.Roles,
            ModuleData: state.Modules.modulesList,
            PageAccess: state.H_Pages.PageAccess,
            RoleListData_Reducer: state.RoleAccessReducer.RoleListDataForRoleListPage,
            PageMasterListForRoleAccess: state.RoleAccessReducer.PageMasterListForRoleAccess,
            PageDropdownForRoleAccess: state.RoleAccessReducer.PageDropdownForRoleAccess,
            AddPage_PageMasterListForRoleAccess: state.RoleAccessReducer.AddPage_PageMasterListForRoleAccess,
            GO_buttonPageMasterListForRoleAccess: state.RoleAccessReducer.GO_buttonPageMasterListForRoleAccess,
            PostMessage_ForRoleAccessList: state.RoleAccessReducer.PostMessage_ForRoleAccessList,


        }));


    useEffect(() => {
        // dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());

        dispatch(getRoles());
        dispatch(fetchModelsList())
        dispatch(GetHpageListData())
        dispatch(getPageAccess_DropDown_API());

        // dispatch(PageMasterForRoleAccessLit(1));
        // dispatch(roleAceessAction(1, 1, 1))

    }, []);

    useEffect(() => {

        var Array = []
        var eleList = {}

        let count1 = 0
        GO_buttonPageMasterListForRoleAccess.map((indexdata) => {

            count1 = count1 + 1

            eleList = indexdata;
            eleList["ID"] = count1;

            Array.push(eleList)
            eleList = {}

        })

        setListData(Array)


    }, [GO_buttonPageMasterListForRoleAccess])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = listData.length + 1
        let previousData = listData
        debugger

        // AddPage_PageMasterListForRoleAccess.map((indexdata) => {
        let indexdata = AddPage_PageMasterListForRoleAccess[0]
        // let found =previousData.find((inx)=>{return inx.PageID===indexdata.PageID})
        if (!(indexdata === undefined)) {
            eleList = indexdata
            eleList["ID"] = NewID;
            Array.push(eleList)
            // eleList = {}

            previousData = previousData.concat(Array)
            setListData(previousData)
        }

    }, [AddPage_PageMasterListForRoleAccess])

    useEffect(() => {

        var NewColoumList = PageAccess.map((i) => {
            return ({
                text: i.Name,
                dataField: i.Name,
                sort: true,
                formatter: (cellContent, indx) => (
                    <>
                        {indx[`PageAccess_${i.Name}`] > 0 ?
                            <>
                                <Input
                                    type="checkbox"
                                    name={i.Name}
                                    // onClick={() => {
                                    //   EditPageHandler(module.id);
                                    // }}
                                    defaultChecked={(indx[`RoleAccess_${i.Name}`] > 0)}
                                />
                            </>
                            :
                            <></>
                        }
                    </>
                ),
            }
            )
        })
        RoleAccessListColoums = RoleAccessListColoums.concat(NewColoumList)
        setListData1(RoleAccessListColoums)
    }, [PageAccess])

    useEffect(() => {
        if ((PostMessage_ForRoleAccessList.Status === true) && (PostMessage_ForRoleAccessList.StatusCode === 200)) {
            dispatch(PostMethod_ForRoleAccessListPage_Success({ Status: false }))

            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostMessage_ForRoleAccessList.Message,
                AfterResponseAction: false
            }))
        }
        else if (PostMessage_ForRoleAccessList.Status === true) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostMessage_ForRoleAccessList.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostMessage_ForRoleAccessList])

    let RoleAccessListColoums = [
        {
            text: "Id",
            dataField: "ID",
            sort: true,
            // hidden: true
        }
        , {
            text: "Module Name",
            dataField: "ModuleName",
            sort: true,
        },
        {
            text: "PageName",
            dataField: "PageName",
            sort: true,
        }
    ]


    const DivisionTypesValues = DivisionTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Role_DropdownOption = Roles.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));


    const Module_DropdownOption = ModuleData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    // for Page dropdown
    const Page_DropdownOption = PageDropdownForRoleAccess.map((d) => ({
        value: d.id,
        label: d.Name,
    }));
    // console.log("PageDropdownForRoleAccess",PageDropdownForRoleAccess)



    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };


    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        setModule_DropdownSelect(e);
        dispatch(PageDropdownForRoleAccessList(e.value));

    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {
        debugger
        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        // dispatch(getRoles(division, role));
        dispatch(GO_Button_HandlerForRoleAccessListPage(role, division));
    }

    const AddPageButton_Handeler = () => {
        let selectePageID = page_DropdownSelect.value
        let found = listData.find((inx) => { return inx.PageID === selectePageID })

        if ((found === undefined) && !(selectePageID === undefined)) {
            dispatch(AddPageHandlerForRoleAccessListPage(selectePageID));
        }
        else if (found) {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "Page Alredy Exist",
                RedirectPath: false,
                PermissionAction: false,
            }));

        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "Page is Not Select",
                RedirectPath: false,
                PermissionAction: false,
            }));

        }
    }


    const [listData, setListData] = useState([])
    const [listData1, setListData1] = useState([])




    const saveHandeller = () => {

        let selectedItemArray = [];
        let pageAccessElement = {}
        let roleAccessArray = []


        for (var i = 0; i < listData.length; i++) {
            debugger
            var moduleName = document.getElementById("moduleID" + i).value;
            var pageName = document.getElementById("pageID" + i).value;
            var relatedPage = document.getElementById("relatedPageID" + i).value;
            var pageId = parseInt(pageName)
            var moduleId = parseInt(moduleName)
            var relatedPageID = parseInt(relatedPage)

            var isSave = document.getElementById("isSave" + i).checked
            var isEdit = document.getElementById("isEdit" + i).checked;
            var isDelete = document.getElementById("isDelete" + i).checked;
            var isEditSelf = document.getElementById("isEditSelf" + i).checked;
            var isDeleteSelf = document.getElementById("isDeleteSelf" + i).checked;
            var isShow = document.getElementById("isShow" + i).checked;
            var isTopOfTheDivision = document.getElementById("isTopOfDivision" + i).checked;
            var isView = document.getElementById("isView" + i).checked;


            if (isSave) roleAccessArray.push({ "PageAccess": 1 });
            if (isEdit) roleAccessArray.push({ "PageAccess": 2 });
            if (isDelete) roleAccessArray.push({ "PageAccess": 3 });
            if (isEditSelf) roleAccessArray.push({ "PageAccess": 4 });
            if (isDeleteSelf) roleAccessArray.push({ "PageAccess": 5 });
            if (isShow) roleAccessArray.push({ "PageAccess": 6 });
            if (isView) roleAccessArray.push({ "PageAccess": 7 });
            if (isTopOfTheDivision) roleAccessArray.push({ "PageAccess": 8 });

            // roleAccessArray.push(roleAccessElement)

            pageAccessElement["Role"] = 1
            pageAccessElement["Company"] = 2
            pageAccessElement["Division"] = 1
            pageAccessElement["Modules"] = moduleId
            pageAccessElement["Pages"] = pageId
            pageAccessElement["CreatedBy"] = 1
            pageAccessElement["UpdatedBy"] = 1
            pageAccessElement["RolePageAccess"] = roleAccessArray

            if (roleAccessArray.length > 0) {
                let pageAccessElement2 = {}
                selectedItemArray.push(pageAccessElement)
                if (relatedPageID > 0) {
                    pageAccessElement2["Role"] = 1
                    pageAccessElement2["Company"] = 2
                    pageAccessElement2["Division"] = 1
                    pageAccessElement2["Modules"] = moduleId
                    pageAccessElement2["Pages"] = relatedPageID
                    pageAccessElement2["CreatedBy"] = 1
                    pageAccessElement2["UpdatedBy"] = 1
                    pageAccessElement2["RolePageAccess"] = roleAccessArray
                    selectedItemArray.push(pageAccessElement2)
                    pageAccessElement2 = {}
                }
            }
            // debugger
            roleAccessArray = []
            pageAccessElement = {}
        }
        debugger
        const jsonBody = JSON.stringify(selectedItemArray)

        dispatch(PostMethodForRoleAccessListPage(jsonBody));
        // debugger

    };
    return (
        <React.Fragment>
            <div className="page-content text-black" >
                <Breadcrumbs breadcrumbItem={"Role Access List"} />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >

                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <Row style={{ backgroundColor: "#dddddd" }} >



                                <Col md="3">

                                    <FormGroup className="mb-1 row " >
                                        <Label className="col-sm-4 p-2 ml-n4 ">Role</Label>
                                        <Col md="8">
                                            <Select
                                                value={role_dropdown_Select}
                                                options={Role_DropdownOption}
                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md="3" className="">
                                    <FormGroup className="mb-1 row  " >
                                        <Label className="col-sm-5 p-2">Division</Label>
                                        <Col md="7">
                                            <Select
                                                value={division_dropdown_Select}
                                                options={DivisionTypesValues}
                                                onChange={(e) => { handllerDivisionTypes(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>



                                <Col md="2" className="mt- ">
                                    <Button onClick={() => { GoButton_Handler() }}>Go</Button>
                                </Col>

                               
                            </Row>

                            <Row  >

                                <Col md="3" className="">
                                    <FormGroup className="mb- row " >
                                        <Label className="col-sm-5 p-2">Module</Label>
                                        <Col md="7">

                                            <Select
                                                value={module_DropdownSelect}
                                                options={Module_DropdownOption}
                                                onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col>

                                <Col md="4">
                                    <FormGroup className="mb-2 row  " >
                                        <Label className="col-sm-4 p-2">Page</Label>
                                        <Col md="8">

                                            <Select
                                                value={page_DropdownSelect}
                                                options={Page_DropdownOption}
                                                onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                classNamePrefix="select2-selection"
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md="2" className=" ">
                                    <Button onClick={() => { AddPageButton_Handeler() }}>Add Page</Button>
                                </Col>
                                <Col md="2"></Col>

                                <Col md="1" className=" ">
                                    <Button className='btn btn-succcess' onClick={() => { saveHandeller() }}>Save</Button>
                                </Col>

                            </Row>
                        </CardHeader>

                        <CardBody>
                            {listData1.length > 0
                                ?
                                <>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {listData1.map((indx) => {
                                                    // console.log('indx', indx)
                                                    return <th>{indx.text}</th>
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {listData.map((indx, key) => {
                                                return (
                                                    <tr>
                                                        {/* <th scope="row">1</th> */}
                                                        <td>
                                                            {indx.ID}
                                                            <input
                                                                type="hidden"
                                                                id={"ID" + key}
                                                                name={"ID" + key}
                                                                value={indx.ID}
                                                            />
                                                            <input
                                                                type="hidden"
                                                                id={"relatedPageID" + key}
                                                                value={indx.RelatedPageID}
                                                            />
                                                        </td>
                                                        <td>
                                                            {indx.ModuleName}
                                                            <input
                                                                type="hidden"
                                                                id={"moduleID" + key}
                                                                name={"moduleID" + key}
                                                                value={indx.ModuleID}
                                                            />
                                                        </td>
                                                        <td>
                                                            {indx.PageName}
                                                            <input
                                                                type="hidden"
                                                                id={"pageID" + key}
                                                                name={"pageID" + key}
                                                                value={indx.PageID}
                                                            />

                                                        </td>
                                                        <td>
                                                            {indx.PageAccess_IsSave ?
                                                                <input type={"checkbox"} id={'isSave' + key}
                                                                    defaultChecked={indx.RoleAccess_IsSave > 0 ? true : false} />

                                                                : <input type={"hidden"} id={'isSave' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {indx.PageAccess_IsEdit ?
                                                                <input type={"checkbox"} id={'isEdit' + key}
                                                                    defaultChecked={indx.RoleAccess_IsEdit > 0 ? true : false} />
                                                                : <input type={"hidden"} id={'isEdit' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsDelete} */}
                                                            {indx.PageAccess_IsDelete ?
                                                                <input type={"checkbox"}
                                                                    id={'isDelete' + key}
                                                                    defaultChecked={indx.RoleAccess_IsDelete > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isDelete' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsEditSelf} */}
                                                            {indx.PageAccess_IsEditSelf ?
                                                                <input type={"checkbox"}
                                                                    id={'isEditSelf' + key}
                                                                    defaultChecked={indx.RoleAccess_IsEditSelf > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isEditSelf' + key} />
                                                            }

                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsDeleteSelf} */}
                                                            {indx.PageAccess_IsDeleteSelf ?
                                                                <input type={"checkbox"}
                                                                    id={'isDeleteSelf' + key}
                                                                    defaultChecked={indx.RoleAccess_IsDeleteSelf > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isDeleteSelf' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsShow} */}
                                                            {indx.PageAccess_IsShow ?
                                                                <input type={"checkbox"}
                                                                    id={'isShow' + key}
                                                                    defaultChecked={indx.RoleAccess_IsShow > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isShow' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsView} */}
                                                            {indx.PageAccess_IsView ?
                                                                <input type={"checkbox"}
                                                                    id={'isView' + key}
                                                                    defaultChecked={indx.RoleAccess_IsView > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isView' + key} />}
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsTopOfTheDivision} */}
                                                            {indx.PageAccess_IsTopOfTheDivision ?
                                                                <input type={"checkbox"}
                                                                    id={'isTopOfDivision' + key}
                                                                    defaultChecked={indx.RoleAccess_IsTopOfTheDivision > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isTopOfDivision' + key} />
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })}



                                        </tbody>
                                    </table>

                                </> :
                                <></>
                            }

                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );
}
export default RoleAccessList
