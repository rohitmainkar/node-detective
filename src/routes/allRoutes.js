import React from "react"
import { Redirect } from "react-router-dom"

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//Import  Administrator : Modules and ModulesList
import Modules from "../pages/Adminisrator/ModulesPages/Modules";
import ModulesList from "../pages/Adminisrator/ModulesPages/ModulesList";
import CompanyModule from "../pages/Adminisrator/CompanyPages/CompanyModule";
import CompanyList from "../pages/Adminisrator/CompanyPages/CompanyList";
import SubModules from "../pages/Adminisrator/SubModulePages/SubModules";
import SubModulesList from "../pages/Adminisrator/SubModulePages/SubModulesList";
import HPageList from "../pages/Adminisrator/HPagesPages/HPageList";
import HPageMaster from "../pages/Adminisrator/HPagesPages/HPageMaster";
import OrderPage from "../pages/Order/OrderPage";
import OrderList from "../pages/Order/OrderList"
import AddUser from "../pages/Adminisrator/UserRegistrationPages/UserRegistration";
import UserList from "../pages/Adminisrator/UserRegistrationPages/UserList";
import AddEmployee from "../pages/Adminisrator/EmployeePages/EmployeeMaster";
import Employee_List from "../pages/Adminisrator/EmployeePages/EmployeeList";
import RoleMaster from "../pages/Adminisrator/RoleMasterPages/RoleMaster";
import RoleList from "../pages/Adminisrator/RoleMasterPages/RoleList"
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";
import ItemsList from "../pages/Adminisrator/ItemPages/ItemList";
import ItemsMaster from "../pages/Adminisrator/ItemPages/ItemMaster";
import SearchBox from "../pages/Adminisrator/SearchBox/SearchBox";
import SearchBoxSecond from "../pages/Adminisrator/SearchBox/SearchBoxSecond";
import SerachBox3 from "../pages/Adminisrator/SearchBox/SerachBox3";
import PartyList from "../pages/Adminisrator/PartyPages/PartyList";
import PartyMaster from "../pages/Adminisrator/PartyPages/PartyMaster";
import DemoUI3 from "../pages/Adminisrator/PartyPages/DemoUI3";
import DemoUI2 from "../pages/Adminisrator/PartyPages/DemoUI2";
import PartyUIDemo from "../pages/Adminisrator/PartyPages/PartyUIDemo";
import RoleAccessList from "../pages/Adminisrator/RoleAccessPages/RoleAccessList";
import ResetPassword from "../pages/Authentication/ResetPassword";
import SendOTP from "../pages/Authentication/SendOTP";
import EnterOTP from "../pages/Authentication/EnterOTP";


// import AddItemMaster from "../pages/Adminisrator/MasterPages/AddItemMaster";

const userRoutes = [

  //dashboard
  { path: "/dashboard", component: Dashboard },

  // Administrator : Modules Path and List
  { path: "/moduleMaster", component: Modules },
  { path: "/moduleList", component: ModulesList },

  { path: "/subModuleMaster", component: SubModules },
  { path: "/subModuleList", component: SubModulesList },

  // Administrator : Company Path and List
  { path: "/companyMaster", component: CompanyModule },
  { path: "/companyList", component: CompanyList },

  { path: "/pageList", component: HPageList },
  { path: "/pageMaster", component: HPageMaster },

  { path: "/order", component: OrderPage },
  { path: "/orders", component: OrderList },

  { path: "/userMaster", component: AddUser },
  { path: "/userList", component: UserList },

  { path: "/employeesMaster", component: AddEmployee },
  { path: "/employeesList", component: Employee_List },

  { path: "/roleMaster", component: RoleMaster },
  { path: "/roleList", component: RoleList },

  { path: "/itemMaster", component: ItemsMaster },
  { path: "/itemList", component: ItemsList },

  { path: "/partyList", component: PartyList },
  { path: "/partyMaster", component: PartyMaster },

  { path: "/roleAccess", component: RoleAccessList },


  { path:"/partyUIDemo",component:PartyUIDemo},
  { path:"/demoUi3",component:DemoUI3},
  { path:"/demoUi2",component:DemoUI2},


  // { path: "/AddItemMaster", component: AddItemMaster },
  { path: "/SearchBox2", component: SearchBoxSecond },
  { path: "/SearchBox3", component: SerachBox3 },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

]

const authRoutes = [
  //authencation page
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  {path:"/ResetPassword",component:ResetPassword},
  { path:"/SendOTP",component:SendOTP},
  {path:"/EnterOTP",component:EnterOTP},

  { path: "/pages-404", component: Error404 },
  { path: "/pages-500", component: Error500 },
]

export { userRoutes, authRoutes }
