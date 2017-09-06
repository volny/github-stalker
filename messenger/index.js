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
    .then((response) => {
      if (response.statusCode === 200) {
        const recipientID = response.body.recipient_id
        const messageID = response.body.message_id
        console.log('Successfully sent message with id %s to recipient %s', messageID, recipientID)
      }
    })
    .catch((error, response) => {
      console.error('Unable to send message.')
      console.error(response)
      console.error(error)
    })
}

const sendMessage = (recipientID, message) => {
  const messageData = {
    recipient: {
      id: recipientID
    },
    message: message
  }
  callSendAPI(messageData)
}

const handleEvent = (func, event) => {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const timestamp = event.timestamp

  if (event.postback) {
    const payload = event.postback.payload
    console.log('Received postback for user %d and page %d with payload \'%s\'' + 'at %d', senderID, recipientID, payload, timestamp)
  } else if (event.message) {
    console.log('Received message for user %d and page %d at %d with message:', senderID, recipientID, timestamp)
    console.log(JSON.stringify(event.message))
  } else {
    console.log('Webhook received unknown event:', event)
    // in case of unknown event we're aborting early
    return
  }

  // actual bot code goes here ...
  const messageToSend = func.apply(this, [event])
  sendMessage(senderID, messageToSend)
}

const decorator = (func) => {
  const decorated = (req, res) => {
    const handlePOST = (req, res) => {
      const data = req.body
      if (data.object === 'page') {
        // fb might batch entries and send multiple
        data.entry.forEach((entry) => {
          const pageID = entry.id
          const timeOfEvent = entry.time
          console.log(`New Event: ${pageID} at ${timeOfEvent}`) // iterate over each messaging event
          entry.messaging.forEach((event) => {
            handleEvent(func, event)
          })
        })
      }

      // must respons with 200 or FB will resend request
      res.sendStatus(200)
    }

    switch (req.method) {
      case 'POST':
        handlePOST(req, res)
        break
      default:
        res.status(500).send({ error: 'Something blew up!' })
        break
    }
  }
  return decorated
}

const verify = (req, res) => {
  if (req.query['hub.verify_token'] === verifyToken) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
}

exports.echo = decorator(echo)
exports.verify = verify
