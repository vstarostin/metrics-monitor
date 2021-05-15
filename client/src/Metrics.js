import { Fragment, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Metric from "./Metric";

const Metrics = (props) => {

    const deviceId = props.match.params.id;
    const [metrics, setMetrics] = useState([]);

    const fetchMetrics = async (id) => {
        const response = await fetch(`http://localhost:8000/api/v1/devices/${id}/metrics?order_by=id`);
        const data = await response.json();
        
        return data;
    };

    useEffect(() => {
        const getMetrics = async () => {
            const metricsFromServer = await fetchMetrics(deviceId);
            setMetrics(metricsFromServer);
        };

        getMetrics();

    }, [deviceId]);

    return (
        <Fragment>
            {metrics.length > 0 ? (
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Device ID</th>
                        <th>Temperature</th>
                        <th>Noisiness</th>
                        <th>Humidity</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <Metric metrics={metrics} deviceId={deviceId} />
            </table>) : <h5 className="mb-5">{metrics.msg}</h5>}
            <Link className="d-block" to={`/devices/${deviceId}/metrics/addMetrics`}>Add Metrics</Link>
            <Link to="/devices">Back to Devices</Link>
        </Fragment>
    )
};

export default Metrics;