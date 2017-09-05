const request = require('request-promise-native')
const { pageAccessToken } = require('./secrets')

const sendGenericMessage = (recipientID, messageText) => {
  const messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: 'rift',
            subtitle: 'Next-generation virtual reality',
            item_url: 'https://www.oculus.com/en-us/rift/',
            image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
            buttons: [{
              type: 'web_url',
              url: 'https://www.oculus.com/en-us/rift/',
              title: 'Open Web URL'
            }, {
              type: 'postback',
              title: 'Call Postback',
              payload: 'Payload for first bubble'
            }]
          }, {
            title: 'touch',
            subtitle: 'Your Hands, Now in VR',
            item_url: 'https://www.oculus.com/en-us/touch/',
            image_url: 'http://messengerdemo.parseapp.com/img/touch.png',
            buttons: [{
              type: 'web_url',
              url: 'https://www.oculus.com/en-us/touch/',
              title: 'Open Web URL'
            }, {
              type: 'postback',
              title: 'Call Postback',
              payload: 'Payload for second bubble'
            }]
          }]
        }
      }
    }
  }

  callSendAPI(messageData)
}

const sendTextMessage = (recipientID, messageText) => {
  const messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      text: messageText
    }
  }
  callSendAPI(messageData)
}

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
        console.log('Successfully sent generic message with id %s to recipient %s', messageID, recipientID)
      }
    })
    .catch((error, response) => {
      console.error('Unable to send message.')
      console.error(response)
      console.error(error)
    })
}

const receivedMessage = (event) => {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const timeOfMessage = event.timestamp
  const message = event.message

  console.log('Received message for user %d and page %d at %d with message:', senderID, recipientID, timeOfMessage)
  console.log(JSON.stringify(message))

  const messageId = message.mid
  const messageText = message.text
  const messageAttachments = message.attachments

  if (messageText) {
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID)
        break
      default:
        sendTextMessage(senderID, messageText)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, 'Message with attachment received')
  }
}

module.exports.receivedMessage = receivedMessage
