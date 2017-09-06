// TODO in the end we probably don't want to reply with a string, but with
// [data, action], e.g. ['hello', sendMessage]
// similar to postback, etc


// In this file we're writing our actual Messenger Bot

// the reason for all the boilerplate in `index.js` is so here we can write
// a simple and pure function about what our bot actually does
const echo = (event) => {
  const message = event.message
  const messageText = message.text
  const messageAttachments = message.attachments

  if (messageText) {
    return { text: messageText }
  } else if (messageAttachments) {
    return { text: 'Don\'t know what to do with message with attachment' }
  }
}

const genericMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [{
        title: 'rift',
        subtitle: 'Next-generation virtual reality',
        item_url: 'https://www.oculus.com/en-us/rift/',
        image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/104/10460/10460569.jpg',
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
        image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/104/10460/10460569.jpg',
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

const echoOrGeneric = (event) => {
  const message = event.message
  const messageText = message.text
  const messageAttachments = message.attachments

  if (messageText) {
    switch (messageText) {
      case 'generic':
        return genericMessage
      default:
        return { text: messageText }
    }
  } else if (messageAttachments) {
    return { text: 'Don\'t know what to do with message with attachment' }
  }
}

// const receivedPostback = (event) => {
//   const senderID = event.sender.id
//   const recipientID = event.recipient.id
//   const timeOfPostback = event.timestamp
//
//   var payload = event.postback.payload
//
//   console.log('Received postback for user %d and page %d with payload \'%s\'' + 'at %d', senderID, recipientID, payload, timeOfPostback)
//
//   sendTextMessage(senderID, 'Postback called')
// }

module.exports.echo = echoOrGeneric
