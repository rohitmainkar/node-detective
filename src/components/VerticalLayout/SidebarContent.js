
// import PropTypes from "prop-types";
// import React, { useEffect, useRef, useCallback } from "react";

// //Import Icons
// import FeatherIcon from "feather-icons-react";

// // //Import Scrollbar
// import SimpleBar from "simplebar-react";

// //Import images


// //i18n
// import { withTranslation } from "react-i18next";

// // MetisMenu
// import MetisMenu from "metismenujs";
// import { withRouter } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { roleAceessAction } from "../../store/actions";
// // import { useSelector } from "react-redux";
// import { loginCompanyID, loginUserDetails, loginEmployeeID, loginPartyID } from "../Common/CommonFunction";
// import * as urlRel from "../../routes/urlRalations";
// import { useDispatch, useSelector } from "react-redux";

// const SidebarContent = (props) => {
//   const dispatch = useDispatch();
//   const ref = useRef();

//   const {
//     RoleAccessData,
//     RoleAccessUpdateData,
//   } = useSelector((state) => ({
//     RoleAccessData: state.Login.roleAccessSidbarData,
//     RoleAccessUpdateData: state.Login.RoleAccessUpdateData,
//   }));

//   useEffect(() => {
//     if (RoleAccessUpdateData.length <= 0) {
//       let role = loginUserDetails()
//       if (role) {
//         let party = loginPartyID()
//         let employee = loginEmployeeID();
//         let company = loginCompanyID();
//         dispatch(roleAceessAction(party, employee, company))
//       };
//     }
//   }, [])





//   const activateParentDropdown = useCallback(item => {
//     item.classList.add("active");
//     const parent = item.parentElement;
//     const parent2El = parent.childNodes[1];
//     if (parent2El && parent2El.id !== "side-menu") {
//       parent2El.classList.add("mm-show");
//     }

//     if (parent) {
//       parent.classList.add("mm-active");
//       const parent2 = parent.parentElement;

//       if (parent2) {
//         parent2.classList.add("mm-show"); // ul tag

//         const parent3 = parent2.parentElement; // li tag

//         if (parent3) {
//           parent3.classList.add("mm-active"); // li
//           parent3.childNodes[0].classList.add("mm-active"); //a
//           const parent4 = parent3.parentElement; // ul
//           if (parent4) {
//             parent4.classList.add("mm-show"); // ul
//             const parent5 = parent4.parentElement;
//             if (parent5) {
//               parent5.classList.add("mm-show"); // li
//               parent5.childNodes[0].classList.add("mm-active"); // a tag

//             }
//           }
//         }
//       }
//       scrollElement(item);
//       return false;
//     }
//     scrollElement(item);
//     return false;
//   }, []);

//   // Use ComponentDidMount and ComponentDidUpdate method symultaniously








//   useEffect(() => {
//     // const pathName = props.location.pathname;
//     let pathName = props.location.pathname
//     let userAcc = RoleAccessUpdateData.find((inx) => {
//       const path = inx.ActualPagePath.toLowerCase()
//       return (`/${path}` === (pathName.toLowerCase()))
//     })
//     if (userAcc === undefined) { }
//     else if (!userAcc.RoleAccess_IsShowOnMenu) {
//       pathName = urlRel[`${userAcc.ActualPagePath}`]

//     }
//     const initMenu = () => {
//       new MetisMenu("#side-menu");
//       let matchingMenuItem = null;
//       const ul = document.getElementById("side-menu");
//       const items = ul.getElementsByTagName("a");
//       for (let i = 0; i < items.length; ++i) {
//         if (pathName === items[i].pathname) {
//           matchingMenuItem = items[i];
//           break;
//         }
//       }
//       if (matchingMenuItem) {
//         activateParentDropdown(matchingMenuItem);
//       }
//     };
//     initMenu();
//   }, [activateParentDropdown]);



//   useEffect(() => {
//     ref.current.recalculate();
//   });

//   function scrollElement(item) {
//     if (item) {
//       const currentPosition = item.offsetTop;
//       if (currentPosition > window.innerHeight) {
//         ref.current.getScrollElement().scrollTop = currentPosition - 300;
//       }
//     }
//   }
//   return (
//     <React.Fragment>
//       <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
//         <div id="sidebar-menu">
//           <ul className="metismenu list-unstyled" id="side-menu">
//             <li>
//               <Link to="/#" className="has-arrow">
//                 <FeatherIcon icon="home" />
//                 <span>{props.t("Menu")}</span>
//               </Link>
//               <ul className="sub-menu ">
//                 <li>
//                   <Link to="/Dashboard">{props.t("Dashboard")}</Link>
//                 </li>
//               </ul>
//             </li>
//             {RoleAccessData.map((item) => {
//               return (
//                 <li >
//                   <Link to="/#" className="has-arrow">
//                     <FeatherIcon icon={item.ModuleIcon} />
//                     <span>{props.t(item.ModuleName)}</span>
//                   </Link>
//                   <ul className="sub-menu ">
//                     {item.ModuleData.map((index, j) => {
//                       if (index.RoleAccess_IsShowOnMenu === true) {
//                         return (
//                           <li>
//                             <Link to={{ pathname: `/${index.ActualPagePath}` }}>{props.t(index.Name)}</Link>
//                           </li>
//                         )
//                       }
//                     })}
//                   </ul>
//                 </li>
//               )
//             })}
//           </ul>
//         </div>
//       </SimpleBar>
//     </React.Fragment>
//   );
// };

// SidebarContent.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withTranslation()(withRouter(SidebarContent));














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
import { roleAceessAction } from "../../store/actions";
// import { useSelector } from "react-redux";
import { loginCompanyID, loginUserDetails, loginEmployeeID, loginPartyID } from "../Common/CommonFunction";
import * as urlRel from "../../routes/urlRalations";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const SidebarContent = (props) => {
  const dispatch = useDispatch();
  const [id, setid] = useState();


  const ref = useRef();

  const {
    RoleAccessData,
    RoleAccessUpdateData,
  } = useSelector((state) => ({
    RoleAccessData: state.Login.roleAccessSidbarData,
    RoleAccessUpdateData: state.Login.RoleAccessUpdateData,
  }));

  useEffect(() => {
    if (RoleAccessUpdateData.length <= 0) {
      let role = loginUserDetails()
      if (role) {
        let party = loginPartyID()
        let employee = loginEmployeeID();
        let company = loginCompanyID();
        dispatch(roleAceessAction(party, employee, company))
      };
    }
  }, [])

  // RoleAccessUpdateData.splice(0, 0, {})
  // console.log(RoleAccessUpdateData)

  // RoleAccessUpdateData.push({});

  // useEffect(() => {

  //   var element = document.getElementById("id1");
  //   element.classList.add("mm-collapse");
  // },[RoleAccessUpdateData]);



  const activateParentDropdown = useCallback(item => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu ") {
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
  }, [RoleAccessUpdateData.length <= 0]);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously

  useEffect(() => {
    // const pathName = props.location.pathname;
    let pathName = props.location.pathname
    let userAcc = RoleAccessUpdateData.find((inx) => {
      const path = inx.ActualPagePath.toLowerCase()
      return (`/${path}` === (pathName.toLowerCase()))
    })
    if (userAcc === undefined) { }
    else if (!userAcc.RoleAccess_IsShowOnMenu) {
      pathName = urlRel[`${userAcc.ActualPagePath}`]
    }
    
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
  }, [activateParentDropdown, RoleAccessUpdateData.length <= 0]);


  // useEffect(() => {
  //   debugger
  //   let pathName = props.location.pathname
  //   var ul = document.getElementById("Menu");
  //   ul.classList.add("mm-collapse");
  //   if (pathName === "/Dashboard") {

  //     ul.classList.remove("mm-collapse");

  //   }

  // });


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
  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled " id="side-menu">
            {/* <li>
              <Link to="/#" className="has-arrow">
                <FeatherIcon icon="home" />
                <span>{ props.t("Menu")}</span>
              </Link>
              <ul className="sub-menu"  id="Menu">
                <li>
                  <Link to="/Dashboard">{props.t("Dashboard")}</Link>
                </li>
              </ul>
            </li> */}
            {RoleAccessData.map((item) => {

              return (
                <li >
                  <Link to="/#" className="has-arrow">
                    <FeatherIcon icon={item.ModuleIcon} />
                    <span>{props.t(item.ModuleName)}</span>
                  </Link>
                  {/* <ul className="sub-menu " > */}
                  <ul className="sub-menu">
                    {item.ModuleData.map((index, j) => {
                      if (index.RoleAccess_IsShowOnMenu === true) {
                        return (
                          <li>
                            <Link to={{ pathname: `/${index.ActualPagePath}` }}>{props.t(index.Name)}</Link>
                          </li>
                        )
                      }
                    })}
                  </ul>
                </li>
              )
            })}
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
