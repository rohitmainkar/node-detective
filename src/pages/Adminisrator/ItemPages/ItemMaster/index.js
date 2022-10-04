import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
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
} from "reactstrap"
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { AvForm } from "availity-reactstrap-validation"
import Select from "react-select";
import { fetchCompanyList } from "../../../../store/Administrator/CompanyRedux/actions"
import {
    editItemSuccess,
    getBaseUnit_ForDropDown,
    get_CategoryTypes_ForDropDown,
    get_Category_By_CategoryType_ForDropDown,
    get_Category_By_CategoryType_ForDropDown_Success,
    get_Division_ForDropDown,
    get_ImageType_ForDropDown,
    get_Party_ForDropDown,
    get_PriceList_ForDropDown,
    get_Sub_Category_By_CategoryType_ForDropDown,
    get_Sub_Category_By_CategoryType_ForDropDown_Success,
    postItemData,
    PostItemDataSuccess,
    updateItemID
} from "../../../../store/Administrator/ItemsRedux/action";
import { AlertState, BreadcrumbShow } from "../../../../store/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import GSTTab from "./GST_Tab";
import MRPTab from "./MRP_Tab";
import Margin_Tab from "./MarginTab/index";

const ItemsMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    console.log("editDataGatingFromList", editDataGatingFromList)
    let pageModeProps = props.pageMode

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState(11);
    const [activeTab1, setactiveTab1] = useState("1")
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");

    let initial = {
        Name: "",
        Sequence: "",
        ShortName: "",
        BarCode: '',
        Company: "",
        BaseUnit: { value: 0, label: "select" },
        MRP: '',
        GST: '',
        HSN: '',
        isActive: true,
    }

    const initialInValid = ["txtName0", "txtShortName0", "txtBarCode0", "dropBaseUnit-0", "dropCompany-0", "txtSequence0"]
    let [isValidate, setIsValidate] = useState(initialInValid);
    let [refresh, setrefresh] = useState('');

    const [formValue, setFormValue] = useState(initial);


    // categoryTabTable
    const [categoryTabTable, setCategoryTabTable] = useState([{
        CategoryType: { label: 'select', value: 0 },
        CategoryTypeOption: [],
        Category: { label: 'select', value: 0 },
        SubCategory: { label: 'select', value: 0 },

        Category_DropdownOptions: [],
        SubCategory_DropdownOptions: []
    }]);

    const [marginTabTable, setMarginTabTable] = useState([])

    const [marginMaster, setMarginMaster] = useState([]);

    const [divisionTableData, setDivisionTableData] = useState([]);

    const [imageTabTable, setImageTabTable] = useState([{
        ImageType: '',
        ImageUpload: ''
    }]);
    const [baseUnitTableData, setBaseUnitTableData] = useState([{
        Conversion: '',
        Unit: { label: "", value: 0 },
    }]);
    const [MRP_Tab_TableData, setMRP_Tab_TableData] = useState([]);

    const [GStDetailsTabTable, setGSTDetailsTabTable] = useState([]);

    const [GStDetailsMaster, setGStDetailsMaster] = useState([]);

    const { companyList,
        BaseUnit,
        CategoryType,
        Category,
        SubCategory,
        DivisionType,
        PostAPIResponse,
        RoleAccessModifiedinSingleArray,
        ImageType,
        MRPType,
        Division,
        Party,
        PriceList
    } = useSelector((state) => ({
        companyList: state.Company.companyList,
        BaseUnit: state.ItemMastersReducer.BaseUnit,
        CategoryType: state.ItemMastersReducer.CategoryType,
        Category: state.ItemMastersReducer.CategoryByCategoryType,
        SubCategory: state.ItemMastersReducer.SubCategoryByCategoryType,
        DivisionType: state.PartyMasterReducer.partyList,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        PostAPIResponse: state.ItemMastersReducer.postMessage,
        ImageType: state.ItemMastersReducer.ImageType,
        MRPType: state.ItemMastersReducer.MRPType,
        Division: state.ItemMastersReducer.Division,
        Party: state.ItemMastersReducer.Party,
        PriceList: state.ItemMastersReducer.PriceList,
    }));


    useEffect(() => {

        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    useEffect(() => {
        debugger
        if (!(userPageAccessState === '')) { document.getElementById("txtName0").focus(); }

        if (!(editDataGatingFromList === undefined)) {

            setEditData(editDataGatingFromList);
            let editMode_Data = editDataGatingFromList
            setPageMode(pageModeProps);
            dispatch(BreadcrumbShow(editMode_Data.Name))

            let initialFormValue = {
                Name: editMode_Data.Name,
                Sequence: editMode_Data.Sequence,
                ShortName: editMode_Data.ShortName,
                BarCode: editMode_Data.BarCode,
                Company: { label: editMode_Data.CompanyName, value: editMode_Data.Company },
                BaseUnit: { label: editMode_Data.BaseUnitName, value: editMode_Data.BaseUnitID },
                isActive: editMode_Data.isActive,
            }
            let initialCategory = editMode_Data.ItemCategoryDetails.map((indx, key) => {

                dispatch(get_Category_By_CategoryType_ForDropDown(indx.CategoryType, key))
                dispatch(get_Sub_Category_By_CategoryType_ForDropDown(indx.Category, key))
                return {
                    CategoryType: {
                        label: indx.CategoryTypeName,
                        value: indx.CategoryType
                    },
                    CategoryTypeOption: [],
                    Category: {
                        label: indx.CategoryName,
                        value: indx.Category
                    },
                    SubCategory: {
                        label: indx.SubCategoryName,
                        value: indx.SubCategory
                    },

                    Category_DropdownOptions: [],
                    SubCategory_DropdownOptions: []
                }
            })

            let ItemImagesDetails = editMode_Data.ItemImagesDetails.map((index) => {

                return {
                    ImageType: {
                        label: index.ImageTypeName,
                        value: index.ImageType
                    },
                    ImageUpload: index.Item_pic

                }
            })

            let itemDivisionDetails = editMode_Data.ItemDivisionDetails.map((index) => {
                return {
                    label: index.DivisionName,
                    value: index.Division
                }
            })

            let ItemUnitDetails = editMode_Data.ItemUnitDetails.map((index) => {
                return {
                    Unit: {
                        label: index.UnitName,
                        value: index.UnitID,
                    },
                    Conversion: index.BaseUnitQuantity,
                }
            })

            let ItemMRPDetails = editMode_Data.ItemMRPDetails.map((index) => {
                return {
                    MRPType: {
                        label: index.MRPTypeName,
                        value: index.MRPType
                    },
                    MRP: index.MRP,
                    GSTPercentage: index.GSTPercentage,
                    HSNCode: index.HSNCode,
                }
            })

            let ItemMarginDetails = editMode_Data.ItemMarginDetails.map((index) => {
                return {
                    PriceList: index.PriceList,
                    Party: index.Party,
                    EffectiveDate: index.EffectiveDate,
                    Margin: index.Margin

                }
            })

            let ItemGSTDetails = editMode_Data.ItemGSTHSNDetails.map((index) => {

                return {
                    GST: index.GSTPercentage,
                    HSNCode: index.HSNCode,
                    EffectiveDate: index.EffectiveDate,
                }
            })

            setFormValue(initialFormValue);
            setCategoryTabTable(initialCategory)
            setImageTabTable(ItemImagesDetails)
            setDivisionTableData(itemDivisionDetails)
            setBaseUnitTableData(ItemUnitDetails)
            setMRP_Tab_TableData(editMode_Data.ItemMRPDetails)
            setMarginMaster(editMode_Data.ItemMarginDetails)
            setGStDetailsMaster(editMode_Data.ItemGSTHSNDetails)
            setIsValidate([])

            dispatch(editItemSuccess({ Status: false }))

        }

    }, [editDataGatingFromList])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(PostItemDataSuccess({ Status: false }))

            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                    RedirectPath: '/ItemList',
                }))
            }
        }

        else if (PostAPIResponse.Status === true) {
            dispatch(PostItemDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getBaseUnit_ForDropDown());
        dispatch(get_CategoryTypes_ForDropDown());
        // dispatch(get_Category_By_CategoryType_ForDropDown());
        // dispatch(get_Sub_Category_By_CategoryType_ForDropDown());
        dispatch(getPartyListAPI());
        dispatch(get_ImageType_ForDropDown());
        // dispatch(get_MRPTypes_ForDropDown());
        dispatch(get_Division_ForDropDown());
        dispatch(get_Party_ForDropDown());
        dispatch(get_PriceList_ForDropDown());
    }, [dispatch]);


    useEffect(() => {

        let key = Category.key
        if ((key === null)) return;

        let Category_DropdownOptions = Category.Data.map((data) => ({
            value: data.id,
            label: data.Name
        }));

        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = {
            CategoryType: found.CategoryType,
            Category: found.Category,
            SubCategory: found.SubCategory,
            Category_DropdownOptions: Category_DropdownOptions,
            SubCategory_DropdownOptions: []
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)
        dispatch(get_Category_By_CategoryType_ForDropDown_Success({ Data: [], key: null }))
    }, [Category]);

    useEffect(() => {

        let key = SubCategory.key
        if ((key === null)) return;

        let SubCategory_DropdownOptions = SubCategory.Data.map((data) => ({
            value: data.id,
            label: data.Name
        }));

        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = {
            CategoryType: found.CategoryType,
            Category: found.Category,
            SubCategory: found.SubCategory,
            Category_DropdownOptions: found.Category_DropdownOptions,
            SubCategory_DropdownOptions: SubCategory_DropdownOptions,
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)
        dispatch(get_Sub_Category_By_CategoryType_ForDropDown_Success({ Data: [], key: null }))

    }, [SubCategory]);

    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

    const Company_DropdownOptions = companyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const BaseUnit_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));
    // const BaseUnit_DropdownOptions2 = BaseUnit.map((data) => ({
    //     value: data.id,
    //     label: data.Name
    // }))

    let BaseUnit_DropdownOptions2 = []
    BaseUnit.forEach(myFunction);
    function myFunction(item, index, arr) {
        if (!(formValue.BaseUnit.label === item.Name)) {
            BaseUnit_DropdownOptions2[index] = {
                value: item.id,
                label: item.Name
            };
        }
    }

    const PriceList_DropdownOptions = BaseUnit.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    //   const PriceList_DropdownOptions = [
    //     {
    //       value: 1,
    //       label: "ABC",
    //     },
    //     {
    //       value: 2,
    //       label: "XYZ",
    //     },
    //   ];

    const CategoryType_DropdownOptions = CategoryType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const DivisionType_DropdownOptions = DivisionType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const ImageType_DropdownOptions = ImageType.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const Division_DropdownOptions = Division.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const Party_DropdownOptions = Party.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    const PriceList_DropdownOptions_In_MarginTab = PriceList.map((data) => ({
        value: data.id,
        label: data.Name
    }));
    function Common_Drop_Validation(event, type, key) {

        let OnchangeControl = document.getElementById(`drop${type}-${key}`)
        if (event.value === 0) {
            OnchangeControl.className = 'form-control is-invalid'
            return false
        } else {
            OnchangeControl.className = '';
            return true
        }

    }
    function Common_Text_INPUT_Validation(value, type, key) {

        let OnchangeControl = document.getElementById(`txt${type}${key}`)

        if (value === '') {
            OnchangeControl.className = 'form-control is-invalid'
            return false
        } else {
            OnchangeControl.className = 'form-control';
            return true
        }
    }
    function CommonTab_SimpleText_INPUT_handller_ForAll(event, type, key) {

        let validateReturn = Common_Text_INPUT_Validation(event, type, 0);

        if (validateReturn === false) {
            isValidate.push(`txt${type}0`)
            return
        } else {

            formValue[type] = event
            isValidate = isValidate.filter((indF) => {
                return !(indF === `txt${type}0`)
            })
            setIsValidate(isValidate)
        }

    }

    function CommonTab_DatePicker_handller_ForAll(event, type, key) {


        let OnchangeControl = document.getElementById(`txt${type}${key}`)

        if (event === '') {
            OnchangeControl.className = 'form-control is-invalid'
            return false
        } else {
            OnchangeControl.className = 'form-control';
            return true
        }

    }

    function Common_DropDown_handller_ForAll(event, type, key) {

        let returnVal = Common_Drop_Validation(event, type, key)
        if (returnVal === '') {

            isValidate.push(`drop${type}-${key}`)
            return
        } else {
            formValue[type] = event
            isValidate = isValidate.filter((indFind) => {
                return !(indFind === `drop${type}-${key}`)
            })
            setIsValidate(isValidate)
        }

        setrefresh(event)
    }

    function CategoryType_Dropdown_Handler(e, key) {

        CategoryTab_Common_onChange_Handller(e, "CategoryType", key,);
        dispatch(get_Category_By_CategoryType_ForDropDown(e.value, key))
    }

    function Category_Dropdown_Handler(e, key) {
        CategoryTab_Common_onChange_Handller(e, "Category", key,);
        dispatch(get_Sub_Category_By_CategoryType_ForDropDown(e.value, key))

    }

    function CategoryTab_AddRow_Handler() {

        let key = categoryTabTable.length - 1
        let cat_TableElement = categoryTabTable[key];
        let valid = true;

        let arr = ["CategoryType", "Category",];
        arr.map((label) => {
            var valid11 = Common_Drop_Validation(cat_TableElement[label], label, key,)
            if (!valid11) { valid = valid11 }
        })

        if (valid === false) {
            return
        }

        var newarr = [...categoryTabTable, {
            CategoryType: { value: 0, label: "select" },
            Category: { value: 0, label: "select" },
            SubCategory: { value: 0, label: "select" },
            Category_DropdownOptions: [],
            SubCategory_DropdownOptions: []
        }]
        setCategoryTabTable(newarr)
    }
    function CategoryTab_DeleteRow_Handler(key) {

        var removeElseArrray = categoryTabTable.filter((i, k) => {
            return !(k === key)
        })

        setCategoryTabTable(removeElseArrray)

    }
    function CategoryTab_Common_onChange_Handller(event, type, key) {

        const foundDublicate = categoryTabTable.find((element) => {
            return (element[type].value === event.value)
        });
        if (!(foundDublicate === undefined)) {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "Category alredy Select",
            }))
            return
        }


        let validateReturn = Common_Drop_Validation(event, type, key);
        if (validateReturn === false) return;


        var found = categoryTabTable.find((i, k) => {
            return (k === key)
        })

        let newSelectValue = ''

        if (type === "CategoryType") {
            newSelectValue = {
                CategoryType: event,
                Category: { label: 'select', value: 0 },
                SubCategory: { label: 'select', value: 0 },
                Category_DropdownOptions: [],
                SubCategoryOption: []
            }
        }
        else if (type === 'Category') {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: event,
                SubCategory: { label: 'select', value: 0 },
                Category_DropdownOptions: found.Category_DropdownOptions,
                SubCategory_DropdownOptions: []
            }
        }
        else {
            newSelectValue = {
                CategoryType: found.CategoryType,
                Category: found.Category,
                SubCategory: event,
                Category_DropdownOptions: found.Category_DropdownOptions,
                SubCategory_DropdownOptions: found.SubCategory_DropdownOptions
            }
        }

        let newTabArr = categoryTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setCategoryTabTable(newTabArr)
    }

    function UnitConversionsTab_AddRow_Handle() {

        let key = baseUnitTableData.length - 1
        let unit_TableElement = baseUnitTableData[key];

        let validateReturn = Common_Drop_Validation(unit_TableElement.Unit, "Unit", key);
        let validateReturn1 = Common_Text_INPUT_Validation(unit_TableElement.Conversion, "Conversion", key)
        if ((validateReturn1 === false) || (validateReturn === false)) return;

        var newarr = [...baseUnitTableData, {
            Conversion: '',
            Unit: '',
        }]
        setBaseUnitTableData(newarr)
    }
    function UnitConversionsTab_DeleteRow_Handler(key) {

        var removeElseArrray = baseUnitTableData.filter((i, k) => {
            return !(k === key)
        })

        setBaseUnitTableData(removeElseArrray)

    }
    function UnitConversionsTab_BaseUnit2_onChange_Handller(event, type, key,) {

        let newSelectValue = ''

        var found = baseUnitTableData.find((i, k) => {
            return (k === key)
        })

        if (type === "Conversion") {
            let validateReturn = Common_Text_INPUT_Validation(event, type, key);
            if (validateReturn === false) return;

            newSelectValue = {
                Conversion: event.target.value,
                Unit: found.Unit,
            }
        }
        else if (type === 'Unit') {
            // if(event.label===formValue.){ }
            const foundDublicate = baseUnitTableData.find((element) => {
                return (element[type].value === event.value)
            });
            if (!(foundDublicate === undefined)) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Unit already Select",
                }))
                return
            }
            let validateReturn = Common_Drop_Validation(event, type, key,)
            if (validateReturn === false) return;

            newSelectValue = {
                Conversion: found.Conversion,
                Unit: event,
            }
        }

        let newTabArr = baseUnitTableData.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setBaseUnitTableData(newTabArr)
        // setBaseUnit_dropdown_Select2(e)
    }

    function DivisionTab_AddRow_Handle() {

        const find = divisionTableData.find((element) => {
            return element.value === division_dropdown_Select.value
        });

        if (division_dropdown_Select.length <= 0) {

            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            document.getElementById("dropDivisionType-0").className = ""
            setDivisionTableData([...divisionTableData, division_dropdown_Select]);
        }
        else {
            document.getElementById("dropDivisionType-0").className = ""
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "DivisionType already Exists ",
            }));
        }
    }
    function DivisionTab_Dropdown_onChange_Handler(e) {

        setDivision_dropdown_Select(e)
    }
    function DivisionTab_DeleteRow_Handler(tableValue) {
        setDivisionTableData(divisionTableData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }

    function ImageTab_AddRow_Handler(key) {


        var newarr1 = [...imageTabTable, {
            ImageType: { value: 0, label: "select" },
            ImageUpload: {}
        }]
        setImageTabTable(newarr1)
    }
    function ImageTab_DeleteRow_Handler(key) {
        var removeElseArrray1 = imageTabTable.filter((i, k) => {
            return !(k === key)
        })
        setImageTabTable(removeElseArrray1)
    }
    function ImageTab_onChange_Handler(event, key, type) {

        var found = imageTabTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "ImageType") {
            const foundDublicate = imageTabTable.find((element) => {
                return (element[type].value === event.value)
            });
            if (!(foundDublicate === undefined)) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: "PriceList Already Select",
                }))
                return
            }
            newSelectValue = {
                ImageType: event,
                ImageUpload: found.ImageUpload,
            }
        }
        else if (type === 'ImageUpload') {
            newSelectValue = {
                ImageType: found.ImageType,
                ImageUpload: event.target.value,
            }
        }

        let newTabArr = imageTabTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setImageTabTable(newTabArr)
    }

    function GSTDetails_Tab_AddRow_Handler(key) {


        let validateReturn1 = CommonTab_DatePicker_handller_ForAll(GStDetailsMaster.EffectiveDate, "EffectiveDate", 0)
        let validateReturn2 = Common_Text_INPUT_Validation(GStDetailsMaster.GST, "GST", 0);
        let validateReturn3 = Common_Text_INPUT_Validation(GStDetailsMaster.HSNCode, "HSNCode", 0);

        if ((validateReturn1 === false)
            || (validateReturn2 === false)
            || (validateReturn3 === false)) return;

        var length = GStDetailsTabTable.length
        var newArr = {
            id: length,
            EffectiveDate: GStDetailsMaster.EffectiveDate,
            GST: GStDetailsMaster.GST,
            HSNCode: GStDetailsMaster.HSNCode
        }
        setGSTDetailsTabTable([...GStDetailsTabTable, newArr])

    }

    function MarginTab_AddRow_Handler(key) {

        let validateReturn = Common_Drop_Validation(marginMaster.PriceList, "PriceList", 0);
        let validateReturn1 = CommonTab_DatePicker_handller_ForAll(marginMaster.EffectiveDate, "EffectiveDate", 0)
        let validateReturn2 = Common_Drop_Validation(marginMaster.PartyName, "PartyName", 0)
        let validateReturn3 = Common_Text_INPUT_Validation(marginMaster.Margin, "Margin", 0)

        if ((validateReturn1 === false) || (validateReturn === false) || (validateReturn2 === false) || (validateReturn3 === false)) return;
        // if ((validateReturn === false) || (validateReturn2 === false) || (validateReturn3 === false)) return;

        var length = marginTabTable.length
        var newArr = {
            id: length,
            PriceList: { label: "select", value: 0 },
            EffectiveDate: marginMaster.EffectiveDate,
            PartyName: { label: "select", value: 0 },
            Margin: marginMaster.Margin,

        }
        setMarginTabTable([...GStDetailsTabTable, newArr])
    }
    function MarginTab_DeleteRow_Handler(key) {
        var removeElseArrray1 = marginTabTable.filter((i, k) => {
            return !(k === key)
        })
        setMarginTabTable(removeElseArrray1)
    }
    function MarginTab_onChange_Handler(event, type, key) {

        if (type === "PriceList") {
            marginMaster.EffectiveDate = event
        }
        else if (type === "EffectiveDate") {
            marginMaster.GST = event
        }
        else if (type === "PartyName") {
            marginMaster.HSNCode = event
        }
        else if (type === "Margin") {
            marginMaster.HSNCode = event
        }
    }

    function MRP_Tab_Tab_AddRow_Handler(key) {

        let rate_TableElement = MRP_Tab_TableData[key];

        let validateReturn1 = Common_Drop_Validation(rate_TableElement.Division, "Division", key)
        let validateReturn2 = CommonTab_DatePicker_handller_ForAll(rate_TableElement.EffectiveDate, "EffectiveDate", key);

        let validateReturn3 = Common_Drop_Validation(rate_TableElement.PartyName, "PartyName", key);
        let validateReturn4 = Common_Text_INPUT_Validation(rate_TableElement.MRP, "MRP", key);

        if (
            (validateReturn1 === false)
            || (validateReturn2 === false)
            || (validateReturn3 === false)
            || (validateReturn4 === false)) return;

        var newarr = [...MRP_Tab_TableData, {
            Division: { label: "select", value: 0 },
            EffectiveDate: '',
            PartyName: { label: "select", value: 0 },
            MRP: '',
        }]
        setMRP_Tab_TableData(newarr)
    }
    function MRP_Tab_Tab_DeleteRow_Handler(key) {

        var removeElseArrray = MRP_Tab_TableData.filter((i, k) => {
            return !(k === key)
        })

        setMRP_Tab_TableData(removeElseArrray)

    }
    function MRP_Tab__Common_onChange_Handller(event, type, key) {

        if (type === "PriceList") {
            marginMaster.EffectiveDate = event
        }
        else if (type === "EffectiveDate") {
            marginMaster.GST = event
        }
        else if (type === "PartyName") {
            marginMaster.HSNCode = event
        }
        else if (type === "Margin") {
            marginMaster.HSNCode = event
        }
    }

    function GSTDetails_onChange_Handller(event, type, key) {


        if (type === "EffectiveDate") {
            GStDetailsMaster.EffectiveDate = event
        }
        else if (type === "GST") {
            GStDetailsMaster.GST = event
        }
        else if (type === "HSNCode") {
            GStDetailsMaster.HSNCode = event
        }
    }

    function GSTDetails_Tab_AddRow_Handler(key) {


        let validateReturn1 = CommonTab_DatePicker_handller_ForAll(GStDetailsMaster.EffectiveDate, "EffectiveDate", 0)
        let validateReturn2 = Common_Text_INPUT_Validation(GStDetailsMaster.GST, "GST", 0);
        let validateReturn3 = Common_Text_INPUT_Validation(GStDetailsMaster.HSNCode, "HSNCode", 0);

        if ((validateReturn1 === false)
            || (validateReturn2 === false)
            || (validateReturn3 === false)) return;

        var length = GStDetailsTabTable.length
        var newArr = {
            id: length,
            EffectiveDate: GStDetailsMaster.EffectiveDate,
            GST: GStDetailsMaster.GST,
            HSNCode: GStDetailsMaster.HSNCode
        }
        setGSTDetailsTabTable([...GStDetailsTabTable, newArr])

    }

    function GSTDetails_Delete_Handller(event, v, k) {

        var filter = GStDetailsTabTable
        // .filter(i => {

        //    return !(i.id === event.id)
        // })
        // if (!(filter === undefined)) {
        //     setGSTDetailsTabTable(filter)
        // } else {
        //     setGSTDetailsTabTable([])
        // }
    }
    const handleValidSubmit = (event, values) => {

        const itemCategoryDetails = categoryTabTable.map((index) => ({
            CategoryType: index.CategoryType.value,
            Category: index.Category.value,
            SubCategory: index.SubCategory.value
        }))

        const itemUnitDetails = baseUnitTableData.map((index) => ({
            BaseUnitQuantity: index.Conversion,
            UnitID: index.Unit.value,
        }))

        const itemDivisionDetails = divisionTableData.map((index) => ({
            Division: index.value
        }))

        const iteMarginDetails = marginMaster.map((index) => ({
            PriceList: index.priceListid,
            EffectiveDate: index.effectiveDate,
            Party: index.partyid,
            Margin: index.margin,
            CreatedBy: 1,
            UpdatedBy: 1,
            Company: 1,
        }))

        const itemMRPDetails = MRP_Tab_TableData.map((index) => ({
            Division: index.Divisionid,
            EffectiveDate: index.effectiveDate,
            Party: index.partyid,
            MRP: index.MRP,
            CreatedBy: 1,
            UpdatedBy: 1,
            Company: 1,
        }))

        const ItemGSTHSNDetails = GStDetailsMaster.map((index) => ({
            EffectiveDate: index.effectiveDate,
            GSTPercentage: index.GST,
            HSNCode: index.HSNCode,
            CreatedBy: 1,
            UpdatedBy: 1,
        }))

        let submitValid1 = true;
        let submitValid2 = true
        let submitValid3 = true
        let submitValid4 = true;
        let submitValid5 = true
        let submitValid6 = true
        let submitValid7 = true

        // isValidate.map((ind) => {
        //     document.getElementById(ind).className = "form-control is-invalid"
        // })

        // categoryTabTable.map((ind, key) => {

        //     let return1 = Common_Drop_Validation(ind.CategoryType, "CategoryType", key);
        //     if (return1 === false) submitValid2 = return1;

        //     let return2 = Common_Drop_Validation(ind.Category, "Category", key);
        //     if (return2 === false) submitValid2 = return2;

        //     // let return3 = Common_Drop_Validation(ind.SubCategory, "SubCategory", key);
        //     // if (return3 === false) submitValid2 = return3;
        // })

        // if (formValue.BaseUnit.value > 0) {
        //     baseUnitTableData.map((ind, key) => {
        //         let return1 = Common_Text_INPUT_Validation(ind.Conversion, "Conversion", key);
        //         if (return1 === false) submitValid3 = return1;

        //         let return2 = Common_Drop_Validation(ind.Unit, "Unit", key);
        //         if (return2 === false) submitValid3 = return2;

        //     })
        // }

        // MRP_Tab_TableData.map((ind, key) => {

        //     let return1 = Common_Drop_Validation(ind.MRPType, "MRPType", key);
        //     if (return1 === false) submitValid6 = return1;

        //     let return2 = Common_Text_INPUT_Validation(ind.MRP, "MRP", key);
        //     if (return2 === false) submitValid6 = return2;

        //     let return3 = Common_Text_INPUT_Validation(ind.GSTPercentage, "GSTPercentage", key);
        //     if (return3 === false) submitValid6 = return3;

        //     let return4 = Common_Text_INPUT_Validation(ind.HSNCode, "HSNCode", key);
        //     if (return4 === false) submitValid6 = return4;

        // })

        // marginTabTable.map((ind, key) => {

        //     let return1 = Common_Text_INPUT_Validation(ind.Margin, "Margin", key);
        //     if (return1 === false) submitValid7 = return1;

        //     let return2 = Common_Drop_Validation(ind.PriceList, "PriceList", key);
        //     if (return2 === false) submitValid7 = return2;
        // })

        // if (!(isValidate.length === 0)) {
        //     setactiveTab1('1');
        //     return
        // };

        // if (!submitValid2) {
        //     setactiveTab1('2');
        //     return
        // };
        // if (!submitValid3) {
        //     setactiveTab1('3');
        //     return
        // };
        // if ((divisionTableData.length < 1)) {
        //     setactiveTab1('5');
        //     document.getElementById("dropDivisionType-0").className = "form-control is-invalid"
        //     return
        // };

        // if (!submitValid6) {
        //     setactiveTab1('6');
        //     return
        // };

        // if (!submitValid7) {
        //     setactiveTab1('7');
        //     return
        // };

        const jsonBody = JSON.stringify({
            Name: formValue.Name,
            ShortName: formValue.ShortName,
            Sequence: formValue.Sequence,
            BarCode: formValue.BarCode,
            isActive: formValue.isActive,
            Company: formValue.Company.value,
            BaseUnitID: formValue.BaseUnit.value,
            CreatedBy: 1,
            UpdatedBy: 1,
            ItemCategoryDetails: itemCategoryDetails,
            ItemUnitDetails: itemUnitDetails,

            ItemImagesDetails: [
                {
                    ImageType: "1",
                    Item_pic: "sadsadasdas"
                }
            ],
            ItemDivisionDetails: itemDivisionDetails,
            ItemMRPDetails: MRP_Tab_TableData,
            ItemMarginDetails: marginMaster,
            ItemGSTHSNDetails: GStDetailsMaster,

        });
        debugger
        if (pageMode === 'edit') {
            dispatch(updateItemID(jsonBody, EditData.id));
            console.log("edit json", jsonBody)
        }

        else {
            dispatch(postItemData(jsonBody));
            console.log("post json", jsonBody)
        }

    };

    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>Item Master| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Container fluid>
                        <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v); }}>
                            {/* Render Breadcrumbs */}
                            <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                            <Row>

                                <Col lg={12}>
                                    <Card className="text-black" >
                                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                                        </CardHeader>
                                        <CardBody>
                                            <Nav tabs className="nav-tabs-custom nav-justified">
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-1"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "1",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("1")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Basic Info</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-2"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "2",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("2")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Category</span>

                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-3"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "3",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("3")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Unit Conversions</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-4"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "4",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("4")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Image</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-5"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "5",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("5")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Division</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-6"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "6",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("6")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">MRP</span>
                                                    </NavLink>
                                                </NavItem>


                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-7"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "7",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("7")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Margin</span>
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-8"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "8",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("8")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">GST Details</span>
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>

                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                    // className={classnames({
                                                    //     active: activeTab1 === "7",
                                                    // })}
                                                    // onClick={() => {
                                                    //     toggle1("7")
                                                    // }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        {/* <span className="d-none d-sm-block">Tab7</span> */}
                                                        {/* <Button type="submit"> save</Button> */}

                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                                <TabPane tabId="1">
                                                    <Col md={12}  >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                                <Row>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label >Name</Label>
                                                                        <Input type="text" id='txtName0'
                                                                            placeholder=" Please Enter Name "
                                                                            defaultValue={EditData.Name}
                                                                            autoComplete="off"
                                                                            // onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                                            onChange={(e) => {
                                                                                dispatch(BreadcrumbShow(e.target.value));
                                                                                CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Name")
                                                                            }}

                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label >ShortName</Label>
                                                                        <Input type="text"
                                                                            id='txtShortName0'
                                                                            className=""
                                                                            defaultValue={EditData.ShortName}
                                                                            placeholder=" Please Enter ShortName "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "ShortName") }}
                                                                        // onChange={(e) => { formValue.ShortName = e.target.value }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Company</Label>
                                                                        <Select
                                                                            id='dropCompany-0'
                                                                            value={formValue.Company}
                                                                            options={Company_DropdownOptions}
                                                                            onChange={(event) => Common_DropDown_handller_ForAll(event, "Company", 0)}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Base Unit</Label>
                                                                        <Select
                                                                            id='dropBaseUnit-0'
                                                                            value={formValue.BaseUnit}
                                                                            options={BaseUnit_DropdownOptions}
                                                                            onChange={(event) => Common_DropDown_handller_ForAll(event, "BaseUnit", 0)}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">BarCode</Label>
                                                                        <Input
                                                                            id='txtBarCode0'
                                                                            placeholder=" Please Enter BarCode "
                                                                            defaultValue={EditData.BarCode}
                                                                            autoComplete="off"
                                                                            // validate={{
                                                                            //     required: { value: true, errorMessage: 'Please Enter BarCode' },
                                                                            // }}
                                                                            // onChange={(e) => { formValue.BarCode = e.target.value }}
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "BarCode") }}
                                                                        />
                                                                    </FormGroup>

                                                                    <FormGroup className="mb-3 col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom01">Sequence</Label>
                                                                        <Input
                                                                            id='txtSequence0'
                                                                            defaultValue={EditData.Sequence}
                                                                            placeholder=" Please Enter Sequence "
                                                                            autoComplete="off"
                                                                            onChange={(e) => { CommonTab_SimpleText_INPUT_handller_ForAll(e.target.value, "Sequence") }}
                                                                        // onChange={(e) => { formValue.Sequence = e.target.value }}
                                                                        />

                                                                    </FormGroup>

                                                                    {/* <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Category Type</Label>
                                                                        <Select
                                                                            id='dropCompany-0'
                                                                            value={formValue.Company}
                                                                            options={CategoryType_DropdownOptions}
                                                                            onChange={(event) => CategoryType_Dropdown_Handler(event, "Company", 0)}
                                                                        />
                                                                    </FormGroup> */}

                                                                    {/* <FormGroup className=" col col-sm-4 " >
                                                                        <Label htmlFor="validationCustom21">Category</Label>
                                                                        <Select
                                                                            id='dropCompany-0'
                                                                            value={formValue.Company}
                                                                            options={CategoryType_DropdownOptions}
                                                                            onChange={(event) => Category_Dropdown_Handler(event, "Company", 0)}
                                                                        />
                                                                    </FormGroup> */}

                                                                    <FormGroup className="mb-2 col col-sm-5">
                                                                        <Row className="justify-content-md-left">
                                                                            <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Active </Label>
                                                                            <Col md={2} style={{ marginTop: '9px' }} >

                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                                                                        defaultChecked={formValue.isActive}
                                                                                        // defaultChecked={true}
                                                                                        onChange={(e) => { formValue.isActive = e.target.checked }}

                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>

                                                </TabPane>

                                                <TabPane tabId="2">
                                                    <Col md={12} >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                {categoryTabTable.map((index, key) => {
                                                                    return <Row className=" col col-sm-11" >
                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label htmlFor="validationCustom21">Category Type</Label>
                                                                            <Select
                                                                                id={`dropCategoryType-${key}`}
                                                                                value={categoryTabTable[key].CategoryType}

                                                                                options={CategoryType_DropdownOptions}
                                                                                onChange={(e) => {
                                                                                    CategoryType_Dropdown_Handler(e, key, "CategoryType")
                                                                                }}
                                                                            />
                                                                        </FormGroup>

                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label htmlFor="validationCustom21">Category</Label>
                                                                            <Select
                                                                                id={`dropCategory-${key}`}
                                                                                // styles={customStyles}
                                                                                value={categoryTabTable[key].Category}
                                                                                options={categoryTabTable[key].Category_DropdownOptions}

                                                                                onChange={(e) => {
                                                                                    Category_Dropdown_Handler(e, key, "Category")

                                                                                }}
                                                                            />
                                                                        </FormGroup>

                                                                        <Col md={1}>
                                                                            {(categoryTabTable.length === key + 1) ?
                                                                                <Row className=" mt-3">
                                                                                    <Col md={6} className=" mt-3">
                                                                                        {(categoryTabTable.length > 1)
                                                                                            ?
                                                                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                CategoryTab_DeleteRow_Handler(key)
                                                                                            }} >
                                                                                            </i>
                                                                                            : <Col md={6} ></Col>
                                                                                        }

                                                                                    </Col>

                                                                                    <Col md={6}>
                                                                                        <Button className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                                                                            type="button"
                                                                                            onClick={() => { CategoryTab_AddRow_Handler(key) }} >
                                                                                            <i className="dripicons-plus"></i>
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                                :
                                                                                <Row className="mt-3">
                                                                                    < i className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3" onClick={() => {
                                                                                        CategoryTab_DeleteRow_Handler(key)
                                                                                    }} >
                                                                                    </i>
                                                                                </Row>
                                                                            }

                                                                        </Col>
                                                                    </Row>
                                                                })}
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                   
                                                </TabPane>


                                                <TabPane tabId="3">
                                                    <Col md={12}>
                                                        <Row>
                                                            <Col md={12}  >
                                                                <Card className="text-black">
                                                                    <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                        <Row>
                                                                            <FormGroup className=" col col-sm-4 " >
                                                                                <Label >Base Unit</Label>
                                                                                <Select
                                                                                    id={`dropBaseUnit-0`}
                                                                                    value={formValue.BaseUnit}
                                                                                    options={BaseUnit_DropdownOptions}
                                                                                    onChange={(e) => Common_DropDown_handller_ForAll(e, "BaseUnit", 0)}
                                                                                />
                                                                            </FormGroup>
                                                                        </Row>

                                                                        {!(formValue.BaseUnit.value === 0)
                                                                            ? <Row className="mt-3">
                                                                                <Col md={8}><Table className="table table-bordered  ">
                                                                                    <Thead >
                                                                                        <tr>
                                                                                            <th className="col-sm-3">Unit Name</th>
                                                                                            <th className="col-sm-3 text-center">Conversion To Base Unit </th>
                                                                                            {/* <th> To Base Unit</th> */}
                                                                                            <th className="col-sm-2">Action</th>
                                                                                        </tr>
                                                                                    </Thead>
                                                                                    <Tbody  >
                                                                                        {baseUnitTableData.map((TableValue, key) => (
                                                                                            <tr >
                                                                                                <td>
                                                                                                    <Row>
                                                                                                        <Label className=" col-sm-2 col-form-label">1</Label>
                                                                                                        <Col md={7}>
                                                                                                            <Select
                                                                                                                id={`dropUnit-${key}`}
                                                                                                                placeholder="select unit"
                                                                                                                value={baseUnitTableData[key].Unit}
                                                                                                                options={BaseUnit_DropdownOptions2}
                                                                                                                onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Unit", key)}
                                                                                                            />
                                                                                                        </Col>
                                                                                                        < Label className=" col-sm-3 col-form-label">=</Label>
                                                                                                    </Row>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <Row>
                                                                                                        <Col>
                                                                                                            <Input
                                                                                                                type="text"
                                                                                                                id={`txtConversion${key}`}
                                                                                                                placeholder={"Select Ratio"}
                                                                                                                value={baseUnitTableData[key].Conversion}
                                                                                                                onChange={(e) => UnitConversionsTab_BaseUnit2_onChange_Handller(e, "Conversion", key,)}>

                                                                                                            </Input>
                                                                                                        </Col>
                                                                                                        <Label className=" col-sm-4 col-form-label"> {formValue.BaseUnit.label}</Label>
                                                                                                    </Row>
                                                                                                </td>
                                                                                                {/* <td>
                                                                                                <Label>1</Label>    {formValue.BaseUnit.label}
                                                                                            </td> */}
                                                                                                <td>
                                                                                                    {(baseUnitTableData.length === key + 1) ?
                                                                                                        <Row className="">
                                                                                                            <Col md={6} className=" mt-3">
                                                                                                                {(baseUnitTableData.length > 1) ? <>
                                                                                                                    < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                                        UnitConversionsTab_DeleteRow_Handler(key)
                                                                                                                    }} >
                                                                                                                    </i>
                                                                                                                </> : <Col md={6} ></Col>}

                                                                                                            </Col>

                                                                                                            <Col md={6} >
                                                                                                                <Button className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                                                                                                    type="button"
                                                                                                                    onClick={() => { UnitConversionsTab_AddRow_Handle(key) }} >
                                                                                                                    <i className="dripicons-plus"></i>
                                                                                                                </Button>
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                        :

                                                                                                        < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                            UnitConversionsTab_DeleteRow_Handler(key)
                                                                                                        }} >
                                                                                                        </i>
                                                                                                    }
                                                                                                </td>

                                                                                            </tr>
                                                                                        ))}
                                                                                    </Tbody>
                                                                                </Table>
                                                                                </Col>
                                                                            </Row>
                                                                            :
                                                                            <Row className="mt-3">
                                                                                <br></br>
                                                                                <Label className="text-danger">Please select BaseUnit</Label></Row>}
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </TabPane>

                                                <TabPane tabId="4">
                                                    <Col md={12} >
                                                        <Card className="text-black">
                                                            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                {imageTabTable.map((index, key) => {
                                                                    return <Row className=" col col-sm-11" >
                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label htmlFor="validationCustom21">Image Type</Label>
                                                                            <Select
                                                                                value={imageTabTable[key].ImageType}
                                                                                options={ImageType_DropdownOptions}
                                                                                onChange={(e) => { ImageTab_onChange_Handler(e, key, "ImageType") }}
                                                                            />
                                                                        </FormGroup>

                                                                        <FormGroup className="mb-3 col col-sm-4 " >
                                                                            <Label >Upload</Label>
                                                                            <Input type="file" className="form-control col col-sm-4 "
                                                                                value={imageTabTable.ImageUpload}
                                                                                // value={"C:\fakepath\cropper.jpg"}
                                                                                onChange={(e) => ImageTab_onChange_Handler(e, key, "ImageUpload")} />
                                                                        </FormGroup>

                                                                        {/* {(imageTabTable.length === key + 1) ?
                                                                            <Col className="col col-1 mt-3">
                                                                                <Button
                                                                                    className="btn btn-sm mt-3 mb-0 btn-light  btn-outline-primary  "
                                                                                    type="button"
                                                                                    onClick={() => { ImageTab_AddRow_Handler(key) }} >
                                                                                    <i className="dripicons-plus"></i></Button>
                                                                            </Col>
                                                                            : <Col className="col col-1 mt-3">
                                                                                <i
                                                                                    className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3"
                                                                                    onClick={() => {
                                                                                        ImageTab_DeleteRow_Handler(key);
                                                                                    }}
                                                                                ></i>

                                                                            </Col>} */}
                                                                        <Col md={1}>
                                                                            {(imageTabTable.length === key + 1) ?
                                                                                <Row className=" mt-3">
                                                                                    <Col md={6} className=" mt-3">
                                                                                        {(imageTabTable.length > 1)
                                                                                            ?
                                                                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                ImageTab_DeleteRow_Handler(key)
                                                                                            }} >
                                                                                            </i>
                                                                                            : <Col md={6} ></Col>
                                                                                        }

                                                                                    </Col>

                                                                                    <Col md={6}>
                                                                                        <Button className="btn btn-sm btn-light mt-3   align-items-sm-end"
                                                                                            type="button"
                                                                                            onClick={() => { ImageTab_AddRow_Handler(key) }} >
                                                                                            <i className="dripicons-plus"></i>
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                                :
                                                                                <Row className="mt-3">
                                                                                    < i className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3" onClick={() => {
                                                                                        ImageTab_DeleteRow_Handler(key)
                                                                                    }} >
                                                                                    </i>
                                                                                </Row>
                                                                            }

                                                                        </Col>
                                                                    </Row>
                                                                })}
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Row>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="5">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Card className="text-black">
                                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>

                                                                    <Row>
                                                                        <FormGroup className=" col col-sm-4 " >
                                                                            <Label htmlFor="validationCustom21">Division</Label>
                                                                            <Select
                                                                                id={"dropDivisionType-0"}
                                                                                value={division_dropdown_Select}
                                                                                options={Division_DropdownOptions}
                                                                                onChange={(e) => { DivisionTab_Dropdown_onChange_Handler(e) }}
                                                                            />
                                                                        </FormGroup>
                                                                        <Col sm={1} style={{ marginTop: '28px' }} >
                                                                            {" "}
                                                                            <Button
                                                                                type="button"
                                                                                className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                                                                onClick={() =>
                                                                                    DivisionTab_AddRow_Handle()
                                                                                }
                                                                            >
                                                                                <i className="dripicons-plus "></i>
                                                                            </Button>
                                                                        </Col>
                                                                        <Col sm={3} style={{ marginTop: '28px' }}>
                                                                            {divisionTableData.length > 0 ? (

                                                                                <div className="table-responsive">
                                                                                    <Table className="table table-bordered  text-center">
                                                                                        <Thead >
                                                                                            <tr>
                                                                                                <th>Division Type</th>

                                                                                                <th>Action</th>
                                                                                            </tr>
                                                                                        </Thead>
                                                                                        <Tbody  >
                                                                                            {divisionTableData.map((TableValue) => (
                                                                                                <tr >
                                                                                                    <td>
                                                                                                        {TableValue.label}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                            DivisionTab_DeleteRow_Handler(TableValue.value)
                                                                                                        }} >
                                                                                                        </i>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </Tbody>
                                                                                    </Table>
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                </>
                                                                            )}
                                                                        </Col>
                                                                    </Row>

                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="6">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <MRPTab tableData={MRP_Tab_TableData} func={setMRP_Tab_TableData} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="7">

                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <Margin_Tab tableData={marginMaster} func={setMarginMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>

                                                </TabPane>

                                                <TabPane tabId="8">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <GSTTab tableData={GStDetailsMaster} func={setGStDetailsMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                            <Row >
                                                <Col sm={2}>
                                                    <div className="">
                                                        {
                                                            pageMode === "edit" ?
                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                    <button
                                                                        type="submit"
                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
                                                                        className="btn btn-success w-md"
                                                                    >
                                                                        <i class="fas fa-edit me-2"></i>Update
                                                                    </button>
                                                                    :
                                                                    <></>
                                                                : (
                                                                    userPageAccessState.RoleAccess_IsSave ?
                                                                        <button
                                                                            type="submit"
                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                                                            className="btn btn-primary w-md"
                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                        </button>
                                                                        :
                                                                        <></>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                        </AvForm>
                    </Container>
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default ItemsMaster;




