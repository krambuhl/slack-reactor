const VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN

module.exports = (req, res) => {
  try {
    const { token, ...body } = req.body

    if (token === VERIFICATION_TOKEN) {
      console.log(body)

      res
        .status(200)
        .json({ body })
    } else {
      res
        .status(401)
        .json({ error: 'Unauthorized' })
    }
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Bad Request' })
  }
}
