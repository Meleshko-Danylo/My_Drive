import React, {useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import '../Styles/Auth.css';
import {Link} from "react-router";
const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleSubmit = () => {
        // const {} = useQuery({
        //     queryKey: ["register", form],
        //     queryFn: async () => {
        //        
        //     }
        // })
    }

    return (
        <div className="RegisterForm-container">
            <h1>Register</h1>
            <form className="Form" onSubmit={(e) => e.preventDefault()}>
                <div className="FormItem">
                    <label htmlFor="first_name">Name</label>
                    <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                           type="text" name={"first_name"} id="first_name"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setForm({...form, email: e.target.value})}} value={form.email}
                           type="text" name={"email"} id="emaile"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => {setForm({...form, email: e.target.value})}} value={form.password}
                           type="text" name={"password"} id="password"/>
                </div>
                <div className="FormItem">
                    <label htmlFor="Photo">Photo</label>
                    <input style={{padding: 0}} type="file" name={"Photo"} id="Photo"/>
                </div>
                <div className="FormSubmitButton">
                    <button type="submit">Submit</button>
                </div>
                <Link to="/LogIn" className="Links">Log in</Link>
            </form>
        </div>
    );
};

export default Register;