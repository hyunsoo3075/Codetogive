import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { doc, query, collection, getDocs, where, setDoc } from "firebase/firestore";
import { Modal, Button , Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [account, setAccount] = useState({
        "name":"",
        "role":"",
        "level":0,
        "tags":{}
    })
    const [name, setName] = useState("");
    const [survey, setSurvey] = useState(false);

    const navigate = useNavigate();
    
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
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);

    const handleChange = e=>{

    }
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
                    
                </div>
        
         
            </div>
            <Modal show = {survey} onHide={()=> setSurvey(false)}>
                <Modal.Body>
                        <Form.Group>
                            {/* forms, name and zipcode to check if user's zipcode matches with the chef's */}
                            <Form.Label>Your role </Form.Label>
                            <Form.Control onChange={(event) => {account.role = event.target.value}}/>
                            
                            
                        </Form.Group>
                        <Button onClick={()=>setAccount(prevState => ({
                            ...prevState,
                            "role":account.role
                        }))}>save</Button>
                        
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default Dashboard;