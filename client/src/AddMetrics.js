import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AddMetrics = (props) => {

    const device_id = props.match.params.id;
    const [ device, setDevice ] = useState("");
    const [ temperature, setTemperature ] = useState(""); 
    const [ noisiness, setNoisiness ] = useState("");
    const [ humidity, setHumidity ] = useState("");

    const newMetrics = {
        device_id,
        temperature: temperature || null,
        noisiness: noisiness || null,
        humidity: humidity || null
    }

    const fetchDevice = async (id) => {
        const response = await fetch(`http://localhost:8000/api/v1/devices/${id}`);
        const data = await response.json();

        return data;
    }; 

    useEffect(() => {
        const getDevice = async () => {
            const deviceFromServer = await fetchDevice(device_id);
            setDevice(deviceFromServer);
        };

        getDevice();

    }, [device_id])

    const addMetrics = async (id) =>{

        if (newMetrics.temperature == null && newMetrics.humidity == null && newMetrics.noisiness == null) return

        const response = await fetch(`http://localhost:8000/api/v1/devices/${id}/metrics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMetrics)
        });

        if (response.status !== 201) return
        
        document.getElementById("success").style.display = "block";
        
        setTimeout(() => window.location = `/devices/${id}/metrics/`, 1000)
        
    };
    
    return (
        <Fragment>
            <form className="d-flex flex-wrap w-100 mb-5">
                <label className="w-100">Temperature</label>
                {device !== undefined && device.temperature_enabled === false ?
                (<input 
                    className="border border-dark"
                    style={{backgroundColor: "#ddd"}}
                    type="text" 
                    name="temperature" 
                    value="enabled"
                    readOnly={true}
                />) : (
                    <>
                    <input 
                    className="border border-dark"
                    style={{backgroundColor: "#fff"}}
                    type="text" 
                    name="temperature" 
                    value={temperature} 
                    readOnly={false}
                    onChange={e => setTemperature(e.target.value)}
                    />
                    { temperature === "" ? 
                        (<p className="text-danger mb-0">Enter Value</p>) : ""   
                    }
                    </>
                )}
                <label className="w-100">Noisiness</label>
                {device !== undefined && device.noisiness_enabled === false ?
                (<input 
                    className="border border-dark"
                    style={{backgroundColor: "#ddd"}}
                    type="text" 
                    name="noisiness" 
                    value="enabled"
                    readOnly={true}
                />) : (
                    <>
                    <input 
                    className="border border-dark"
                    style={{backgroundColor: "#fff"}}
                    type="text" 
                    name="noisiness" 
                    value={noisiness} 
                    readOnly={false}
                    onChange={e => setNoisiness(e.target.value)}
                    />
                    { noisiness === "" ? 
                        (<p className="text-danger mb-0">Enter Value</p>) : ""
                    }
                    </>
                )}
                <label className="w-100">Humidity</label>
                {device !== undefined && device.humidity_enabled === false ?
                (<input 
                    className="border border-dark mb-4"
                    style={{backgroundColor: "#ddd"}}
                    type="text" 
                    name="humidity" 
                    value="enabled"
                    readOnly={true}
                />) : (
                    <>
                    <input 
                    className="border border-dark mb-4"
                    style={{backgroundColor: "#fff"}}
                    type="text" 
                    name="humidity" 
                    value={humidity} 
                    readOnly={false}
                    onChange={e => setHumidity(e.target.value)}
                    />
                    { humidity === "" ? 
                        (<p className="text-danger mb-0">Enter Value</p>) : ""
                    }
                    </>
                )}
                
               
                
                    <div className="d-block w-100">
                        <input
                            id="btn" 
                            type="button" 
                            value="Add" 
                            className="btn btn-primary" 
                            onClick={() => addMetrics(device_id)}
                        />
                    </div>
            
            </form>
            <p id="success" style={{color: "green", display: "none"}}>Successfully created!</p>
            <Link to={`/devices/${device_id}/metrics`}>Back to Metrics</Link>   
        </Fragment>
    )
};

export default AddMetrics;