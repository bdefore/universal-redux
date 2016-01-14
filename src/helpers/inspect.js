const util = require('util');

export default (obj) => {
  const utilOptions = {
    depth: 12,
    colors: true
  };

  console.log(util.inspect(obj, utilOptions));
};
