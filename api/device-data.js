// api/device-data.js

const RPCClient = require('@alicloud/pop-core').RPCClient;

const client = new RPCClient({
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  endpoint: 'https://iot.cn-shanghai.aliyuncs.com',
  apiVersion: '2018-01-20',
});

const identifiers = ['Temp', 'Humi', 'Humi1', 'Light'];

export default async function handler(req, res) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 3600 * 1000;

  try {
    const results = await Promise.all(
      identifiers.map(async (identifier) => {
        const result = await client.request('QueryDevicePropertyData', {
          RegionId: 'cn-shanghai',
          ProductKey: 'a19RhtMd0lj',
          DeviceName: 'OFWpW9JPzMI0PEP6b31t',
          Identifier: identifier,
          StartTime: oneDayAgo,
          EndTime: now,
          Asc: 0,
          PageSize: 5,
        });

        return {
          identifier,
          data: result?.PropertyDataInfo?.List || [],
        };
      })
    );

    res.status(200).json({
      code: 0,
      msg: 'success',
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: 'error',
      error: err.toString(),
    });
  }
}
