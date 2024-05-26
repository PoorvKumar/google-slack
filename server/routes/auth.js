const express = require("express");
const router = express.Router();
const axios=require("axios");

const passport = require("passport");

const { WebClient } = require('@slack/web-api');

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
    const isSlackConnected = !!req.session.slackAccessToken;
    return res.status(200).json({
      user: req.user,
      isSlackConnected,
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

router.get('/slack/channels', async (req, res) => {
  try {
    const slackClient = new WebClient(req.session.slackAccessToken);
    const channels = await slackClient.conversations.list({ types: 'public_channel' });

    res.json({ channels: channels.channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.post('/slack/send-user-details', async (req, res) => {
  const { channelIds } = req.body;

  if (!channelIds || !Array.isArray(channelIds) || channelIds.length === 0) {
    return res.status(400).json({ error: 'Invalid channel IDs provided' });
  }

  try {
    const slackClient = new WebClient(req.session.slackAccessToken);
    const user = await slackClient.users.info();

    const userDetails = {
      displayName: user.user.profile.real_name || user.user.name,
      email: user.user.profile.email,
      image: user.user.profile.image_original || null,
    };

    for (const channelId of channelIds) {
      await slackClient.chat.postMessage({
        channel: channelId,
        text: `User Details:\n${JSON.stringify(userDetails, null, 2)}`,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending user details to channels:', error);
    res.status(500).json({ error: 'Failed to send user details' });
  }
});

module.exports = router;