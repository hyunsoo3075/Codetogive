import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Modal, Button , Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import Classes from './singleClass';

import Confetti from 'react-confetti'
function Dashboard() {
    const [listClass, setListClass] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [addNewClass, setAddNewClass] = useState(false);
    const [newClass, setNewClass] = useState({"name":"", "type": "", "description":"", "points":"", "dates":""});
    const [signUp, setSignup] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [account, setAccount] = useState({
        "name":"",
        "role":"",
        "level":0,
        "experience": 0,
        "tags":{}
    })
    const [classSignUp, setClassSignUp] = useState(false);
    const [name, setName] = useState("");
    const [survey, setSurvey] = useState(false);
    const [selected, setSelected] = useState("");
    const [points, setPoints] = useState(0);
    const [confetti, setConfetti] = useState(false);
    const navigate = useNavigate();
    
    const challenges = [
        "Select...",
        "Addiction",
        "Homeless",
        "Health",
        "Violence",
        "Eviction",
        "Relational Poverty",
        "Job Loss",
      ];


    const volunteer = [
        "Select...",
        "Dining/food Service",
        "Childcare",
        "Spiritual Services",
        "Vocational",
        "Staff Support",
        "Campus Beautification",
        "Thrift",
        "Social Activities",
        "Special Events",
        "Help From Home",
    ]

    const changeSelectOptionHandler = (event) => {
        setSelected(event.target.value);
        
        
    };

    
    const handleClick = () =>{
        setClassSignUp(false);
        
        let curr = parseInt(account.experience) + parseInt(points);
        account.experience = curr;

        
        if(account.experience >= 100){
            setAccount(prev =>({
                ...prev,
                "level": parseInt(prev.level) + 1,
                "experience":account.experience%100
            }))
            setConfetti(true);
            alert("congrats you leveled up");
        }
    }
    let type = null;

    let options = null;
    if(selected === "Client"){
        type = challenges;
    }
    else if(selected === "Volunteer"){
        type = volunteer;
    }
    if(type){
        options = type.map((el)=><option key = {el}>{el}</option>);
    }

    
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
    //   console.log(doc.docs[0].data());
            // setRole(data.role);
            account.name = data.name;
            account.role = data.role;
            account.level = data.level;
            setName(data.name);
            
            // setLevel(data.level);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    if(refreshData){
        setRefreshData(false);
        getAllClasses();
        
    }
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");

        fetchUserName();
        getAllClasses();
        
    }, [user, loading]);
    
    return (
        <div className="dashboard">
            
            <div className="dashboard__container">
                
                <div className="left">
                    Logged in as
                    <div>{name}</div>
                    <div>{user?.email}</div>
                    <div>current Level: {account.level}</div>
                    <div>Current level progress: {account.experience} / 100</div>
                    <div>Role: {selected === ""?<Button onClick={()=>setSurvey(true)}>Change Role</Button>:selected}</div>
                    <button className="dashboard__btn" onClick={logout}>
                    Logout
                    </button>
                </div>
                <div className="right">
                    <h1>
                        {selected === "Mod"?<Button onClick={() => setSignup(true)}>add event</Button>:<></>}
                    </h1>
                    
                    <div className="grid">
                        {listClass != null && listClass.map((singleClass, i) => (
                            <Classes key={singleClass._id}  classInfo ={singleClass} updateNewClass = {setAddNewClass} 
                            updateClass = {setNewClass} deleteSingleClass = {deleteSingleClass} role = {selected} changeCurrentPts = {setPoints} classSignUp = {setClassSignUp}/>
                        ))}
                    </div>
                </div>
        
         
            </div>
            
            <Modal show = {survey} onHide={()=> setSurvey(false)}>
                <Modal.Body>
                        <Form.Group>
                            <Form.Label>What is your role?</Form.Label>
                            <Form.Select size="md" onChange={changeSelectOptionHandler}>
                                <option>Select..</option>
                                <option>Mod</option>
                                <option>Volunteer</option>
                                <option>Client</option>
                            </Form.Select>
                            <Form.Label></Form.Label>
                            <Form.Select>
                                {options}
                            </Form.Select>
                            
                            
                            
                        </Form.Group>
                        
                        <Button onClick={() => setSurvey(false)}>save</Button>
                        
                </Modal.Body>
            </Modal>
            <Modal show = {signUp && selected === "Mod"} onHide = {() => setSignup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> Add Event </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                    
                        <Form.Label>name </Form.Label>
                        <Form.Control onChange={(event) => {newClass.name = event.target.value}}/>
                        <Form.Label>description </Form.Label>
                        <Form.Control onChange={(event) => {newClass.description = event.target.value}}/>
                        <Form.Label>dates</Form.Label>
                        <Form.Control onChange={(event) => {newClass.dates = event.target.value}}/>
                        <Form.Label>points</Form.Label>
                        <Form.Control onChange={(event) => {newClass.points = event.target.value}}/>
                        <Form.Label>type</Form.Label>
                        <Form.Control onChange={(event) => {newClass.type = event.target.value}}/>
                        
                        
                        
                        
                            
                            
                            
                            
                    </Form.Group>
                    <Button onClick={() => addClassItem()}>Add</Button>
                    <Button onClick={() => setSignup(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
            <Modal show = {classSignUp} onHide={()=> setClassSignUp(false)}>
                <Modal.Body>
                        <Form.Group>
                            
                            
                            
                        </Form.Group>
                        <h1></h1>
                        <Button onClick={() => handleClick()}>sign up</Button>
                        
                </Modal.Body>
            </Modal>
            <Confetti 
                run = {confetti}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </div>
    );

    function getAllClasses(){
        var url = "http://localhost:4000/class"
        axios.get(url, {
            responseType: 'json'
        }).then(response => {
            if(response.status === 200){
                setListClass(response.data)
            }
        })
    }

    function deleteSingleClass(id){
        var url = "http://localhost:4000/class/delete/" + id
        axios.delete(url, {

        }).then(response => {
            if(response.status === 200){
                setRefreshData(true)
            }
        })
    }
    function addClassItem(){
        setSignup(false)
        var url = "http://localhost:4000/class/create";
        if(newClass.points === "" || newClass.name === ""||newClass.type === "" || newClass.dates === "" || newClass.description === ""){
            alert("All of the fields must be filled")
        }
        else{
            axios.post(url,{
                "name": newClass.name, 
                "description":newClass.description, 
                "date":newClass.dates, 
                "points": newClass.points,
                "type": newClass.type
            }).then(response => {
                if(response.status === 200){
                    setRefreshData(true)
                }
            })
        }
        
    }
}


export default Dashboard;