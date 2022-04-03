import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { doc, query, collection, getDocs, where } from "firebase/firestore";
import { Modal, Button , Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import Classes from './singleClass';
function Dashboard() {
    const [listClass, setListClass] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [addNewClass, setAddNewClass] = useState(false);
    const [newClass, setNewClass] = useState({"name":"", "type": "", "description":""}) 
    const [showAddNewClass, setShowAddNewClass] = useState(false)
    
    const [user, loading, error] = useAuthState(auth);
    const [account, setAccount] = useState({
        "name":"",
        "role":"",
        "level":0,
        "tags":{}
    })
    const [classes, setClasses] = useState(false);
    const [name, setName] = useState("");
    const [survey, setSurvey] = useState(false);
    const [selected, setSelected] = useState("");
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
        account.role = event.target.value;
    };
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

    

    // const updateRole = async () =>{
    //     try {
    //         const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            
    //         await setDoc(collection(db,"users"),{role:account.role});
            
    //     } catch (err) {
    //         console.error(err);
    //         alert("An error occured while updating user data");
    //     }
    // }
    
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
                    <div>Role: {account.role == ""?<Button onClick={()=>setSurvey(true)}>Change Role</Button>:account.role}</div>
                    <button className="dashboard__btn" onClick={logout}>
                    Logout
                    </button>
                </div>
                <div className="right">
                    {/* <Button onClick={handleClick}>Sign up for classes</Button> */}
                    {listClass != null && listClass.map((singleClass, i) => (
                        <Classes key={singleClass._id}  classInfo ={singleClass} updateNewClass = {setAddNewClass} updateClass = {setNewClass} deleteSingleClass = {deleteSingleClass}/>
                    ))}
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
                        <h1></h1>
                        <Button onClick={() => setSurvey(false)}>save</Button>
                        
                </Modal.Body>
            </Modal>
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
}


export default Dashboard;