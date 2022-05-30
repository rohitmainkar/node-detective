import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

//Import images

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roleAceessAction } from "../../store/auth/login/actions";
// import { RoleAccessData } from "./APIDEMO";

const SidebarContent = (props) => {
  const ref = useRef();
  const pathName = props.location.pathname;
  const dispatch = useDispatch();

useEffect(()=>{
  dispatch(roleAceessAction())
  // console.log("test side bar use effect")
},[])


  const activateParentDropdown = useCallback(item => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously

  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  const { RoleAccessData,} = useSelector((state) => ({
    RoleAccessData:state.Login.RoleData, 
}));
  // return (
  //   <React.Fragment>
  //     <div style={{ marginLeft: "45px", marginTop: "10px" }}>
  //       <img src={"giftBox"} alt="" />
  //     </div>
  //     <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
  //       <div id="sidebar-menu">
  //         <ul className="metismenu list-unstyled" id="side-menu">
  //           <li className="menu-title">{props.t("Menu")} </li>

  //           {RoleAccessData.map((item) => {
  //             return (
  //               <li class={pathName === "/Modules" ? "active mm-active" : ""}>
  //                 <Link to="/#" className="has-arrow">
  //                   <span>{props.t(item.ModuleName)}</span>
  //                 </Link>
  //                 <ul className="sub-menu">
  //                   {item.ModuleData.map((i, j) => {
  //                     return (
  //                       <li>
  //                             <Link id={j} to={i.ActualPagePath}>{props.t(i.Name)}</Link>
  //                       </li>
  //                     )
  //                   })}
  //                 </ul>
  //               </li>
  //             )
  //           })}
  //         </ul>
  //       </div>
  //     </SimpleBar>
  //   </React.Fragment>
  // );
  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/dashboard" className="">
                <FeatherIcon icon="home" />
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <FeatherIcon icon="grid" />
                <span>{props.t("Apps")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/modules">{props.t("Modules")}</Link>
                </li>
                <li>
                  <Link to="/modulesList">{props.t("Modules List")}</Link>
                </li>
                <li>
                  <Link to="/company">{props.t("Company")}</Link>
                </li>
                <li>
                  <Link to="/companyList">{props.t("CompanyList")}</Link>
                </li>
                <li>
                  <Link to="/SubModules">{props.t("SubModules")}</Link>
                </li>
                <li>
                  <Link to="/SubModulesList">{props.t("SubModulesList")}</Link>
                </li>
                 <li>
                  <Link to="/Hpage">{props.t("Hpage")}</Link>
                </li>
                <li>
                  <Link to="/HpageList">{props.t("Hpage List")}</Link>
                </li>

                <li>
                  <Link to="/orders">{props.t("Orders")}</Link>
                </li>
                <li>
                  <Link to="/AddUser">{props.t("AddUser")}</Link>
                </li>

                <li>
                  <Link to="/UserList">{props.t("UserList")}</Link>
                </li>

                <li>
                  <Link to="/AddEmployee">{props.t("AddEmployee")}</Link>
                </li>

                <li>
                  <Link to="/Employee_List">{props.t("Employee_List")}</Link>
                </li>

                <li>
                  <Link to="/RoleMaster">{props.t("Role Master")}</Link>
                </li>

                <li>
                  <Link to="/RoleList">{props.t("RoleList")}</Link>
                </li>
              </ul>
            </li>      
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation()(withRouter(SidebarContent));
