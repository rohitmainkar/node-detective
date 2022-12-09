import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import MetaTags from "react-meta-tags"
//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Select from "react-select";
import classnames from "classnames";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation";
import { Tbody, Thead } from "react-super-responsive-table";
import {
  AlertState,
  Breadcrumb_inputName,
  editHPagesIDSuccess,
  fetchModelsList,
  getControlTypes,
  getFieldValidations,
  getFieldValidationsSuccess,
  getPageAccess_DropDown_API,
  getPageList,
  getPageListSuccess,
  PostModelsSubmitSuccess,
  saveHPages,
  saveHPagesSuccess,
  updateHPages,
  updateHPagesSuccess
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PAGE_lIST } from "../../../routes/route_url";
import { createdBy } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


const PageMaster = (props) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const [EditData, setEditData] = useState([]);
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [relatedPageListShowUI, setRelatedPageListShowUI] = useState(false);
  const [tablePageAccessDataState, setTablePageAccessDataState] = useState([]);
  const [module_DropdownSelect, setModule_DropdownSelect] = useState("");
  const [pageType_DropdownSelect, setPageType_DropdownSelect] = useState("");
  const [relatedPage_DropdownSelect, setrelatedPage_DropdownSelect] = useState("");
  const [pageAccessDropDownView, setPageAccessDropDownView] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [pageAccess_DropDownSelect, setPageAccess_DropDownSelect] = useState("");
  const [pageAccessData, setPageAccessData] = useState([]);

  const [pageFieldTabTable, setPageFieldTabTable] = useState([{
    ControlID: '',
    FieldLabel: '',
    ControlType: { label: "select", value: 0 },
    FieldValidation: { label: "select", value: 0 },
    InValidMsg: '',
    ListPageSeq: '',
    IsCompulsory: false,
    DefaultSort: 0,
    FieldSequence: false,
    ShowInListPage: false,
    ShowInDownload: false,
    DownloadDefaultSelect: false,

  }]);

  const {
    ControlTypes,
    FieldValidations,
    postMsg,
    updateMsg,
    userAccess,
    ModuleData,
    PageAccess,
    modulePostAPIResponse,
    PageList
  } = useSelector((state) => ({
    ControlTypes: state.H_Pages.ControlTypes,
    FieldValidations: state.H_Pages.FieldValidations,
    postMsg: state.H_Pages.saveMessage,
    updateMsg: state.H_Pages.updateMessage,
    userAccess: state.Login.RoleAccessUpdateData,
    ModuleData: state.Modules.modulesList,
    PageAccess: state.H_Pages.PageAccess,
    modulePostAPIResponse: state.Modules.modulesSubmitSuccesss,
    PageList: state.H_Pages.PageList,
  }));
  // debugger
  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty("editValue")
  const hasShowModal = props.hasOwnProperty("editValue")

  // userAccess useEffect
  useEffect(() => {

    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserPageAccessState(userAcc)
    };
  }, [userAccess])

  useEffect(() => {
    dispatch(fetchModelsList());
    dispatch(getControlTypes());
    dispatch(getFieldValidations());
    dispatch(getPageAccess_DropDown_API());
  }, [dispatch]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if ((hasShowloction || hasShowModal)) {

      let hasEditVal = null
      if (hasShowloction) {
        setPageMode(location.pageMode)
        hasEditVal = location.editValue
      }
      else if (hasShowModal) {
        hasEditVal = props.editValue
        setPageMode(props.pageMode)
        // setModalreturnCss(true)
      }

      if (hasEditVal) {

        let pageType_ID = hasEditVal.PageType;

        setEditData(hasEditVal);

        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        setPageAccessData(hasEditVal.PagePageAccess);

        setModule_DropdownSelect({
          label: hasEditVal.ModuleName,
          value: hasEditVal.Module,
        });

        let PageFieldMaster = hasEditVal.PageFieldMaster.map((index) => {
          return {
            ControlType: {
              label: index.ControlTypeName,
              value: index.ControlType
            },
            FieldValidation: {
              label: index.FieldValidationName,
              value: index.FieldValidation
            },
            ControlID: index.ControlID,
            FieldLabel: index.FieldLabel,
            InValidMsg: index.InValidMsg,
            IsCompulsory: index.IsCompulsory,
            DefaultSort: index.DefaultSort,
            ListPageSeq: index.ListPageSeq,
            ShowInListPage: index.ShowInListPage,
            ShowInDownload: index.ShowInDownload,
            DownloadDefaultSelect: index.ShownloadDefaultSelect
          }
        })
        PageFieldMaster.sort((firstItem, secondItem) => firstItem.ListPageSeq - secondItem.ListPageSeq);

        if (!(PageFieldMaster.length === 0) && (pageType_ID === 1)) {
          setPageFieldTabTable(PageFieldMaster)
        }

        let PageFieldList = hasEditVal.PageFieldList.map((index) => {
          return {
            ControlType: {
              label: index.ControlTypeName,
              value: index.ControlType
            },
            FieldValidation: {
              label: index.FieldValidationName,
              value: index.FieldValidation
            },
            ControlID: index.ControlID,
            FieldLabel: index.FieldLabel,
            InValidMsg: index.InValidMsg,
            IsCompulsory: index.IsCompulsory,
            DefaultSort: index.DefaultSort,
            ListPageSeq: index.ListPageSeq,
            ShowInListPage: index.ShowInListPage,
            ShowInDownload: index.ShowInDownload,
            DownloadDefaultSelect: index.ShownloadDefaultSelect
          }
        })
        PageFieldList.sort((firstItem, secondItem) => firstItem.ListPageSeq - secondItem.ListPageSeq);


        if ((pageType_ID === 2)) {
          setPageFieldTabTable(PageFieldList)
        }

        if (hasEditVal.PageType === 2) {
          setRelatedPageListShowUI(true)
        }
        setrelatedPage_DropdownSelect({
          value: hasEditVal.RelatedPageId,
          label: hasEditVal.RelatedPageName,
        });

        // When value 2 is get then DropDown lable is "ListPage" and ShowMenu is disabled Otherwise DropDown lable is "AddPage" and ShowMenu is enabled

        if (pageType_ID === 2) {
          setPageAccessDropDownView(true);
          dispatch(getPageList(pageType_ID));
          setPageType_DropdownSelect({ value: 2, label: "ListPage" });

        } else if (pageType_ID === 1) {
          dispatch(getPageListSuccess([]));
          setrelatedPage_DropdownSelect({ value: 0 });
          setPageType_DropdownSelect({ value: 1, label: "AddPage" });
        }
        console.log("hasEditVal", hasEditVal)
        dispatch(editHPagesIDSuccess({ Status: false }));
      }
    }
  }, []);

  const pageAccessval = useMemo(() => {
    const arr = []
    PageAccess.forEach(i => {
      i["hascheck"] = false;
      pageAccessData.forEach(ele => {
        if (ele.AccessName === i.Name) {
          i.hascheck = true
        }
      })
      arr.push(i)
    })
    return arr
  }, [pageAccessData, PageAccess]);

  // This UseEffect clear Form Data and when modules Save Successfully.
  useEffect(() => {
    if (postMsg.Status === true && postMsg.StatusCode === 200) {
      dispatch(saveHPagesSuccess({ Status: false }));
      setModule_DropdownSelect("");
      setPageAccess_DropDownSelect("");
      setPageType_DropdownSelect("");
      setrelatedPage_DropdownSelect("");
      if (pageMode === "true") {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMsg.Message,
          })
        );
      } else {
        dispatch(
          AlertState({
            Type: 1,
            Status: true,
            Message: postMsg.Message,
            RedirectPath: PAGE_lIST,
            AfterResponseAction: false,
          })
        );
      }
    } else if (postMsg.Status === true) {
      dispatch(saveHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: JSON.stringify(postMsg.Message),
          RedirectPath: false,
          AfterResponseAction: false,
        })
      );
    }
  }, [postMsg]);

  useEffect(() => {
    if ((modulePostAPIResponse.Status === true) && (modulePostAPIResponse.StatusCode === 200)) {
      dispatch(PostModelsSubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 1,
        Status: true,
        Message: modulePostAPIResponse.Message,
      }))
      tog_center()
    } else if (modulePostAPIResponse.Status === true) {
      dispatch(PostModelsSubmitSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(modulePostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }

  }, [modulePostAPIResponse])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      history.push({
        pathname: PAGE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateHPagesSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  const Module_DropdownOption = ModuleData.map((d) => ({
    value: d.id,
    label: d.Name,
  }));

  // PageList Dropdown
  const PageList_DropdownOption = PageList.map((d) => ({
    value: d.id,
    label: d.Name,
  }));

  // PageList Dropdown
  const PageType_DropdownOption = [
    {
      value: 1,
      label: "Add Page",
    },
    {
      value: 2,
      label: "Page List",
    },
  ];

  const ControlTypes_DropdownOptions = ControlTypes.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const FieldValidations_DropdownOptions = FieldValidations.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  function PageField_Tab_AddRow_Handler() {

    var newarr1 = [...pageFieldTabTable, {
      ControlID: '',
      FieldLabel: '',
      ControlType: { label: "select", value: 0 },
      FieldValidation: { label: "select", value: 0 },
      InValidMsg: '',
      IsCompulsory: false,
      DefaultSort: 0,
      FieldSequence: '',
      ShowInListPage: false,
      ListPageSeq: '',
      ShowInDownload: false,
      DownloadDefaultSelect: false,

    }]
    setPageFieldTabTable(newarr1)
  }

  function PageField_DeleteRow_Handler(key) {

    var removeElseArrray1 = pageFieldTabTable.filter((i, k) => {
      return !(k === key)
    })
    setPageFieldTabTable(removeElseArrray1)
  }

  function arrow_value(key) {
    if (pageFieldTabTable[key].DefaultSort = 2) {
      var x = document.getElementById("up");
      var y = document.getElementById("down");

      y.style.display = "block";
      x.style.display = "none";
    }

  }

  function arrow_value1(key) {
    if (pageFieldTabTable[key].DefaultSort = 1) {
      var x = document.getElementById("up");
      var y = document.getElementById("down");

      x.style.display = "block";
      y.style.display = "none";
    }
  }

  function PageField_onChange_Handler(event, type = '', key) {

    const newval = pageFieldTabTable.map((index, k) => {

      if (key === k) {
        if ((type === "ControlType")) {
          index.ControlType = event
          index.InValidMsg = (event.value === 4) ? '' : index.InValidMsg;
          index.FieldValidation = "";
        }
        else if ((type === "DefaultSort")) {
          index.DefaultSort = event ? 1 : 0;
        } else { index[type] = event }
      };

      if (type === "DefaultSort" && !(k === key)) {
        index["DefaultSort"] = 0
      }
      return index
    })

    setPageFieldTabTable(newval)
  }

  function ControlType_Dropdown_Handler(e, key) {
    dispatch(getFieldValidations(e.value))
    PageField_onChange_Handler(e, "ControlType", key)
  }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const FormSubmitButton_Handler = (event, values) => {


    let Access = []
    PageAccess.forEach((element, key) => {
      if (element.hascheck) {
        Access.push({ Access: element.id })
      }
    });
    const PageFieldMaster = pageFieldTabTable.map((index) => ({
      ControlID: index.ControlID,
      FieldLabel: index.FieldLabel,
      InValidMsg: index.InValidMsg,
      IsCompulsory: index.IsCompulsory,
      DefaultSort: index.DefaultSort,
      ListPageSeq: index.ListPageSeq,
      ShowInListPage: index.ShowInListPage,
      ShowInDownload: index.ShowInDownload,
      ControlType: index.ControlType.value,
      FieldValidation: index.FieldValidation.value,
      DownloadDefaultSelect: index.DownloadDefaultSelect,
    }))

    if (
      Access.length === 0 &&
      (pageType_DropdownSelect.value === 2)
    ) {
      dispatch(
        AlertState({
          Type: 4,
          Status: true,
          Message: "At Least One PageAccess is Select",
          RedirectPath: false,
          PermissionAction: false,
        })
      );
      return;
    }

    // if ((pageType_DropdownSelect.value === 2)) {
    //   dispatch(
    //     AlertState({
    //       Type: 4,
    //       Status: true,
    //       Message: "Please Select Related Page ID",
    //       RedirectPath: false,
    //       PermissionAction: false,
    //     })
    //   );
    //   return;
    // }

    const jsonBody = JSON.stringify({
      Name: values.Name,
      Module: module_DropdownSelect.value,
      isActive: values.isActive,
      DisplayIndex: values.displayIndex,
      Icon: values.Icon,
      ActualPagePath: values.pagePath,
      PageType: pageType_DropdownSelect.value,
      PageHeading: values.pageheading,
      PageDescription: values.pagedescription,
      PageDescriptionDetails: values.pageheadingdescription,
      RelatedPageID: relatedPage_DropdownSelect.value,
      IsDivisionRequired: values.IsDivisionRequired,
      IsEditPopuporComponent: values.IsEditPopuporComponent,
      CreatedBy: createdBy(),
      UpdatedBy: createdBy(),
      PagePageAccess: Access,
      PageFieldMaster: PageFieldMaster,
    })
    if ((pageType_DropdownSelect.value === 1) && (PageFieldMaster.length === 0)) {
      {
        dispatch(
          AlertState({
            Type: 4,
            Status: true,
            Message: "PageFields is Required",
            RedirectPath: false,
            PermissionAction: false,
          })
        );
        return;
      }
    }
    if (pageMode === "edit") {
      dispatch(updateHPages(jsonBody, EditData.id));
      console.log("updated jsonBody", jsonBody)
    } else {
      dispatch(saveHPages(jsonBody));
      console.log("post jsonBody", jsonBody)
    }
  };


  // for module dropdown
  const Module_DropdownSelectHandller = (e) => {
    setModule_DropdownSelect(e);
  };


  //  for PageType deropDown
  const PageType_DropdownSelectHandller = (e) => {
    if (e.value === 2) {
      relatedPage_DropdownSelectHandller()
      setRelatedPageListShowUI(true)
      dispatch(getPageList(e.value));
      setPageAccessDropDownView(true);
    }
    else if (e.value === 1) {
      setRelatedPageListShowUI(false)
      setTablePageAccessDataState([]);
      setPageAccessDropDownView(false);
      dispatch(getPageListSuccess([]));
      setrelatedPage_DropdownSelect({ value: 0 });
    }
    setPageType_DropdownSelect(e);
  };

  const relatedPage_DropdownSelectHandller = (e) => {
    setrelatedPage_DropdownSelect(e);
  };



  function tog_center() {
    setmodal_center(!modal_center)
  }
  function DropDownAddHandler() {
    tog_center()
  }



  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <MetaTags>
            <title>Page Master| FoodERP-React FrontEnd</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}

            <AvForm
              id="mainForm"
              name="mainForm"
              onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v); }}>

              <Breadcrumb pageHeading={userPageAccessState.PageHeading} />
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black c_card_header" >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                  </CardHeader>
                  <CardBody>
                    <Nav tabs className="nav-tabs-custom nav-justified">
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleCustom("1");
                          }}
                        >
                          <span className="d-block d-sm-none">
                            <i className="fas fa-home"></i>
                          </span>
                          <span className="d-none d-sm-block">Page Master Details</span>
                        </NavLink>
                      </NavItem>
                      {/* {(pageType_DropdownSelect.value === 1) ? */}
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "2",
                          })}
                          onClick={() => {
                            toggleCustom("2");
                          }}
                        >
                          <span className="d-block d-sm-none">
                            <i className="far fa-user"></i>
                          </span>
                          <span className="d-none d-sm-block">Page Field</span>
                        </NavLink>
                      </NavItem>


                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                        >
                          <span className="d-block d-sm-none">
                            <i className="fas fa-home"></i>
                          </span>
                          <Row >
                            <Col sm={2}>
                              <div>
                                {
                                  pageMode === "edit" ?
                                    userPageAccessState.RoleAccess_IsEdit ?
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Page"
                                        className="btn btn-success w-md float-right"
                                      >
                                        <i class="fas fa-edit me-2"></i>Update
                                      </button>
                                      :
                                      <></>
                                    : (
                                      userPageAccessState.RoleAccess_IsSave ?
                                        <button
                                          type="submit"
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Page"
                                          className="btn btn-primary w-md float-right"
                                        > <i className="fas fa-save me-2"></i> Save
                                        </button>
                                        :
                                        <></>
                                    )
                                }
                              </div>
                            </Col>
                          </Row>
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent
                      activeTab={customActiveTab}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="1">
                        <Card className="text-black c_card_body" >
                          <CardBody >
                            <Row >
                              <Col md="3">
                                <FormGroup className="mb-3 ">
                                  <Label>Name </Label>
                                  <AvField
                                    name="Name"
                                    id="txtName"
                                    value={EditData.Name}
                                    // disabled={pageMode === 'edit' ? true : false}
                                    type="text"
                                    placeholder="Please Enter Name"
                                    autoComplete="off"
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage: "Please Enter Name",
                                      },
                                    }}
                                    onChange={(e) => {
                                      dispatch(Breadcrumb_inputName(e.target.value));
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1"> </Col>

                              <Col md="7">
                                <FormGroup className="mb-3 ">
                                  <Label>Page Description </Label>
                                  <AvField
                                    name="pagedescription"
                                    value={EditData.PageDescription}
                                    type="text"
                                    placeholder="Please Enter Page Description"
                                    autoComplete="off"
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage: "Please Enter Page Description",
                                      },
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label>Page Heading</Label>
                                  <AvField
                                    name="pageheading"
                                    type="text"
                                    defaultValue=""
                                    value={EditData.PageHeading}
                                    placeholder="Enter your Page Heading "
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1"> </Col>
                              <Col md="7">
                                <FormGroup className="mb-3">
                                  <Label>Page Description Details</Label>
                                  <AvField
                                    name="pageheadingdescription"
                                    type="text"
                                    defaultValue=""
                                    value={EditData.PageDescriptionDetails}
                                    placeholder="Enter your Description "
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage:
                                          "Please Enter Page Description Deails",
                                      },
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>

                        <Card className=" mt-n2 text-black c_card_body">
                          <CardBody>
                            <Row >
                              <Col md="3">

                                <FormGroup className="mb-3 ">
                                  <Label htmlFor="validationCustom01">Module</Label>
                                  <Select
                                    value={module_DropdownSelect}
                                    options={Module_DropdownOption}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      Module_DropdownSelectHandller(e);
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1" className=" mt-3">
                                <Button

                                  // className=" mt-3 btn btn-sm"
                                  className=" button_add badge badge-soft-primary font-size-12 waves-effect  waves-light  btn-outline-primary"
                                  type="button" onClick={() => { DropDownAddHandler() }}>
                                  <i className="dripicons-plus"></i>

                                </Button>
                              </Col>

                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Page Type</Label>
                                  <Select
                                    value={pageType_DropdownSelect}
                                    options={PageType_DropdownOption}
                                    autoComplete="off"
                                    onChange={(e) => {
                                      PageType_DropdownSelectHandller(e);
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1"> </Col>
                              {relatedPageListShowUI ?
                                <Col md="3">
                                  <FormGroup className="mb-3">
                                    <Label htmlFor="validationCustom01">
                                      Related Page List
                                    </Label>
                                    <Select
                                      value={relatedPage_DropdownSelect}
                                      options={PageList_DropdownOption}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        relatedPage_DropdownSelectHandller(e);
                                      }}
                                    />
                                  </FormGroup>
                                </Col> : null}


                            </Row>

                            <Row>
                              <Col md="3">
                                <FormGroup>
                                  <Label htmlFor="validationCustom01">
                                    Display Index
                                  </Label>
                                  <AvField
                                    name="displayIndex"
                                    value={EditData.DisplayIndex}
                                    type="text"
                                    autoComplete="off"
                                    placeholder=" Please Enter Display Index"
                                    validate={{
                                      number: true,
                                      required: {
                                        value: true,
                                        errorMessage:
                                          "Please Enter Display Index Only 2 Digit ",
                                      },
                                      tel: {
                                        pattern: /^\d{1,2}$/,
                                      },
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1"> </Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Page Path</Label>
                                  <AvField
                                    name="pagePath"
                                    id="pagePathid"
                                    value={EditData.ActualPagePath}
                                    disabled={pageMode === 'edit' ? true : false}
                                    type="text"
                                    placeholder="Please Enter Page Path"
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage: "Please Enter Page Path",
                                      },
                                    }}
                                    autoComplete="off"
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1"> </Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Icon</Label>
                                  <AvField
                                    name="Icon"
                                    value={EditData.Icon}
                                    type="text"
                                    placeholder="Please Enter Icon"
                                    validate={{
                                      required: {
                                        value: true,
                                        errorMessage: "Please Enter Icon",
                                      },
                                    }}
                                    autoComplete="off"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row Col sm="12">
                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">
                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-3 col-form-label mt-4"
                                  >
                                    Active{" "}
                                  </Label>
                                  <Col md={5} style={{ marginTop: "15px" }}>
                                    <div
                                      className="form-check form-switch form-switch-md mb-1"
                                      dir="ltr"
                                    >
                                      <AvInput
                                        type="checkbox"
                                        className="form-check-input mt-4"
                                        id="customSwitchsizemd"
                                        checked={EditData.isActive}
                                        name="isActive"
                                        defaultChecked={true}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="customSwitchsizemd"
                                      ></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">

                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-4 col-form-label mt-4"
                                  >
                                    Division Req*{" "}
                                  </Label>
                                  <Col md={5} style={{ marginTop: "15px" }}>
                                    <div
                                      className="form-check form-switch form-switch-md mb-1"
                                      dir="ltr"
                                    >
                                      <AvInput
                                        type="checkbox"
                                        className="form-check-input mt-4"
                                        id="customSwitchsizemd"
                                        defaultChecked={EditData.IsDivisionRequired}
                                        name="IsDivisionRequired"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="customSwitchsizemd"
                                      ></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-1 col col-sm-4">
                                <Row className="justify-content-md-left">

                                  <Label
                                    htmlFor="horizontal-firstname-input"
                                    className="col-sm-4 col-form-label mt-4"
                                  >
                                    EditMode show In Component
                                  </Label>
                                  <Col md={5} style={{ marginTop: "15px" }}>
                                    <div
                                      className="form-check form-switch form-switch-md mb-1"
                                      dir="ltr"
                                    >
                                      <AvInput
                                        type="checkbox"
                                        className="form-check-input mt-4"
                                        id="customSwitchsizemd"
                                        defaultChecked={EditData.IsEditPopuporComponent}
                                        name="IsEditPopuporComponent"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="customSwitchsizemd"
                                      ></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                          </CardBody>

                        </Card>

                        {pageAccessDropDownView ? (

                          <Card className=" mt-n2  " >
                            <CardBody style={{ backgroundColor: "whitesmoke"}}>
                              <h5 className="text-black "> Page Access</h5><br></br>

                              <Row className="row ">
                                {pageAccessval.map((index, key) => {

                                  return (
                                    <Col className="col col-4 text-black" >
                                      <li>
                                        <Row className="row ">
                                          <Col className=" col col-6 ">
                                            <li>
                                              <Label>{index.Name}</Label>
                                            </li>
                                          </Col>

                                          <Col className=" col col-6 ">
                                            <Input
                                              className="col col-2 text-black "
                                              type="checkbox"
                                              defaultChecked={index.hascheck}
                                              onChange={e => {
                                                pageAccessval[key].hascheck = e.target.checked
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </li>
                                    </Col>
                                  )
                                })}
                              </Row>


                            </CardBody>
                          </Card>
                        ) : null}
                      </TabPane>

                      <TabPane tabId="2">

                        <div className="table-rep-plugin  mx-n4">
                          <div
                            className="custom_scroll_div"
                            data-pattern="priority-columns "
                          >
                            <Table className="table table-bordered table-responsive ">
                              <Thead  >
                                <tr style={{ zIndex: "23" }} className="">
                                  <th className="">Control ID</th>
                                  <th className="">Field Label</th>
                                  <th className="">Control Type</th>
                                  <th className="" >Field Validation</th>
                                  <th className="" >InValid Msg</th>
                                  <th className="">List Page Seq</th>
                                  <th >Is Compulsory</th>
                                  <th>Default Sort</th>
                                  <th>Show In List Page</th>
                                  <th>Show In Download</th>
                                  <th>Download Default Select</th>
                                  <th className="col col-sm-1">Action</th>

                                </tr>
                              </Thead>

                              <Tbody  >

                                {pageFieldTabTable.map((TableValue, key) => (
                                  <tr >
                                    <td>
                                      <div style={{ width: "150px" }}>
                                        <Input
                                          type="text"
                                          id={`ControlID${key}`}
                                          autoComplete="off"
                                          defaultValue={EditData.ControlID}
                                          value={pageFieldTabTable[key].ControlID}
                                          onChange={(e) => PageField_onChange_Handler(e.target.value, "ControlID", key)}>
                                        </Input>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "150px" }}>
                                        <Input
                                          type="text"
                                          id={`FieldLabel${key}`}
                                          autoComplete="off"
                                          defaultValue={EditData.FieldLabel}
                                          value={pageFieldTabTable[key].FieldLabel}
                                          onChange={(e) => PageField_onChange_Handler(e.target.value, "FieldLabel", key)}>
                                        </Input>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "150px" }}>
                                        <Select
                                          id={`ControlType-${key}`}
                                          // placeholder="select unit"
                                          value={pageFieldTabTable[key].ControlType}
                                          options={ControlTypes_DropdownOptions}
                                          onChange={(e) => { ControlType_Dropdown_Handler(e, key); }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "150px" }}>
                                        <Select
                                          id={`FieldValidation-${key}`}
                                          autoComplete="off"
                                          value={pageFieldTabTable[key].FieldValidation}
                                          // isDisabled={TableValue.ControlType.value === 4 ? true : false}
                                          options={FieldValidations_DropdownOptions}
                                          onChange={(e) => { PageField_onChange_Handler(e, "FieldValidation", key); }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "150px" }}>
                                        <Input
                                          type="text"
                                          id={`InValidMsg${key}`}
                                          autoComplete="off"
                                          defaultValue={EditData.InValidMsg}
                                          disabled={TableValue.ControlType.value === 4 ? true : false}
                                          value={pageFieldTabTable[key].InValidMsg}
                                          onChange={(e) => PageField_onChange_Handler(e.target.value, "InValidMsg", key)}>
                                        </Input>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "70px" }}>
                                        <Input
                                          autoComplete="off"
                                          type="text"
                                          id={`ListPageSeq${key}`}
                                          defaultValue={EditData.ListPageSeq}
                                          value={pageFieldTabTable[key].ListPageSeq}
                                          onChange={(e) => PageField_onChange_Handler(e.target.value, "ListPageSeq", key)}>

                                        </Input>
                                      </div>
                                    </td>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        id={`IsCompulsory${key}`}
                                        disabled={TableValue.ControlType.value === 4 ? true : false}
                                        checked={(TableValue.ControlType.value === 4) ? pageFieldTabTable[key].IsCompulsory = false : pageFieldTabTable[key].IsCompulsory}
                                        onChange={(e) => PageField_onChange_Handler(e.target.checked, "IsCompulsory", key)}>

                                      </Input>
                                    </td>

                                    <td >
                                      <div className="d-flex">
                                        <div>
                                          <Input

                                            type="radio"
                                            name="btnradio"
                                            value={`DefaultSort${key}`}
                                            id={`DefaultSort${key}`}
                                            checked={pageFieldTabTable[key].DefaultSort}
                                            onChange={(e) => PageField_onChange_Handler(e.target.checked, "DefaultSort", key)}>
                                          </Input>
                                        </div>

                                        {pageFieldTabTable[key].DefaultSort > 0 ?
                                          <div >
                                            <i
                                              className=" bx bx-caret-up font-size-20 text-danger "
                                              id="up"
                                              style={{ display: pageFieldTabTable[key].DefaultSort === 1 ? "block" : "none" }}

                                              onClick={(e) => arrow_value(key)}></i>

                                            <i
                                              className=" bx bx-caret-down font-size-20 text-danger "
                                              style={{ display: pageFieldTabTable[key].DefaultSort === 2 ? "block" : "none" }}

                                              id="down"
                                              onClick={(e) => arrow_value1(key)}></i>
                                          </div>
                                          : null}

                                      </div>
                                    </td>

                                    <td>
                                      <Input
                                        type="checkbox"
                                        id={`ShowInListPage${key}`}
                                        checked={pageFieldTabTable[key].ShowInListPage}
                                        onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInListPage", key)}>
                                      </Input>
                                    </td>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        id={`ShowInDownload${key}`}
                                        defaultChecked={pageFieldTabTable[key].ShowInDownload}
                                        onChange={(e) => PageField_onChange_Handler(e.target.checked, "ShowInDownload", key)}>
                                      </Input>
                                    </td>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        id={`DownloadDefaultSelect${key}`}
                                        disabled={TableValue.ShowInDownload === true ? false : true}
                                        checked={
                                          (TableValue.ShowInDownload === false)
                                            ? pageFieldTabTable[key].DownloadDefaultSelect = false
                                            : pageFieldTabTable[key].DownloadDefaultSelect}
                                        onChange={(e) => PageField_onChange_Handler(e.target.checked, "DownloadDefaultSelect", key)}>
                                      </Input>
                                    </td>
                                    <td>
                                      {(pageFieldTabTable.length === key + 1) ?
                                        <Row className="">
                                          <Col md={6} className=" mt-3">
                                            {(pageFieldTabTable.length > 0) ? <>
                                              < i className="mdi mdi-trash-can d-block text-danger font-size-20"
                                                onClick={() => {
                                                  PageField_DeleteRow_Handler(key)
                                                }} >
                                              </i>
                                            </> : <Col md={6} ></Col>}

                                          </Col>

                                          <Col md={6} >

                                            <div className="col border-end d-flex justify-content-center ">
                                              <Button
                                                className="btn btn-outline-light btn-sm  align-items-sm-center text-center mt-3"
                                                // className="button button-white button-animate "
                                                type="button"
                                                onClick={() => { PageField_Tab_AddRow_Handler(key) }}
                                              >
                                                <i className="dripicons-plus">

                                                </i>
                                              </Button>
                                            </div>
                                          </Col>
                                        </Row>
                                        :

                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                          PageField_DeleteRow_Handler(key)
                                        }} >
                                        </i>
                                      }

                                    </td>
                                  </tr>
                                ))}

                              </Tbody>
                            </Table>
                            {
                              pageFieldTabTable.length === 0 ?
                                <div className="col border-end d-flex justify-content-center mt-5 ">
                                  <Button type="button"
                                    onClick={() => { PageField_Tab_AddRow_Handler() }}
                                    className="button button-white button-animate ">Add New Row
                                    <i className="dripicons-plus"> </i>
                                  </Button>
                                </div> : null
                            }
                            {/* className="btn btn-sm "> */}

                          </div>
                        </div>

                      </TabPane>

                    </TabContent>

                  </CardBody>
                </Card>

              </Col>
            </AvForm>
          </Container>
        </div>
      </React.Fragment >
    )
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}
export default PageMaster;