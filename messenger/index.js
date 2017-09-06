const request = require('request-promise-native')
const { pageAccessToken, verifyToken } = require('./secrets')
const { echo } = require('./messaging')

const callSendAPI = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: messageData,
    resolveWithFullResponse: true
  })
    .then(({ statusCode, body }) => {
      if (statusCode === 200) {
        console.log('Successfully sent message with id %s to recipient %s',
          body.message_id, body.recipient_id)
      }
    })
    .catch((error) => {
      console.error('Unable to send message.', error)
    })
}

const sendMessage = (recipientID, message) => {
  const messageData = {
    recipient: {
      id: recipientID
    },
    message
  }
  callSendAPI(messageData)
}

const handleEvent = (func, event) => {
  const { postback, sender, recipient, timestamp, message } = event
  if (postback) {
    console.log('Received postback for user %d and page %d with payload \'%s\'' + 'at %d',
      sender.id, recipient.id, postback.payload, timestamp)
  } else if (message) {
    console.log('Received message for user %d and page %d at %d with message:',
      sender.id, recipient.id, timestamp)
    console.log(JSON.stringify(message))
  } else {
    console.log('Webhook received unknown event:', event)
    // in case of unknown event we're aborting early
    return
  }

  // actual bot code goes here ...
  const responseMessage = func.call(this, event)
  sendMessage(sender.id, responseMessage)
}

const decorator = (func) => {
  const decorated = (req, res) => {
    const { method } = req
    const { status } = res
    const handlePOST = (req, res) => {
      const { body } = req
      const { sendStatus } = res
      const { object, entry } = body
      if (object === 'page') {
        // fb might batch entries and send multiple
        entry.forEach((subentry) => {
          const { id, time, messaging } = subentry
          console.log(`New Event: ${id} at ${time}`)
          messaging.forEach((event) => {
            handleEvent(func, event)
          })
        })
      }

      // must respons with 200 or FB will resend request
      sendStatus(200)
    }

    switch (method) {
      case 'POST':
        handlePOST(req, res)
        break
      default:
        status(500).send({ error: 'Only POST allowed' })
        break
    }
  }
  return decorated
}

const verify = ({ query }, { send }) => {
  if (query['hub.verify_token'] === verifyToken) {
    send(query['hub.challenge'])
  } else {
    send('Error, wrong validation token')
  }
}

exports.echo = decorator(echo)
exports.verify = verify
