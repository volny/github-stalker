const { verifyToken } = require('./secrets')
const { receivedMessage, receivedPostback } = require('./messaging')

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const verify = (req, res) => {
  if (req.query['hub.verify_token'] === verifyToken) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
}

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const echo = (req, res) => {
  const handlePOST = (req, res) => {
    const data = req.body
    if (data.object === 'page') {
      // fb might batch entries and send multiple
      data.entry.forEach((entry) => {
        const pageID = entry.id
        const timeOfEvent = entry.time
        console.log(`New Event: ${pageID} at ${timeOfEvent}`)
        // iterate over each messaging event
        entry.messaging.forEach((event) => {
          if (event.message) {
            receivedMessage(event)
          } else if (event.postback) {
            receivedPostback(event)
          } else {
            console.log('Webhook received unknown event:', event)
          }
        })
      })
    }
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

exports.echo = echo
