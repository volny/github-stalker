const { verifyToken } = require('../../secrets')

const verify = ({ query }, { send }) => {
  if (query['hub.verify_token'] === verifyToken) {
    send(query['hub.challenge'])
  } else {
    send('Error, wrong validation token')
  }
}

module.exports.verify = verify
