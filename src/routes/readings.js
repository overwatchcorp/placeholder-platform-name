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
        data: { type: 'object' },
      },
    },
  },
};



const readingsHandler = (req, res) => {
  const start = new Date(req.query.start);
  const end = new Date(req.query.end);

  Reading.find({
    timestamp: {
      $gt: start,
      $lt: end,
    }
  }, (err, data) => {
    res.send(`${data}`);
  })
};

module.exports = { readingsSchema, readingsHandler };
