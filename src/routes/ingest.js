const fastify = require('fastify')({
  logger: true,
});
const Reading = require('../schema/Reading');

// /ingest
const ingestSchema = {
  body: {
    type: 'object',
    properties: {
      deviceID: { type: 'string' },
      deviceType: { type: 'string' },
      dataKeys: { type: 'array' },
      data: { type: 'object' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
         ok: { type: 'boolean' },
      },
    },
  },
};

const ingestHandler = async (req, res) => {
  const { deviceID, deviceType, data, dataKeys } = req.body;
  // trim values of noisy decimal points
  dataKeys.map(k => data[k] = Math.floor(data[k] * 10) / 10);
  // log device metadata
  fastify.log.info({
    msg: 'ingest',
    deviceID,
    deviceType,
  });
  // save to database
  const reading = new Reading({deviceID, deviceType, data, dataKeys });
  await reading.save();
  // tell the client that everything is ok
  const response = {
    ok: true,
  };
  return(res.code(200).send(response));
};

module.exports = { ingestSchema, ingestHandler};
