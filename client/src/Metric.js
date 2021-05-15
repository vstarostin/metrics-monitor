import { Fragment } from "react";

const Metric = ({ metrics, deviceId}) => {
    return (
        <Fragment>
            <tbody>
                {metrics.map(metric => {
                    return (
                    <tr key={metric.id}>
                        <td>{metric.id}</td>
                        <td>{deviceId}</td>
                        <td>{metric.temperature || "---"}</td>
                        <td>{metric.noisiness || "---"}</td>
                        <td>{metric.humidity || "---"}</td>
                        <td>{metric.time}</td>
                    </tr>
                    )
                 })}
            </tbody>
        </Fragment>
    )
};

export default Metric;