const request = require('request-promise-native')

// returns a promise
const getGithubData = (username) => {
  const URI = `https://us-central1-gh-trending-chatbot.cloudfunctions.net/getAvatar?username=${username}`
  return request({
    uri: URI,
    json: true
  })
    .then(data => data)
    .catch((error) => { console.log(error) })
}

const avatarMessage = (username, { name, avatarUrl }) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: name || username,
          item_url: `https://github.com/${username}`,
          image_url: avatarUrl,
          buttons: [{
            type: 'web_url',
            url: `https://github.com/${username}`,
            title: 'Visit Github profile'
          }]
        }]
      }
    }
  }
}

const couldBeUsername = (text) => {
  const trimmed = text.trim()
  const re = /^\b[a-zA-Z0-9_]+\b$/
  return trimmed.search((re)) === 0
}

// returns a promise
const showAvatar = ({ message }) => {
  if (message.text) {
    if (couldBeUsername(message.text)) {
      const username = message.text
      console.log('getting github data for', username)
      return getGithubData(username)
        .then((data) => {
          console.log('got github data')
          if (Object.keys(data).length > 0) {
            console.log('data not empty, sending response')
            return avatarMessage(username, data)
          } else {
            return { text: 'Sorry, seems like that user doesn\'t exist' }
          }
        })
        .catch((error) => {
          console.error(error)
          return { text: 'Sorry, something went wrong contacting Github' }
        })
    } else {
      return { text: 'Sorry, that doesn\'t look like a valid Github username. Please try again' }
    }
  } else if (message.attachments) {
    return { text: 'I\'m scared of attachment 😱' }
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

// module.exports.echo = echo
module.exports.echo = showAvatar
