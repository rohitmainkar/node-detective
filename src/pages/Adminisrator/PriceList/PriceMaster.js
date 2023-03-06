import React, { useEffect, useState } from "react";
import './pricemaster.scss'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AlertState } from "../../../store/actions";
import {
    delete_PriceList,
    delete_PriceListSuccess,
    getPriceListData,
    postPriceListData,
    postPriceListDataSuccess,
    updatePriceList,
    updatePriceListSuccess
} from "../../../store/Administrator/PriceList/action";
import { getPartyTypes } from "../../../store/Administrator/PartyRedux/action";
import Tree from "../PartyPages/Tree";
import * as pageId from "../../../routes/allPageID"
import { breadcrumbReturn, loginCompanyID, loginUserID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { getPartyTypelist } from "../../../store/Administrator/PartyTypeRedux/action";
// import { PriceDrop } from "./PriceDrop";

const PriceMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    //SetState  Edit data Geting From Modules List component
    const [pageMode, setPageMode] = useState("save");

    // const [partyTypeSelect, setPartyTypeSelect] = useState({ value: '' });
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [menu, setMenu] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const [currentPrice, setCurrentPrice] = useState({ Name: '' });
    const [hasPartySelect, setHasPartySelect] = useState(false);
    const [calculationPathstate, setcalculationPathstate] = useState([]);
    const [editPriceList, setPriceList] = useState('');

    //Access redux store Data /  'save_ModuleSuccess' action data

    const { PostAPIResponse,
        priceListByPartyType,
        deleteAPIResponse,
        updateMessage,
        PartyTypes,
        PriceList,
        userAccess
    } = useSelector((state) => ({
        PostAPIResponse: state.PriceListReducer.postMsg,
        deleteAPIResponse: state.PriceListReducer.deleteMsg,
        updateMessage: state.PriceListReducer.updateMessage,
        PartyTypes: state.PartyTypeReducer.ListData,
        PriceList: state.ItemMastersReducer.PriceList,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,
        userAccess: state.Login.RoleAccessUpdateData,
    }));

    // userAccess useEffect
    useEffect(() => {
        let userAcc = undefined;
        if (editDataGatingFromList === undefined) {
            let locationPath = history.location.pathname;
            userAcc = userAccess.find((inx) => {
                return `/${inx.ActualPagePath}` === locationPath;
            });
        } else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage;
            userAcc = userAccess.find((inx) => {
                return `/${inx.ActualPagePath}` === relatatedPage;
            });
        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc);
            breadcrumbReturn({ dispatch, userAcc });
        }
    }, [userAccess]);

    useEffect(() => {
        dispatch(getPartyTypelist());
    }, [dispatch]);

    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(postPriceListDataSuccess({ Status: false }))
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            setDropOpen(false)
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostAPIResponse.Message,
                RedirectPath: '',
            }))
        }

    }, [PostAPIResponse])

    useEffect(() => {
        if ((deleteAPIResponse.Status === true) && (deleteAPIResponse.StatusCode === 200)) {
            dispatch(delete_PriceListSuccess({ Status: false }))
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: deleteAPIResponse.Message,
                RedirectPath: '',
            }))
        }
    }, [deleteAPIResponse])


    useEffect(() => {
        if ((updateMessage.Status === true) && (updateMessage.StatusCode === 200)) {
            dispatch(updatePriceListSuccess({ Status: false }))
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: updateMessage.Message,
                RedirectPath: '',
            }))
        }
    }, [updateMessage])

    const PartyTypeDropdown_Options = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));
    //***************************calculatepathOptionsfunction************************** 
    const calculatepathOptionsfunction = () => {
        const optionArr = []
        function infunc1(node) {
            optionArr.push({ value: node.value, label: node.label });
            if (node.children) {
                infunc2(node.children)
            }
        }
        function infunc2(nodeArr = []) {
            nodeArr.map(i2 => { infunc1(i2) })
        }
        priceListByPartyType.map(node => {
            infunc1(node)
        })
        return optionArr
    }
    const calculatepathOptions = calculatepathOptionsfunction()
    //*************************** end calculatepathOptionsfunction************************** 


    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)

    }
    const dropOpen_ONClickHandler = price => {
        price["mode"] = "save"
        setCurrentPrice(price)
        setDropOpen(true)
    }

    const dropOpen_EditHandler = price => { // Edit handler

        price["mode"] = "edit"

        setCurrentPrice(price)
        setDropOpen(true)

    }
    const delete_PriceList_Handler = price => {// Delete handler
        dispatch(AlertState({
            Type: 5, Status: true,
            Message: `Are you sure you want to delete this Price : "${price.label}"`,
            RedirectPath: false,
            PermissionAction: delete_PriceList,
            ID: price.value
        }));
    }
    function goButtonHandler() { // party Type Go Button API Call
        if (!(partyType_dropdown_Select === '')) {
            dispatch(getPriceListData(partyType_dropdown_Select.value))
            setHasPartySelect(true)
        }
    }
    //***************************SaveHandler************************** 

    function commonSavefunction() {// Common JSON for save handler

        var textInp1 = document.getElementById("txtsubprice")
        const invaildMsg = []
        if (textInp1.value === "") {
            invaildMsg.push({ Alert: "Please Enter SubPrice" })
        }
        else if (textInp1.value === "") {
            invaildMsg.push({ Alert: "Please Enter CalculationPath" })
        };
        if (invaildMsg.length > 0) {
            CustomAlert({ Type: 3, Message: invaildMsg })
        }
        else {
            var mkup = document.getElementById(`mkupMkdown`).checked

            var pathNo = ''
            calculationPathstate.map(ele => {
                pathNo = pathNo.concat(`${ele.value},`)
            })
            pathNo = pathNo.replace(/,*$/, '');           //****** withoutLastComma  function */

            return JSON.stringify({
                id: currentPrice.value,
                Name: textInp1.value,
                BasePriceListID: currentPrice.value,
                PLPartyType: partyType_dropdown_Select.value,
                MkUpMkDn: mkup,
                PriceList: PriceList.value,
                Company: loginCompanyID(),
                CalculationPath: pathNo,
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
            });
        }
        return false
    }
    function sub_Price_Add_Handler() {// add price save handler
        const jsonBody = commonSavefunction();
        if (jsonBody) {
            dispatch(postPriceListData(jsonBody));
        }
    }

    function sub_Price_edit_Handler() {// edit price save handler
        const jsonBody = commonSavefunction();
        if (jsonBody) {
            dispatch(updatePriceList(jsonBody, currentPrice.value));
        }
    }
    //*************************** end SaveHandler************************** 

    const onclickselect = function (node = {}) {
        const hasNone = document.getElementById("select-div").style;

        if (hasNone.display === "none") {
            hasNone.display = "block";
        } else {
            setPriceList(node)
            hasNone.display = "none";
        }
    };

    const toggle = () => {
        setMenu('');
    }

    const NodeInsidemenu = ({ node }) => {
        return (
            <samp id={"samp-1"}>
                <i className="mdi mdi-pencil font-size-12"
                    onClick={e => setMenu(node.value)}  >
                    <Dropdown
                        isOpen={menu === node.value}
                        toggle={toggle}
                        className="d-inline-block">
                        <DropdownToggle className="btn header-item " tag="button">

                        </DropdownToggle>

                        <DropdownMenu className="dropdown_menu dropdown-menu-end" id="drop-downcss" >
                            <DropdownItem
                                key={node.value}
                                onClick={(e) => { dropOpen_ONClickHandler(node) }}
                                de
                            >
                                <span className="align-middle text-black" >{"Add Sub-List"}</span>
                            </DropdownItem>

                            <DropdownItem
                                key={node.value}
                                onClick={(e) => { dropOpen_EditHandler(node) }}
                            >
                                <span className="align-middle text-black" >{"Edit"}</span>
                            </DropdownItem>

                            <DropdownItem
                                onClick={() => delete_PriceList_Handler(node)}
                            >
                                <span className="align-middle text-danger"> {"Delete"} </span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </i>
            </samp>)
    }

    function calculatedPathOnChange(e, node) {
        setcalculationPathstate(e)
    }


    const MainPriceTree = () => {

        function mainTreeFunc_3(node) {
            return (
                <ol>
                    <li >
                        <div>
                            <div className="d-flex ">
                                <div className=" flex-fill "><span id="span2" >{node.label}</span></div>
                                <div className=" flex-fill "><span id="span2" >{node.label}</span></div>
                                <div className="d3 mr-auto">  <span id="span2">
                                    <Input type="checkbox"
                                        id={`mkUp${node.value}`}
                                        defaultChecked={node.MkUpMkDn}
                                        disabled={true}></Input></span> </div>
                                <div className="d4 mr-auto1">  <NodeInsidemenu node={node} /> </div>
                            </div>
                        </div>
                        {node.children ? mainTreeFunc_2(node.children) : null}
                    </li>
                </ol>
            )
        }

        function mainTreeFunc_2(arr = []) {
            return (
                arr.map(node => {
                    return mainTreeFunc_3(node)
                })
            )
        }

        function mainTreeFunc_1(node) {
            return (
                <li  >
                    <div>
                        <div className="d-flex ">
                            <div className="flex-grow-1"><span id={"span1"} >{node.label}</span></div>
                            <div className="flex-grow-1"><span id={"span1"} >{node.label}</span></div>
                            <div className="mr-auto">  <span id={"span1"}><Input type="checkbox"></Input></span> </div>
                            <div className="mr-auto">  <NodeInsidemenu node={node} /> </div>
                        </div>
                    </div>


                    {node.children ? mainTreeFunc_2(node.children) : null}
                </li >
            )
        }

        return <ol className="wtree">
            {priceListByPartyType.map((node, ind) => {
                return mainTreeFunc_1(node, ind)
            })}
        </ol >
    }

    const PriceDrop = ({ List = [] }) => {

        function nodeOnClick(node) {
            onclickselect(node);
        }

        function dropTreeFunc_3(node) {
            return (
                <ol>
                    <li >
                        <div>
                            <div className="d-flex ">
                                <div className=" flex-fill "><span id="span2" onClick={() => nodeOnClick(node)} >{node.label}</span></div>
                            </div>
                        </div>
                        {node.children ? dropTreeFunc_2(node.children) : null}
                    </li>
                </ol>
            )
        }
        function dropTreeFunc_2(arr = []) {
            return (
                arr.map(node => {
                    return dropTreeFunc_3(node)
                })
            )
        }
        function dropTreeFunc_1(node) {
            return (
                <li  >
                    <div>
                        <div className="d-flex ">
                            <div className="flex-grow-1"><span id={"span1"} onClick={() => nodeOnClick(node)} >{node.label}</span></div>
                        </div>
                    </div>


                    {node.children ? dropTreeFunc_2(node.children) : null}
                </li >
            )
        }
        return (
            <div id="select-div" style={{ display: "none", backgroundColor: 'whitesmoke' }}>
                <ol className="wtree">
                    {List.map((node, ind) => {
                        return dropTreeFunc_1(node, ind)
                    })}

                </ol >
            </div>
        )

    }


    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css, marginBottom: "5cm" }} >
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <Container fluid>
                    <Card className="text-black">
                        <CardHeader className="card-header   text-black c_card_header" >
                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                        </CardHeader>

                        <CardBody className=" vh-10 0 text-black" >
                            <Row className="">
                                <Col md={12}>
                                    <Card style={{ backgroundColor: "whitesmoke" }}>

                                        <CardHeader className="card-header   text-black  " style={{ backgroundColor: "#e9e9ef" }} >
                                            <Row className="mt-3">
                                                <Col md="4">

                                                    <FormGroup className="mb-3 row ">
                                                        <Label className="col-sm-3 p-2 ml-n4 ">Party Type</Label>
                                                        <Col md="9" style={{}}>
                                                            <Select
                                                                value={partyType_dropdown_Select}
                                                                options={PartyTypeDropdown_Options}
                                                                className="rounded-bottom"
                                                                placeholder="select"
                                                                onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                <Col md="3" className="mt- ">
                                                    <Button type="button" color="primary" onClick={(e) => { goButtonHandler() }}>Go</Button>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        {hasPartySelect ?
                                            <div className={" row mt-4"}>
                                                <Modal
                                                    isOpen={dropOpen}
                                                    toggle={() => { setDropOpen(!dropOpen) }}
                                                    size="xl"
                                                    centered={true}
                                                >
                                                    <div className="modal-header">
                                                        {currentPrice.mode === "save" ?
                                                            <h5 className="modal-title mt-0">{currentPrice.id === 0 ? "Add Main Price" : "Add Sub-Price"}</h5> :
                                                            <h5 className="modal-title mt-0">{currentPrice.id === 0 ? "Add Main Price" : "Edit Sub-Price"}</h5>}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDropOpen(!dropOpen)
                                                            }}
                                                            className="close"
                                                            data-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>

                                                    <div className="modal-body">
                                                        {currentPrice.mode === "edit" ?

                                                            <Row className="justify-content-md-left">
                                                                <Label className="col-3 col-form-label" >Price List</Label>
                                                                <Col className="col-9">
                                                                    <Input
                                                                        id="Input"
                                                                        value={editPriceList.label}
                                                                        placeholder="Select..."
                                                                        onClick={onclickselect}
                                                                        autoComplete="off"
                                                                    >
                                                                    </Input>

                                                                    {/* {test1()} */}
                                                                    <PriceDrop List={priceListByPartyType}
                                                                    />
                                                                    {/* <NodeInsidemenu/> */}
                                                                </Col>
                                                            </Row>
                                                            : null}

                                                        {currentPrice.mode === "edit" ?
                                                            <Row className="mt-2">
                                                                <span className="form-label text-primary text-center">{currentPrice.Name}</span>
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-3 col-form-label" > {currentPrice.id === 0 ? "Main Price" : "Sub-Price"} </Label>
                                                                <Col style={{ marginTop: '9px' }} >
                                                                    <Input type="text" id='txtsubprice'
                                                                        defaultValue={currentPrice.label}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            : <Row className="mt-2">
                                                                <span className="form-label text-primary text-center">{currentPrice.Name}</span>
                                                                <Label htmlFor="horizontal-firstname-input"
                                                                    className="col-3 col-form-label" > {currentPrice.id === 0 ? "Main Price" : "Sub-Price"} </Label>
                                                                <Col style={{ marginTop: '9px' }} >
                                                                    <Input type="text" id='txtsubprice'
                                                                    />
                                                                </Col>
                                                            </Row>}
                                                        <Row className="mt-2">
                                                            {/* <span className="form-label text-primary text-center">{currentPrice.Name}</span> */}
                                                            <Label htmlFor="horizontal-firstname-input"
                                                                className="col-3 col-form-label" >CalculationPath</Label>
                                                            <Col className=" col col-9" style={{ marginTop: '9px' }} >
                                                                <Select
                                                                    isSearchable={false}
                                                                    isMulti={true}
                                                                    value={calculationPathstate}
                                                                    onChange={(e) => { calculatedPathOnChange(e, "node") }}
                                                                    components={{
                                                                        IndicatorSeparator: () => null
                                                                    }}
                                                                    options={calculatepathOptions}
                                                                />

                                                            </Col>
                                                        </Row>

                                                        <Row className="mt-2">
                                                            <Label className="col-3 col-form-label" >MkUp </Label>
                                                            <Col className="mt-2">
                                                                <Input type={"checkbox"} id='mkupMkdown'
                                                                    defaultChecked={currentPrice.MkUpMkDn} />
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-light" onClick={() => {
                                                            setDropOpen(!dropOpen)
                                                        }}>Close</button>
                                                        {currentPrice.mode === "save" ?

                                                            <button type="button" className="btn btn-primary"
                                                                onClick={() => { sub_Price_Add_Handler() }}

                                                            >Add</button>
                                                            :
                                                            <button type="button" className="btn btn-success w-md"
                                                                onClick={() => { sub_Price_edit_Handler() }} >

                                                                <i className="fas fa-edit me-2"></i>
                                                                update</button>
                                                        }

                                                    </div>

                                                </Modal>
                                                <Col md={1} ></Col>
                                                <Col md={10} >
                                                    <div className="row"> <h4 className={'text-center text-primary'}>Price List</h4></div>
                                                    <Card>
                                                        <CardBody className="mt-3">
                                                            {/* {fun1(priceListByPartyType)} */}
                                                            <MainPriceTree />
                                                            {((priceListByPartyType.length === 0)) ?
                                                                <div className='row justify-content-center mt-n4 '>
                                                                    <div className=' col-10'>
                                                                        <Input type="text" disabled={true}
                                                                            value={'Base Price  Not Exist'} >
                                                                        </Input>
                                                                    </div>
                                                                </div>
                                                                : null
                                                            }
                                                        </CardBody>
                                                        <CardFooter >
                                                            <Row>
                                                                <Col >
                                                                    <Button type="button" color="primary" onClick={(e) => { dropOpen_ONClickHandler({ value: 0, }) }}>
                                                                        <i className="dripicons-plus"></i> Add Sub-Rate</Button>
                                                                </Col>
                                                                <Col className="col col-4">
                                                                </Col>
                                                            </Row>
                                                        </CardFooter>
                                                    </Card>
                                                </Col>
                                            </div>
                                            : null
                                        }

                                    </Card>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}


export default PriceMaster





