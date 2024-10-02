const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        DEV: 'dev',
        MONGODB_URI: process.env.MONGODB_URI,
      },
    };
  }
  return {
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
    },
  };
};
