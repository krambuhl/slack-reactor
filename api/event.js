const VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN

module.exports = (req, res) => {
  const { token, ...body } = req.body

  if (token === VERIFICATION_TOKEN) {
    console.log(body)
  }
}
