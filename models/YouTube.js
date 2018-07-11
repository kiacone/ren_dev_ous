const mongoose = require('mongoose');

const YouTubeSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  imageLink: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''  
  },
  uniqueId: {
    type: String,
    default: ''  
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  
});

module.exports = mongoose.model('YouTube', YouTubeSchema);
