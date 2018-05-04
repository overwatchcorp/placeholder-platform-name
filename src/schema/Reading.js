const mongoose = require('mongoose');
// Mongo Reading Schema
const Reading = mongoose.model('Reading', {
  deviceID: String,
  deviceType: String,
  dataKeys: Array,
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

module.exports = Reading;
