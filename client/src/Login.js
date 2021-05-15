import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    
    return (
        <Fragment>
            <h1>Login</h1>
            {/* <% if (messages.error) {%> */}
            {/* <%= messages.error %> */}
            {/* <% } %> */}
            <form>
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
                <button type="submit" style={{display: 'block'}}>Login</button>
            </form>
            <Link to="/register">Register</Link>
        </Fragment>
    )
}

export default Login;