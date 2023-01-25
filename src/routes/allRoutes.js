import React from "react"
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//Import  Administrator : Modules and ModulesListItem
import Modules from "../pages/Adminisrator/ModulesPages/Modules";
import ModulesList from "../pages/Adminisrator/ModulesPages/ModulesList";
import CompanyModule from "../pages/Adminisrator/CompanyPages/CompanyModule";
import CompanyList from "../pages/Adminisrator/CompanyPages/CompanyList";

import PageList from "../pages/Adminisrator/Page-Pages/PageList";
import PageMaster from "../pages/Adminisrator/Page-Pages/PageMaster";

import AddUser from "../pages/Adminisrator/UserRegistrationPages/UserRegistration";
import UserList from "../pages/Adminisrator/UserRegistrationPages/UserList";
import AddEmployee from "../pages/Adminisrator/EmployeePages/EmployeeMaster";
import Employee_List from "../pages/Adminisrator/EmployeePages/EmployeeList";
import RoleMaster from "../pages/Adminisrator/RoleMasterPages/RoleMaster";
import RoleList from "../pages/Adminisrator/RoleMasterPages/RoleList"
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";
import ItemsList from "../pages/Adminisrator/ItemPages/ItemList";
import ItemsMaster from "../pages/Adminisrator/ItemPages/ItemMaster/itemIndex"

import SearchBoxSecond from "../pages/Adminisrator/SearchBox/SearchBoxSecond";
import SerachBox3 from "../pages/Adminisrator/SearchBox/SerachBox3";
import PartyList from "../pages/Adminisrator/PartyPages/PartyList";
import PartyMaster from "../pages/Adminisrator/PartyPages/PartyMaster";

import ResetPassword from "../pages/Authentication/ResetPassword";
import SendOTP from "../pages/Authentication/SendOTP";
import EnterOTP from "../pages/Authentication/EnterOTP";
import RoleAccessListPage from "../pages/Adminisrator/RoleAccessPages/RoleAccessListPage";
import EmployeeTypesMaster from "../pages/Adminisrator/EmployeeTypes/EmployeeTypesMaster";
import RoleAccessAdd from "../pages/Adminisrator/RoleAccessPages/RoleAccessAdd";
import EmployeeTypeList from "../pages/Adminisrator/EmployeeTypes/EmployeeTypeList";
import PartyType from "../pages/Adminisrator/PartyTypes/PartyType";
import PartyTypeList from "../pages/Adminisrator/PartyTypes/PartyTypeList";
import SelectDivisionPage from "../pages/Authentication/SelectDivisionPage";
import RoleAccessCopyFunctionality from "../pages/Adminisrator/RoleAccessPages/RoleAccessCopyFunctionality";
import CategoryTypeMaster from "../pages/Adminisrator/CategoryTypePages/CategoryTypeMaster";
import CategoryTypeList from "../pages/Adminisrator/CategoryTypePages/CategoryTypeList";
import CategoryList from "../pages/Adminisrator/CategoryPages/CategoryList";
import CategoryMaster from "../pages/Adminisrator/CategoryPages/CategoryMaster";
import VehicleMaster from "../pages/Adminisrator/VehiclePages/VehicleMaster";
import VehicleList from "../pages/Adminisrator/VehiclePages/VehicleList";
import DriverMaster from "../pages/Adminisrator/DriverPage/DriverMaster";
import DriverList from "../pages/Adminisrator/DriverPage/DriverList";
import CompanyGroupMaster from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupMaster";
import CompanyGroupList from "../pages/Adminisrator/CompanyGroupPages/CompanyGroupList";

import PriceMaster from "../pages/Adminisrator/PriceList/PriceMaster";
import PriceList from "../pages/Adminisrator/PriceList/PriceList";

import MRPMaster from "../pages/Adminisrator/MRPMaster/MRPMaster";
import MarginMaster from "../pages/Adminisrator/MarginMaster/MarginMaster";

import MRPList from "../pages/Adminisrator/MRPMaster/MRPList";
import MarginList from "../pages/Adminisrator/MarginMaster/MarginList";

import GroupMaster from "../pages/Adminisrator/GroupPage/GroupMaster"
import GroupList from "../pages/Adminisrator/GroupPage/GroupList";
import GroupTypeList from "../pages/Adminisrator/GroupTypePage/GroupTypeList";

import GroupTypeMaster from "../pages/Adminisrator/GroupTypePage/GroupTypeMaster";
import PartySubParty from "../pages/Adminisrator/PartySubPartyPages/PartySubParty";
import PartySubPartyList from "../pages/Adminisrator/PartySubPartyPages/partysubPartyList";

import GSTMaster from "../pages/Adminisrator/GSTPages/GSTMaster";
import GSTList from "../pages/Adminisrator/GSTPages/GSTList";

import TermsAndConditionsMaster from "../pages/Adminisrator/TermsAndConditions/TermsAndConditionsMaster";
import TermsAndConditionsList from "../pages/Adminisrator/TermsAndConditions/TermsAndConditionsList";

import Order from "../pages/Purchase/Order/Order"
import OrderList from "../pages/Purchase/Order/OrderList"

import PartyItems from "../pages/Adminisrator/PartyItemPage/PartyItems";

import GeneralMaster from "../pages/Adminisrator/GeneralPage/GeneralMaster";
import GeneralList from "../pages/Adminisrator/GeneralPage/GeneralList";

import * as path from "./route_url";
import GRNList from "../pages/Purchase/GRN/GRNList";
import GRNAdd from "../pages/Purchase/GRN/GRNAdd";
import SubGroupMaster from "../pages/Adminisrator/SubGroupPages/SubGroupMaster";
import SubGroupList from "../pages/Adminisrator/SubGroupPages/SubGroupList";
import PartyItemsList from "../pages/Adminisrator/PartyItemPage/PartyItemList";
import BOMMaster from "../pages/Purchase/BOM/BOMMaster/BOMIndex";
import BOMList from "../pages/Purchase/BOM/BOMList/BOMList";
import WorkOrder from "../pages/Purchase/WorkOrder/WorkOrder";
import WorkOrderList from "../pages/Purchase/WorkOrder/WorkOrderList";
import MaterialIssueMaster from "../pages/Purchase/Material_Issue/Material_IssueMaster";
import MaterialIssueList from "../pages/Purchase/Material_Issue/Material_Issue_List";

import ProductionMaster from "../pages/Purchase/Production/ProductionMaster";
import ProductionList from "../pages/Purchase/Production/ProductionList";

import SaleOrder from "../pages/Purchase/SaleOrder/SaleOrder"
import SaleOrderList from "../pages/Purchase/SaleOrder/SaleOrderList"

import Invoice from "../pages/Sale/Invoice/Invoice";
import InvoiceList from "../pages/Sale/Invoice/InvoiceList";

import Demand from "../pages/Inter Branch/Demand/Demand";
import DemandList from "../pages/Inter Branch/Demand/DemandList"

import Inward from "../pages/Inter Branch/Inward/Inward";
import InwardList from "../pages/Inter Branch/Inward/InwardList";
import ChallanList from "../pages/Inter Branch/Challan/ChallanList";
import Challan from "../pages/Inter Branch/Challan/Challan";

const userRoutes = [

  // *************************** Administration *******************************//
  { path: path.MODULE, component: Modules },
  { path: path.MODULE_lIST, component: ModulesList },

  { path: path.COMPANY, component: CompanyModule },
  { path: path.COMPANY_lIST, component: CompanyList },

  { path: path.PAGE_lIST, component: PageList },
  { path: path.PAGE, component: PageMaster },

  { path: path.USER, component: AddUser },
  { path: path.USER_lIST, component: UserList },

  { path: path.ROLEACCESS, component: RoleAccessAdd },
  { path: path.ROLEACCESS_lIST, component: RoleAccessListPage },
  { path: path.COPY_ROLEACCESS, component: RoleAccessCopyFunctionality },

  { path: path.ROLE, component: RoleMaster },
  { path: path.ROLE_lIST, component: RoleList },

  // ******************************* Master Module ******************************//

  { path: path.EMPLOYEE, component: AddEmployee },
  { path: path.EMPLOYEE_lIST, component: Employee_List },

  { path: path.ITEM, component: ItemsMaster },
  { path: path.ITEM_lIST, component: ItemsList },

  { path: path.PARTY_lIST, component: PartyList },
  { path: path.PARTY, component: PartyMaster },

  { path: path.EMPLOYEETYPE, component: EmployeeTypesMaster },
  { path: path.EMPLOYEETYPE_lIST, component: EmployeeTypeList },

  { path: path.PARTYTYPE, component: PartyType },
  { path: path.PARTYTYPE_lIST, component: PartyTypeList },

  { path: path.CATEGORYTYPE, component: CategoryTypeMaster },
  { path: path.CATEGORYTYPE_lIST, component: CategoryTypeList },

  { path: path.CATEGORY, component: CategoryMaster },
  { path: path.CATEGORY_lIST, component: CategoryList },

  { path: path.VEHICLE, component: VehicleMaster },
  { path: path.VEHICLE_lIST, component: VehicleList },

  { path: path.DRIVER, component: DriverMaster },
  { path: path.DRIVER_lIST, component: DriverList },

  { path: path.COMPANYGROUP, component: CompanyGroupMaster },
  { path: path.COMPANYGROUP_lIST, component: CompanyGroupList },

  { path: path.GROUPTYPE, component: GroupTypeMaster },
  { path: path.GROUPTYPE_lIST, component: GroupTypeList },

  { path: path.PARTY_SUB_PARTY, component: PartySubParty },
  { path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },

  { path: path.TERMS_AND_CONDITION, component: TermsAndConditionsMaster },
  { path: path.TERMS_AND_CONDITION_LIST, component: TermsAndConditionsList },

  { path: path.PRICE_lIST, component: PriceList },
  { path: path.PRICE, component: PriceMaster },

  { path: path.MRP, component: MRPMaster },
  { path: path.MRP_lIST, component: MRPList },

  { path: path.MARGIN, component: MarginMaster },
  { path: path.MARGIN_lIST, component: MarginList },

  { path: path.GROUP, component: GroupMaster },
  { path: path.GROUP_lIST, component: GroupList },

  { path: path.GST, component: GSTMaster },
  { path: path.GST_LIST, component: GSTList },

  { path: path.PARTY_SUB_PARTY, component: PartySubParty },
  { path: path.PARTY_SUB_PARTY_lIST, component: PartySubPartyList },


  { path: path.PARTYITEM, component: PartyItems },
  { path: path.PARTYITEM_LIST, component: PartyItemsList },

  { path: path.SUBGROUP, component: SubGroupMaster },
  { path: path.SUBGROUP_LIST, component: SubGroupList },

  { path: path.GENERAL, component: GeneralMaster },
  { path: path.GENERAL_LIST, component: GeneralList },

  //******************************* Purchase Module ************************************//

  { path: path.ORDER, component: Order },
  { path: path.ORDER_lIST, component: OrderList },

  { path: path.GRN_lIST, component: GRNList },
  { path: path.GRN_ADD, component: GRNAdd },
  { path: path.GRN_ADD_Mode_2, component: OrderList },

  { path: path.BIllOf_MATERIALS, component: BOMMaster },
  { path: path.BIllOf_MATERIALS_LIST, component: BOMList },

  { path: path.WORK_ORDER, component: WorkOrder },
  { path: path.WORK_ORDER_LIST, component: WorkOrderList },

  { path: path.MATERIAL_ISSUE, component: MaterialIssueMaster },
  { path: path.MATERIAL_ISSUE_LIST, component: MaterialIssueList },
  { path: path.MATERIAL_ISSUE_ADD_Mode_2, component: WorkOrderList },

  { path: path.PRODUCTION_MASTER, component: ProductionMaster },
  { path: path.PRODUCTION_LIST, component: ProductionList },
  { path: path.PRODUCTION_ADD_Mode_2, component: MaterialIssueList },

  { path: path.SALE_ORDER, component: SaleOrder },
  { path: path.SALE_ORDER_lIST, component: SaleOrderList },

  { path: path.INVOICE, component: Invoice },
  { path: path.INVOICE_LIST, component: InvoiceList },

  //************************************** Inter Branch ********************************//
  { path: path.DEMAND, component: Demand },
  { path: path.DEMAND_LIST, component: DemandList },

  { path: path.INWARD, component: Inward },
  { path: path.INWARD_LIST, component: InwardList },

  { path: path.CHALLAN_LIST, component: ChallanList },
  { path: path.CHALLAN, component: Challan },

  // ************************************ Utility **************************************//
  { path: path.SEARCH_BOX2, component: SearchBoxSecond },
  { path: path.SEARCH_BOX3, component: SerachBox3 },

  { path: "/dashboard", component: Dashboard },

  { path: "/", exact: true, component: () => <Redirect to="/Dashboard" /> },
  { path: "/auth-404", component: Error404 },
  { path: "/auth-500", component: Error500 },

]

const authRoutes = [
  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/ResetPassword", component: ResetPassword },
  { path: "/SendOTP", component: SendOTP },
  { path: "/EnterOTP", component: EnterOTP },
  { path: "/division", component: SelectDivisionPage },
  { path: "/pages-404", component: Error404 },

  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
