const Reading = require('../schema/Reading');

// /readings
const readingsSchema = {
  querystring: {
    start: {
      type: 'string',
      default: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    end: {
      type: 'string',
      default: new Date(),
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        readingsString: {
          type: 'string',
        },
      },
    },
  },
};



const readingsHandler = (req, reply) => {
  const start = new Date(req.query.start);
  const end = new Date(req.query.end);

  const c = Reading.find(
    {
      timestamp: {
        $gt: start,
        $lt: end,
      }
    },
    'data deviceID timestamp'
  )
  .limit(5)
  .cursor();

  const readings = []

  c.on('data', (data) => {
    readings.push(data);
  });
  c.on('close', () => {
    console.log(readings)
    reply
      .code(200)
      .header('Content-Type', 'application/json')
      .send({ readingsString: JSON.stringify({readings}) })
  });
};

module.exports = { readingsSchema, readingsHandler };
