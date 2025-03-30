import React, {useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import '../Styles/Auth.css';
import {Link} from "react-router";
import {axiosInstance} from "../index";
const Register = () => {
    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
    })

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                `/Auth/Register/`, form)
            if(response.status === 200) {
                console.log("success");
                window.location.assign("/App");
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="RegisterForm-container">
            <h1>Register</h1>
            <form className="Form" onSubmit={(e) => handleSubmit(e)}>
                <div className="FormItem">
                    <label htmlFor="first_name">Name</label>
                    <input value={form.userName} onChange={(e) => setForm({...form, userName: e.target.value})}
                           type="text" name={"first_name"} id="first_name"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setForm({...form, email: e.target.value})}} value={form.email}
                           type="text" name={"email"} id="emaile"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setForm({...form, password: e.target.value})}} value={form.password}
                           type="password" name={"password"} id="password"/>
                </div>
                {/*<div className="FormItem">*/}
                {/*    <label htmlFor="Photo">Photo</label>*/}
                {/*    <input style={{padding: 0}} type="file" name={"Photo"} id="Photo"/>*/}
                {/*</div>*/}
                <div className="FormSubmitButton">
                    <button type="submit">Submit</button>
                </div>
                <Link to="/LogIn" className="Links">Log in</Link>
            </form>
        </div>
    );
};

export default Register;