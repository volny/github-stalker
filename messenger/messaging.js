const echo = (event) => {
  const senderID = event.sender.id
  const message = event.message
  const messageText = message.text
  const messageAttachments = message.attachments

  if (messageText) {
    // switch (messageText) {
    //   case 'generic':
    //     sendGenericMessage(senderID)
    //     break
    //   default:
        // echo the message

        // sendTextMessage(senderID, messageText)

        return [senderID, messageText]

    // }
  } else if (messageAttachments) {
    // sendTextMessage(senderID, 'Message with attachment received')
    return [senderID, 'Don\'t know what to do with message with attachment']
  }
}

// const sendGenericMessage = (recipientID, messageText) => {
//   const messageData = {
//     recipient: {
//       id: recipientID
//     },
//     message: {
//       attachment: {
//         type: 'template',
//         payload: {
//           template_type: 'generic',
//           elements: [{
//             title: 'rift',
//             subtitle: 'Next-generation virtual reality',
//             item_url: 'https://www.oculus.com/en-us/rift/',
//             image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/104/10460/10460569.jpg',
//             buttons: [{
//               type: 'web_url',
//               url: 'https://www.oculus.com/en-us/rift/',
//               title: 'Open Web URL'
//             }, {
//               type: 'postback',
//               title: 'Call Postback',
//               payload: 'Payload for first bubble'
//             }]
//           }, {
//             title: 'touch',
//             subtitle: 'Your Hands, Now in VR',
//             item_url: 'https://www.oculus.com/en-us/touch/',
//             image_url: 'https://multimedia.bbycastatic.ca/multimedia/products/500x500/104/10460/10460569.jpg',
//             buttons: [{
//               type: 'web_url',
//               url: 'https://www.oculus.com/en-us/touch/',
//               title: 'Open Web URL'
//             }, {
//               type: 'postback',
//               title: 'Call Postback',
//               payload: 'Payload for second bubble'
//             }]
//           }]
//         }
//       }
//     }
//   }
//
//   callSendAPI(messageData)
// }

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

// module.exports.receivedMessage = receivedMessage
// module.exports.receivedPostback = receivedPostback
module.exports.echo = echo
