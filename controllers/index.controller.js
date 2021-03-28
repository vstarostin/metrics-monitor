const pool = require("../db/db.js");

const serverCheck = (req, res) => res.status(204).end();

const deleteDeviceById = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            "DELETE FROM devices WHERE id=$1", [
                id
            ]
        )
    } catch (error) {
        res.status(500).json({"msg": "internal error"})
    }
    res.json({"msg": "device successfully deleted"}) 
};

const deleteMetricByDeviceId = async (req, res) =>{
    const { id } = req.params;    
    await pool.query(
        "DELETE FROM metrics WHERE device_id=$1", [
            id
        ]
    ) 
    res.json({"msg": "metric successfully deleted"});
};

const getDevices = async (req, res) => {
    let devices = await pool.query(
        "SELECT DISTINCT ON (id) devices.id, name, created_at, metrics.time AS updated_at, temperature_enabled, humidity_enabled, noisiness_enabled FROM devices LEFT JOIN metrics ON devices.id=metrics.device_id ORDER BY id, time DESC"
    );
    devices = devices.rows.map( device => {
        let devKeys = Object.keys(device);
        devKeys.map(i => {
            if (device[i] == null) {
                devKeys = devKeys.filter(j => j != i);
            }
        })
        device = devKeys.reduce((acc, cur) => {
            acc[cur] = device[cur];
            return acc;
        }, {});
        return device;
    })
    devices.length > 0 ? res.status(200).json(devices) : res.status(404).json({"msg": "do not have any device yet, please create"})
};

const createDevice = async (req, res) => {
    const deviceRequiredProps = ["temperature_enabled", "noisiness_enabled", "humidity_enabled"];
    let reqBody = req.body;
    deviceRequiredProps.forEach(prop => {
        if (!Object.keys(reqBody).includes(prop)) {
            reqBody[prop] = true
        }
    });
    let { name, temperature_enabled, noisiness_enabled, humidity_enabled } = reqBody;
    const newDevice = await pool.query(
        "INSERT INTO devices (name, temperature_enabled, noisiness_enabled, humidity_enabled) VALUES($1, $2, $3, $4) RETURNING *", [
            name, temperature_enabled, noisiness_enabled, humidity_enabled
        ]
    );
    res.status(201).json(newDevice.rows[0])
};

const getMetricsByDeviceId = async (req, res) => {
    const { id } = req.params;
    const device = await pool.query(
        "SELECT id FROM devices WHERE id=$1", [
            id
        ]
    );
    if (device.rows.length > 0) {
        let metrics = await pool.query(
            "SELECT temperature, noisiness, humidity, time FROM metrics WHERE device_id=$1", [
                id
            ]
        );
        metrics = metrics.rows.map(metric => {
            let metricKeys = Object.keys(metric);
            metricKeys.forEach(i => {
                if (metric[i] == null) {
                    metricKeys = metricKeys.filter(j => j != i);
                }
            })
            metric = metricKeys.reduce((acc, cur) => {
                acc[cur] = metric[cur];
                return acc; 
            }, {})
            return metric;
        });
        Object.keys(metrics).length > 0 ? res.status(200).json(metrics) : res.status(404).json({"msg": "device has not metrics"});
    } else {
        res.status(400).json({"msg": `device with id=${id} does not exist`});
    }
};

const createMetricsByDeviceId = async (req, res) => {
    const { id } = req.params;
    let reqBody = req.body;
    const device = await pool.query(
        "SELECT id FROM devices WHERE id=$1", [
            id
        ]
    );
    if (device.rows.length > 0) {
        let deviceParams = await pool.query(
            "SELECT temperature_enabled, noisiness_enabled, humidity_enabled FROM devices WHERE id = $1", [
                id
            ]
        );
        let deviceParamsArr = Object.entries(deviceParams.rows[0]);
        let reqBodyArr = Object.entries(reqBody);
        deviceParamsArr.forEach(devParam => {
            reqBodyArr.forEach(reqParam => {
            if (devParam[1] == false && devParam[0].includes(reqParam[0])) {
                reqBodyArr = reqBodyArr.filter(i => i != reqParam)        
            }
            })    
        });
        reqBody = reqBodyArr.reduce((acc, cur) => {
            acc[cur[0]] = cur[1]
            return acc
        }, {});
        let {temperature, humidity, noisiness} = reqBody;
        let newMetrics = await pool.query(
            "INSERT INTO metrics (device_id, temperature, humidity, noisiness) VALUES ($1, $2, $3, $4) RETURNING *", [
                id, temperature, humidity, noisiness
            ]
        );
        newMetricsKeys = Object.keys(newMetrics.rows[0]);
        newMetricsKeys.map(i => {
            if (newMetrics.rows[0][i] == null) {
                newMetricsKeys = newMetricsKeys.filter(j => j != i)
            }
        })
        newMetrics = newMetricsKeys.reduce((acc, cur) => {
            acc[cur] = newMetrics.rows[0][cur];
            return acc;
        }, {})
        res.status(201).json(newMetrics) 
    } else {
        res.status(400).json({"msg": `device with id=${id} does not exist`})
    }   
};

module.exports = {
    serverCheck,
    deleteDeviceById,
    deleteMetricByDeviceId,
    getDevices,
    createDevice,
    getMetricsByDeviceId,
    createMetricsByDeviceId
};