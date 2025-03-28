import React, {useState} from 'react';
import axios from "axios";
import {Link} from "react-router";
import {axiosInstance} from "../index";

const LogIn = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            if(form.email.includes("@") && form.password.length >= 8){
                const response = await axiosInstance.post("/Auth/LogIn", form);
                if(response.status === 200){
                    window.location.assign("/App");
                }
            }
            else {
                console.error("Please enter a valid email address or password");
            }   
        }
        catch(err){
            console.log("Error", err)
        }
    }

    return (
        <div className="RegisterForm-container">
            <h1>Log in</h1>
            <form className="Form-LogIn" onSubmit={(e) => handleSubmit(e)}>
                <div className="FormItem">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setForm({...form, email: e.target.value})}} value={form.email} type="text" name={"email"} id="emaile"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setForm({...form, password: e.target.value})}} value={form.password} type="text" name={"password"} id="password"/>
                </div>
                <div className="FormSubmitButton">
                    <button type="submit">Submit</button>
                </div>
                <Link to="/Register" className="Links">Register</Link>
            </form>
        </div>
    );
};

export default LogIn;