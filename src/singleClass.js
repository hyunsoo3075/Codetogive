import 'bootstrap/dist/css/bootstrap.css';

import {Button, Card, ListGroupItem, ListGroup } from 'react-bootstrap'

import React from 'react'


const Classes = ({classInfo, updateNewClass, updateClass, deleteSingleClass}) => {
    
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
                            <ListGroupItem>location: {classInfo !== undefined && classInfo.zipcode}</ListGroupItem>
                            <ListGroupItem>Chef: { classInfo !== undefined && classInfo.chef}</ListGroupItem>
                            <ListGroupItem>{ classInfo !== undefined && classInfo.price}</ListGroupItem>
                        </ListGroup>
                        <Button onClick={() => deleteSingleClass(classInfo._id)}>delete item</Button>
                </Card>
            
            
        </div>


        
    )
    function updateCurrentClass(){
        
        
        updateClass({
            "name": classInfo.name,  
            "type": classInfo.type, 
            "description": classInfo.description, 
        }
        );
        updateNewClass(true);
        
        
    }


}

export default Classes