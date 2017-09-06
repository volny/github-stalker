// In this file we're writing our actual Messenger Bot

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

// Takes in a user event and returns response message
const echo = ({ postback, message }) => {
  if (postback) {
    return { text: 'postback call 😱' }
  } else if (message.text) {
    switch (message.text) {
      case 'generic':
        return genericMessage
      default:
        return { text: message.text }
    }
  } else if (message.attachments) {
    return { text: 'Don\'t know what to do with message with attachment' }
  }
}

module.exports.echo = echo
