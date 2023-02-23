import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardHeader, Col, Container, FormGroup, Label, Row, Button } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { useDispatch, useSelector } from "react-redux";

import {
    AlertState,
    getRoles, PostMethodForCopyRoleAccessForRoleAccess,
    PostMethod_ForCopyRoleAccessFor_Role_Success
} from "../../../store/actions";
import { useHistory } from "react-router-dom";


const RoleAccessCopyFunctionality = (props) => {

    const [copyRole_Dropdown_Select, setCopyRole_Dropdown_Select] = useState("");
    const [copyDivision_dropdown_Select, setCopyDivision_dropdown_Select] = useState("");

    const [newRoleDropdown_Select, setNewRoleDropdown_Select] = useState("");
    const [newDivision_dropdown_Select, setNewDivision_dropdown_Select] = useState(null);

    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [showTableOnUI, setShowTableOnUI] = useState(false)

    // const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("edit");

    const dispatch = useDispatch();
    const history = useHistory()



    //Access redux store Data 
    const { Roles_redux,
        DivisionTypes_redux,
    } = useSelector((state) => ({
        DivisionTypes_redux: state.PartyMasterReducer.partyList,
        Roles_redux: state.User_Registration_Reducer.Roles,
    }));


    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPartyListAPI());

    }, []);



    let editDataGatingFromList = props.state;

    // userAccess useEffect
    useEffect(() => {
        debugger
        if (!(editDataGatingFromList === undefined)) {
            var C_props = editDataGatingFromList

            var divisionId = C_props.Division_id
            if (divisionId === null) {
                divisionId = 0
            }
            var roleId = C_props.Role_id

            if (roleId > 0) {

                setCopyRole_Dropdown_Select({ label: C_props.RoleName, value: roleId })
                setCopyDivision_dropdown_Select({ label: C_props.DivisionName, value: divisionId })
            }
        }

    }, [history]);


    const newDivisionTypesOption = DivisionTypes_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const newRole_DropdownOption = Roles_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));



    function newRoleDropDown_onChangeHandler(e) {
        setNewRoleDropdown_Select(e)
    }

    function newDivisionTypes_onChangeHandler(e) {
        setNewDivision_dropdown_Select(e)
    }

    function CopyButton_Handler() {
        const jsonBody = JSON.stringify(
            {
                Role: copyRole_Dropdown_Select.value,
                Division: copyDivision_dropdown_Select.value,
                NewRole: newRoleDropdown_Select.value,
                NewDivision: (newDivision_dropdown_Select) ?
                    newDivision_dropdown_Select.value
                    : 0,
            })

        dispatch(PostMethodForCopyRoleAccessForRoleAccess(jsonBody))
    }


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    let IsEditMode_Css = ''
    if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>

            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                {/* <Breadcrumbs breadcrumbItem={"Role Access List"} /> */}
                <Breadcrumb
                    title={"Count :"}
                    IsSearch={true}
                    // breadcrumbItem={userPageAccessState.PageHeading}
                    breadcrumbItem={"Copy Role Access"}
                />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >




                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >

                            <Row style={{ backgroundColor: "#f2f2f2" }} className='mb-3 mt-n1'>
                                <Col md="4" className="p-2 ">
                                    <Label className="p-2 col-sm-3">Role</Label>
                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{copyRole_Dropdown_Select.label}</h></Button>
                                </Col>

                                {(copyDivision_dropdown_Select.value > 0)
                                    ?
                                    <Col md="4" className="p-2 ">

                                        <Label className=" p-2 col-sm-3 ">Division</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{copyDivision_dropdown_Select.label}</h></Button>
                                    </Col>
                                    : null
                                }
                                {/* <Col md="4" className="p-2 text-end">
                                                    <Button type="button" color="btn btn-outline-secondary" className="btn-sm" onClick={() => { ChangeButtonHandeler() }}><h className="text-black">Change Role</h></Button>
                                                </Col> */}

                            </Row>


                            <Row className="mt-3">
                                <Col md="4">

                                    <FormGroup className="mb-3 row ">
                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                        <Col md="9">
                                            <Select
                                                value={newRoleDropdown_Select}
                                                options={newRole_DropdownOption}
                                                className="rounded-bottom"
                                                onChange={(e) => { newRoleDropDown_onChangeHandler(e) }}
                                                classNamePrefix="select2-selection"

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="4" className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Division</Label>
                                        <Col md="9">
                                            <Select
                                                value={newDivision_dropdown_Select}
                                                className="rounded-bottom"
                                                options={newDivisionTypesOption}
                                                onChange={(e) => { newDivisionTypes_onChangeHandler(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="3" className="mt- ">
                                    <Button type="button" color="primary" onClick={() => { CopyButton_Handler() }}>Copy Role</Button>
                                </Col>

                            </Row>
                        </CardHeader>

                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );


};
export default RoleAccessCopyFunctionality