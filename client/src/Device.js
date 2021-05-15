import { Fragment } from "react";
import { Link } from "react-router-dom";

const Device = ({ devices, onDelete }) => {
    return (
        <Fragment>
            <tbody>
                {devices.map(device => {
                    return ( 
                        <tr key={device.id}>
                            <td>{device.id}</td>
                            <td><Link to={`/devices/${device.id}/metrics`}>{device.name}</Link></td>
                            <td>{device.temperature_enabled.toString()}</td>
                            <td>{device.noisiness_enabled.toString()}</td>
                            <td>{device.humidity_enabled.toString()}</td>
                            <td>{device.created_at}</td>
                            <td>{device.updated_at || "---"}</td>
                            <td>
                                <button 
                                    onClick={() => onDelete(device.id)}
                                    type="button" 
                                    style={{width: "100%", color: "#dd0000"}} 
                                    className="close">
                                    &times;
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Fragment>
    )
};

export default Device;