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
    const devices = await pool.query(
        "SELECT DISTINCT ON (id) devices.id, name, time, temp_enabled, humidity_enabled, noisiness_enabled FROM devices LEFT JOIN metrics ON devices.id=metrics.device_id ORDER BY id, time DESC"
    );
    devices.rows.length > 0 ? res.json(devices.rows) : res.json({"msg": "do not have any device yet, please create"})
};

const createDevice = async (req, res) => {
    const deviceRequiredProps = ["temp_enabled", "noisiness_enabled", "humidity_enabled"];
    let reqBody = req.body;
    deviceRequiredProps.forEach(prop => {
        if (!Object.keys(reqBody).includes(prop)) {
            reqBody[prop] = true
        }
    });
    let { name, temp_enabled, noisiness_enabled, humidity_enabled } = reqBody;
    const newDevice = await pool.query(
        "INSERT INTO devices (name, temp_enabled, noisiness_enabled, humidity_enabled) VALUES($1, $2, $3, $4) RETURNING *", [
            name, temp_enabled, noisiness_enabled, humidity_enabled
        ]
    );
    res.status(201).json(newDevice.rows)
};

const getMetricsByDeviceId = async (req, res) => {
    const { id } = req.params;
    const device = await pool.query(
        "SELECT id FROM devices WHERE id=$1", [
            id
        ]
    );
    if (device.rows.length > 0) {
        const metrics = await pool.query(
            "SELECT temp, noisiness, humidity, time FROM metrics WHERE device_id=$1", [
                id
            ]
        );  
        metrics.rows.length > 0 ? res.json(metrics.rows) : res.json({"msg": "device has not metrics"});
    } else {
        res.json({"msg": `device with id=${id} does not exist`});
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
            "SELECT temp_enabled, noisiness_enabled, humidity_enabled FROM devices WHERE id = $1", [
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
        let {temp, humidity, noisiness} = reqBody;
        const newMetrics = await pool.query(
            "INSERT INTO metrics (device_id, temp, humidity, noisiness) VALUES ($1, $2, $3, $4) RETURNING *", [
                id, temp, humidity, noisiness
            ]
        )
        res.json(newMetrics.rows) 
    } else {
        res.json({"msg": `device with id=${id} does not exist`})
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