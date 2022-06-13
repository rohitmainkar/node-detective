import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
} from "reactstrap";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import {
    AvForm,
    AvGroup,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import AvField from "availity-reactstrap-validation/lib/AvField";
import ReactSelect from "react-select";
import {
    editHPagesIDSuccess,
    getPageList,
    getPageListSuccess,
    saveHPages,
    saveHPagesSuccess,
    updateHPages
} from "../../../store/Administrator/HPagesRedux/actions";
import { fetchModelsList } from "../../../store/Administrator/ModulesRedux/actions";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const HPageMaster = (props) => {
    var editDataGatingFromList = props.state;

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const [IsEdit, setIsEdit] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [selectModule, setSelectModule] = useState('');
    const [PageMode, setPageMode] = useState(false);

    const [selectPageType, setPageType] = useState('');
    const [selectPageList, setPageList] = useState('');
    let showmenu = false;

    const { ModuleData, SaveMessage, PageList } = useSelector((state) => ({
        ModuleData: state.Modules.modulesList,
        SaveMessage: state.H_Pages.saveMessage,
        PageList: state.H_Pages.PageList,
    }));

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        document.getElementById("txtName").focus();
        // document.getElementById("inp-show-menu" ).checked=true;

        dispatch(fetchModelsList())
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList[0]);
            setIsEdit(true);
            setSelectModule({
                label: editDataGatingFromList[0].ModuleName,
                value: editDataGatingFromList[0].ModuleID
            })
            dispatch(editHPagesIDSuccess({ Status: false }))
        }

    }, [editDataGatingFromList]);

    useEffect(() => {
        if ((SaveMessage.Status === true) && (SaveMessage.StatusCode === 200)) {
            dispatch(saveHPagesSuccess({ Status: false }))
            setSelectModule('')
            formRef.current.reset();

            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: SaveMessage.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: SaveMessage.Message,
                    RedirectPath: '/pagesList',
                    AfterResponseAction: false
                }))
            }
        }
        else if (SaveMessage.Status === true) {
            dispatch(saveHPagesSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [SaveMessage.Status])

    const handleValidSubmit = (event, values) => {
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                Description: values.Discription,
                Module: selectModule.value,
                isActive: values.IsActive,
                DisplayIndex: values.DisplayIndex,
                Icon: values.Icon,
                ActualPagePath: values.ActualPagePath,
                CreatedBy: 1,
                UpdatedBy: 1,
            }),
        };
        if (IsEdit) {
            dispatch(updateHPages(requestOptions.body, EditData.ID));
        }
        else {
            dispatch(saveHPages(requestOptions.body));
        }
    };
    const HModuleSelectOnChangeHandller = (e) => {
        setSelectModule(e);
        // dispatch(getH_SubModules(e.value))
    }

    const optionModule = ModuleData.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));



    //  for PageType deropDown
    const PageType_SelectOnChangeHandller = (e) => {

        if (e.label === "ListPage") {
            dispatch(getPageList(e.value))
            // showmenu = true;
            document.getElementById("abc").checked = true;

        }
        else if (e.label === "AddPage") {
            document.getElementById("abc").checked = false;
            dispatch(getPageListSuccess([]))
         
        }
        setPageType(e)
        // dispatch(getPageList(e.value))
    }

    // PageList Dropdown
    const optionPageList = PageList.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    const PageList_SelectOnChangeHandller = (e) => {
        setPageList(e);
        // dispatch(getPageList(e.value));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Page Master| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <AvForm
                                        onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                                        ref={formRef}
                                    >
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Name
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Name" id="txtName" value={EditData.Name} type="text"
                                                        placeholder=" Please Enter Name "
                                                        // autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter a Name' },
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Discription
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Discription" value={EditData.Description} type="text"
                                                        placeholder=" Please Enter Discription "
                                                    // autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                Module
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectModule}
                                                    options={optionModule}
                                                    // autoComplete='off'
                                                    onChange={(e) => { HModuleSelectOnChangeHandller(e) }}
                                                />

                                            </Col>
                                        </Row>

                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    DisplayIndex
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="DisplayIndex" value={EditData.DisplayIndex} type="text"
                                                        // autoComplete='off' 
                                                        placeholder=" Please Enter DisplayIndex" validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Please enter a Display Index ' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Icon
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Icon" value={EditData.Icon} type="text"
                                                        placeholder="Please Enter Icon"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Icon' },
                                                        }}
                                                    // autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Actual Page Path
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="ActualPagePath" value={EditData.ActualPagePath} type="text"
                                                        placeholder="Please Enter Actual Page Path"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Actual Page Path' },
                                                        }}
                                                    // autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                PageType
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectPageType}
                                                    id="first_name"
                                                    options={[{
                                                        value: 1,
                                                        label: "AddPage",
                                                    },
                                                    {
                                                        value: 2,
                                                        label: "ListPage",
                                                    }]}
                                                    autoComplete='off'
                                                    onChange={(e) => { PageType_SelectOnChangeHandller(e); }}
                                                />

                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Show Menu
                                                </Label>
                                                <Col sm={4}>

                                                    {/* <AvField name="Show Menu"
                                                        id="chkShowMenu"
                                                        value={showmenu}
                                                        type="checkbox"
                                                    /> */}
                                                    <input
                                                    
                                                        type="checkbox"
                                                        id="abc"
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                PageList
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectPageList}
                                                    options={optionPageList}
                                                    autoComplete='off'
                                                    onChange={(e) => { PageList_SelectOnChangeHandller(e) }}

                                                />

                                            </Col>
                                        </Row>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    IsActive
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="IsActive"
                                                        checked={EditData.IsActive}
                                                        type="checkbox"

                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                    {
                                                        IsEdit ? (<button
                                                            type="submit"
                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                                                            className="btn btn-success w-md"
                                                        >
                                                            <i class="fas fa-edit me-2"></i>Update
                                                        </button>) : (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </Col>{" "}
                                        </Row>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default HPageMaster;







// version1 day mar4