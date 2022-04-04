import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from "react";
import {Button, Card, ListGroupItem, ListGroup } from 'react-bootstrap'

import React from 'react'
import "./singleClass.css"

const Classes = ({classInfo, updateNewClass, updateClass, deleteSingleClass, role, changeCurrentPts, classSignUp}) => {
    
    return (
        <div className='container'>

                
                <Card style={{ width: '18rem'}} onClick={() => updateCurrentClass()} >
                    
                    <Card.Body>
                        <Card.Title>{ classInfo !== undefined && classInfo.name}</Card.Title>
                        <Card.Text>
                            { classInfo !== undefined && classInfo.description}  
                        </Card.Text>
                    </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>Dates: {classInfo !== undefined && classInfo.date}</ListGroupItem>
                            <ListGroupItem>Points: { classInfo !== undefined && classInfo.points}</ListGroupItem>

                        </ListGroup>
                        <>
                            {role === "Mod"?<Button onClick={() => deleteSingleClass(classInfo._id)}>delete event</Button>:<></>}
                        </>
                        
                </Card>
            
            
        </div>


        
    )
    function updateCurrentClass(){
        changeCurrentPts(classInfo.points);

        
        updateClass({
            "name": classInfo.name,  
            "type": classInfo.type, 
            "description": classInfo.description, 
        }
        );
        updateNewClass(true);
        if(role!== "Mod"){
            classSignUp(true);
        }
        
        
        
    }


}

export default Classes