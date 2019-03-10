const manifest_browser = require('./manifest');
const {on,Events} = require('./events');

module.exports = (manifest) => {
  const browser = manifest_browser(manifest);
  return {
    server: (server) => {

    },
    state: (state) => {

    },
    browser,
    on,
    Events
  }
};