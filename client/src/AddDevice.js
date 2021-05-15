import { Fragment, useState } from "react";
import { Link } from "react-router-dom";


const AddDevice = () => {

    const [name, setName] = useState("");
    const [temperature_enabled, setTemperatureEnabled] = useState(false);
    const [humidity_enabled, setHumidityEnabled] = useState(false);
    const [noisiness_enabled, setNoisinessEnabled] = useState(false);

    const device = {
        name,
        temperature_enabled,
        humidity_enabled,
        noisiness_enabled
    };

    const AddDevice = async (device) => {
        
        if (device.name === "") return

        const response = await fetch("http://localhost:8000/api/v1/devices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(device)
        });

        if (response.status !== 201) return;

        document.getElementById("created").style.display = "block";
        setTimeout(() => {
            document.getElementById("created").style.display = "none";
            window.location = "/devices"            
        }, 1000)
    };

    return (
        <Fragment>
            <form className="d-flex flex-wrap w-100 mb-5">
                <label className="w-100">Name</label>
                <input 
                    className="mb-3"
                    type="text" 
                    name="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                { name === "" ? (<p className="text-danger">Enter device name</p>) : "" }
                <p id="name" style={{display: "none", color: "red"}}>Enter device name</p>
                <label className="d-block w-100" >TemperatureEnabled</label>
                <p className="mx-3"><input 
                    className="enabled"
                    type="radio" 
                    name="temperatureEnabled" 
                    value="false"
                    onClick={(e) => setTemperatureEnabled(e.target.value === "true" ? true : false)}
                    defaultChecked
                />False</p>
                <p className="mx-3"><input 
                    type="radio" 
                    name="temperatureEnabled" 
                    value="true"
                    onClick={(e) => setTemperatureEnabled(e.target.value === "true" ? true : false)}
                />True</p>
                <label className="w-100">HumidityEnabled</label>
                <p className="mx-3"><input 
                    className="enabled"
                    type="radio" 
                    name="humidityEnabled" 
                    value="false"
                    onClick={(e) => setHumidityEnabled(e.target.value === "true" ? true : false)}
                    defaultChecked
                />False</p>
                <p className="mx-3"><input 
                    type="radio" 
                    name="humidityEnabled" 
                    value="true" 
                    onClick={(e) => setHumidityEnabled(e.target.value === "true" ? true : false)}
                />True</p>
                <label className="w-100">NoisinessEnabled</label>
                <p className="mx-3"><input 
                    className="enabled"
                    type="radio" 
                    name="noisinessEnabled" 
                    value="false"
                    onClick={(e) => setNoisinessEnabled(e.target.value === "true" ? true : false)}
                    defaultChecked
                />False</p>
                <p className="mx-3"><input 
                    type="radio" 
                    name="noisinessEnabled" 
                    value="true" 
                    onClick={(e) => setNoisinessEnabled(e.target.value === "true" ? true : false)}
                />True</p>
                <div className="w-100">
                    <input 
                        type="button" 
                        className="btn btn-primary" 
                        name="add-button" 
                        onClick={() => AddDevice(device)} 
                        value="Add" 
                    />
                </div>
            </form> 
            <p id="created" style={{color: "green", display: "none"}}>Successfully created!</p>
            <Link to="/devices">Devices</Link>
        </Fragment>
    )
};

export default AddDevice;