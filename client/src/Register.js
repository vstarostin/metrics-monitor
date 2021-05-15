import { Fragment, useState } from 'react';
import { Link } from "react-router-dom";

const Register = () => {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <Fragment>
            <h1>Register</h1>
            <form>
                <label htmlFor="name" style={{display: 'block'}}>Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}    
                    required 
                />
                <label htmlFor="email" style={{display: 'block'}}>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <label htmlFor="password" style={{display: 'block'}}>Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <button type="submit" style={{display: 'block'}}>Register</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    )
}  

export default Register;