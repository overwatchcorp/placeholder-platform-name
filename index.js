require('dotenv').config();
const fastify = require('fastify')({
  logger: true,
});
const mongoose = require('mongoose');

// MONGODB SETUP
mongoose.connect(process.env.MONGODB_URI);
// Mongo Reading Schema
const Reading = mongoose.model('Reading', {
  deviceID: String,
  deviceType: String,
  dataKeys: Array,
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

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
  const reading = new Reading({deviceID, deviceType, data, dataKeys });
  await reading.save();
  const response = {
    ok: true,
  };
  return(res.code(200).send(response));
};

fastify.route({
  method: 'POST',
  url: '/ingest',
  schema: ingestSchema,
  handler: ingestHandler,
});

const start = async () => {
  const port = process.env.PORT || 3000;
  try {
    await fastify.listen(port, '0.0.0.0');
  } catch(err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
