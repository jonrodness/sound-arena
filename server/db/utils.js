const mysql = require('mysql');

module.exports = {
  escapeQueryVal: (value) => {
    const escapedVal = (
      typeof value === 'string'
            && value.toLowerCase() === 'now()'
    ) ? value : mysql.escape(value);

    return escapedVal;
  },
};
