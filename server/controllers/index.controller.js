const { request } = require("express");
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
        res.status(200).json({"msg": "device successfully deleted"})
    } catch (error) {
        res.status(500).json({"msg": "internal error"})
    }   
};

const deleteMetricByDeviceId = async (req, res) =>{
    const { id } = req.params;
        await pool.query(
            "DELETE FROM metrics WHERE device_id=$1", [
                id
            ]
        ) 
        res.status(200).json({"msg": "metric successfully deleted"});   
     
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
    devices.length > 0 ? res.status(200).json(devices) : res.status(404).json({"msg": "do not have any device yet"})
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
    const device_id = req.params.id;

    let order_by = req.query.order_by;
    let sort_col = order_by.split('_')[0];
    let sort_dir = order_by.split('_')[1] || "ASC";
    let limit = req.query.limit || null;
    let offset = req.query.offset || null;


    console.log(sort_col, sort_dir, limit, offset);

    if (await isDeviceExists(device_id)) {
        let metrics = await pool.query(`SELECT id, temperature, noisiness, humidity, time 
                                        FROM metrics WHERE device_id = ${device_id} 
                                        ORDER BY ${sort_col} ${sort_dir} LIMIT ${limit} OFFSET ${offset}`);
        console.log(metrics.rows);
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
        res.status(404).json({"msg": `device with id=${device_id} does not exist`});
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

    if (await isDeviceExists(id)) {
        let deviceParams = await pool.query(
            "SELECT temperature_enabled, noisiness_enabled, humidity_enabled FROM devices WHERE id = $1", [
                id
            ]
        );
        let deviceParamsArr = Object.entries(deviceParams.rows[0]);
        let reqBodyArr = Object.entries(reqBody);
        deviceParamsArr.forEach(devParam => {
            reqBodyArr.forEach(reqParam => {
                console.log(reqParam[0])
                if (!(reqParam[0] == "temperature" || reqParam[0] == "humidity" || reqParam[0] == "noisiness")) {
        
                    res.status(404).json({"msg": "incorrect data"});
                }
                if (devParam[1] == false && devParam[0].includes(reqParam[0])) {
                // reqBodyArr = reqBodyArr.filter(i => i != reqParam)
                res.status(404).json({"msg": "incorrect data"});        
            }
            
            })    
        });
        reqBody = reqBodyArr.reduce((acc, cur) => {
            acc[cur[0]] = cur[1]
            return acc
        }, {});
        let {temperature, humidity, noisiness} = reqBody;
        console.log(temperature, humidity, noisiness)
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

async function isDeviceExists(id) {
    const device = await pool.query(
        "SELECT id FROM devices WHERE id=$1", [
            id
        ]
    );

    if (device.rowCount > 0) return true; 
    return false;
}


module.exports = {
    serverCheck,
    deleteDeviceById,
    deleteMetricByDeviceId,
    getDevices,
    createDevice,
    getMetricsByDeviceId,
    createMetricsByDeviceId
};