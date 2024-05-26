const express = require("express");
const router = express.Router();
const axios=require("axios");

const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect: process.env.CLIENT_URL,
  })
);

router.get("/login/success", (req, res, next) => {
  if (req.user) {
    return res.status(200).json({
      user: req.user,
      message: "Logged in Successfully",
    });
  }

  return res.status(403).json({ message: "Not Authorized" });
});

router.get("/login/failed", (req, res, next) => {
  return res.status(401).json({
    message: "Log in failure",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_URL);
  });
});

//Slack integration

router.get('/slack/oauth',(req,res,next)=>
{
  const slackAuthUrl = 'https://slack.com/oauth/authorize' +
    `?client_id=${process.env.SLACK_CLIENT_ID}` +
    '&scope=channels:read,chat:write:bot' + // Add required scopes
    `&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;

  res.redirect(slackAuthUrl);
});

router.get('/slack/oauth_redirect', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://slack.com/api/oauth.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });

    const { access_token } = tokenResponse.data;

    req.session.slackAccessToken = access_token;

    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error('Error during Slack OAuth:', error);
    res.status(500).send('Error during Slack OAuth');
  }
});

router.get('/slack/user-data', async (req, res) => {
  const accessToken = req.session.slackAccessToken;

  if (!accessToken) {
    return res.status(401).send('Unauthorized');
  }

  const slackClient = new WebClient(accessToken);

  try {
    const user = await slackClient.users.info();
    const channels = await slackClient.conversations.list({ types: 'public_channel' });

    res.json({ user: user.user, channels: channels.channels });
  } catch (error) {
    console.error('Error fetching user data and channels:', error);
    res.status(500).send('Error fetching user data and channels');
  }
});

module.exports = router;