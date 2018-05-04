const fastify = require('fastify')({
  logger: true,
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
  const { deviceID, deviceType, data } = req.body;
  const timestamp = new Date().toISOString();
  fastify.log.info({
    msg: 'ingest',
    deviceID,
    deviceType,
    data,
    timestamp,
  });
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
