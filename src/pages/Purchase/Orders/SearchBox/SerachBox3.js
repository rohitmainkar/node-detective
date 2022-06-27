import React, { useState } from 'react'
import { Link, Router } from 'react-router-dom'
import { Td, Thead, Tr } from 'react-super-responsive-table'
import { Col, Input, Label, Row } from 'reactstrap'

export default function SerachBox3() {

    const [list,setList]=useState([])

     function searchHandeler(e){
        let value = e.target.value

        if (value && value.trim().length > 0) {
            value = value.trim().toLowerCase()

            //returning only the results of setList if the value of the search is included in the person's name
            setList(people.filter(person => {
                return (person.Name.trim().toLowerCase()).includes(value)
            })

            )

        }
     }

    return (
        <div className="page-content">
            <body>
                <Row className="mb-4">
                    <Label className="col-sm-1 col-form-label">
                        search box
                    </Label>
                    <Col sm={4}>
                        <div className="mb-3">
                            <Input
                                name="seachBox3"
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                onChange={(e)=>searchHandeler(e)}
                            />

                        </div>
                    </Col>
                </Row>
                <Row>
                    <tbody>
                      {
                        list.map((index)=>{
                       return(
                     
                        <Tr>
                          <Td>
                          <Link to={`/${index.ActualPagePath}`}>{index.Icon}</Link>
                          </Td>
                          </Tr>
                          
                       )     
                        })
                      }
                    </tbody>
                </Row>
            </body>
        </div>
    )
}
const people = [
    {
        ID: 2,
        Name: "Module List name",
        DisplayIndex: 2,
        Icon: "Module List",
        ActualPagePath: "ModulesList"
    },
    {
        ID: 3,
        Name: "Modules Master name",
        DisplayIndex: 1,
        Icon: "Modules Master",
        ActualPagePath: "modulesMaster"
    },
    {
        ID: 4,
        Name: "Company Master name",
        DisplayIndex: 3,
        Icon: "Companys Master",
        ActualPagePath: "companyMaster"
    },
    {
        ID: 5,
        Name: "Company List name",
        DisplayIndex: 3,
        Icon: "CompanyList",
        ActualPagePath: "companyList"
    },
    {
        ID: 6,
        Name: "Pages Master name",
        DisplayIndex: 5,
        Icon: "pagesMaster",
        ActualPagePath: "pagesMaster"
    },
    {
        ID: 7,
        Name: "Pages List name",
        DisplayIndex: 3,
        Icon: "Pages List",
        ActualPagePath: "PagesList"
    },
    {
        ID: 8,
        Name: "Users List name",
        DisplayIndex: 8,
        Icon: "Users List",
        ActualPagePath: "usersList"
    },
    {
        ID: 9,
        Name: "Users Master",
        DisplayIndex: 7,
        Icon: "Users Master",
        ActualPagePath: "usersMaster"
    }
]