const request = require('request-promise-native')

const { verifyToken, pageAccessToken } = require('../secrets')
const { echo } = require('./bots/echoBot')
const { avatar } = require('./bots/avatarBot')
const { stalker } = require('./bots/stalkerBot')

// verify webhook URL with Facebook
const verify = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === verifyToken) {
    console.log('Validating webhook')
    res.status(200).send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
}

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
    // aborting early
    return
  }

  // actual bot code goes here ...
  const promise = func.call(this, event)

  Promise.resolve(promise)
    .then((message) => {
      console.log(`Sending Message to ${sender.id}:`, message)
      sendMessage(sender.id, message)
    })
    .catch((error) => console.error(error))
}

const handlePOST = (func, req, res) => {
  const { body } = req
  const { object, entry } = body
  if (object === 'page') {
    // fb might batch entries and send multiple
    for (let subentry of entry) {
      const { id, time, messaging } = subentry
      console.log(`New Event: ${id} at ${time}`)
      for (let event of messaging) {
        // async function
        handleEvent(func, event)
      }
    }
  }

  // must respons with 200 or FB will resend request
  res.sendStatus(200)
}

const decorator = (func) => {
  const decorated = (req, res) => {
    switch (req.method) {
      case 'POST':
        handlePOST(func, req, res)
        break
      case 'GET':
        verify(req, res)
        break
      default:
        res.status(500).send({ error: 'Bad Request' })
        break
    }
  }
  return decorated
}

exports.echo = decorator(echo)
exports.avatar = decorator(avatar)
exports.stalker = decorator(stalker)
