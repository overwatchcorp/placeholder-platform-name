require('dotenv').config();
const fastify = require('fastify')({
  logger: true,
});
const mongoose = require('mongoose');
const Reading = require('./src/schema/Reading');
const { ingestSchema, ingestHandler } = require('./src/routes/ingest');
const { readingsSchema, readingsHandler } = require('./src/routes/readings');

// connect to database
mongoose.connect(process.env.MONGODB_URI);

// routes
fastify.route({
  method: 'POST',
  url: '/ingest',
  schema: ingestSchema,
  handler: ingestHandler,
});
fastify.route({
  method: 'GET',
  url: '/readings',
  schema: readingsSchema,
  handler: readingsHandler,
});

// server
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
