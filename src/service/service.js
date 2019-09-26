let provider = require('./providers/' + process.env.REACT_APP_SERVICE_PROVIDER);
provider = provider.default || provider;

export default provider;
export {provider};
