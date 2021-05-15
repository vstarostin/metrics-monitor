import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Device from "./Device";

const Devices = () => {

    const [devices, setDevices] = useState([]);

    const onDelete = async (id) => {

        const response = await fetch(`http://localhost:8000/api/v1/devices/${id}`, {
            method: "DELETE"
        });

        if (response.status !== 200) {
            return
        }
        setDevices(devices.filter(device => id !== device.id))
    };
    
    const fetchDevices = async () => {

        const response = await fetch(`http://localhost:8000/api/v1/devices`);
        const data = await response.json();
        
        return data;
    };

    useEffect(() => {
        const getDevices = async () => {
            const devicesFromServer = await fetchDevices();
            setDevices(devicesFromServer);
        };

        getDevices()
    }, [])
    
    return (
        <Fragment>
            { devices.length > 0 ? (
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>TemperatureEnabled</th>
                        <th>NoisinessEnabled</th>
                        <th>HumidityEnabled</th>
                        <th>CreatedAt</th>
                        <th>UpdatedAt</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <Device devices={devices} onDelete={onDelete} />
            </table>
            ) : (
                <h5>{devices.msg}</h5>
            )}
            <Link to="/devices/add">Add Device</Link>
            
        </Fragment>
    )
    
};

export default Devices;