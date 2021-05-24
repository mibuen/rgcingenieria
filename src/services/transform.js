const Sharp = require('sharp');

const transformer = () => Sharp().toFormat('webp').resize(300);

module.exports = {
  transformer,
};
