const request = require('request-promise')
const { pageAccessToken } = require('./secrets')

const sendGenericMessage = (recipientID, messageText) => {

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
