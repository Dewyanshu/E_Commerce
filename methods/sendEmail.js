/**
 *
 * Run:
 *
 */
const mailjet = require('node-mailjet').apiConnect(
  "12c81f200b4eb8ee2ba8d30e8d12f0aa",
  "56f2f9dd5b8fdb4969ec64e2d9526c58"
)
module.exports = function(email, token, callback){
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'sharmadewyanshu@gmail.com',
          Name: 'E-Commerce',
        },
        To: [
          {
            Email: email,
            Name: "We don't need",
          },
        ],
        Subject: 'One step away to signup!!',
        TextPart: 'For experience good services and to purchase expensive products, Verify quickly...',
        HTMLPart:
          `<h3>What are you waiting for ${token}> copy the OTP and complete your signup quickly.</h3>`
        },
      ],
    })
    request
      .then(result => {
      console.log(result.body)
      callback(null, result.body);
    })
    .catch(err => {
      console.log(err)
      callback(err, null);
  })
}