# Login with Google + Slack
Backend and frontend implementation for login with Google OAuth using passport.js and connecting with Slack

## How to clone?
- `git clone https://github.com/PoorvKumar/google-slack.git`

## How to Run?
### Backend Server
- Navigate to server directory `cd server`
- Run `npm install`
- Run `npm run dev` to start the development server
### Frontend Server
- Navigate to client directory `cd client`
- Run `npm install`
- Run `npm run dev` to start the frontend React server

## Details:
- This is built using Node.js, Express, MongoDB, React and Passport.js for Google OAuth
- Implemented the frontend and backend for Login with Google along with security considerations using middlewares like helmet, cors
- Implemented the 'Connect with Slack' functionality for logged in user
- Maintained user session using express-session middleware using MongoStore as session storage

- To login with Gmail, you can click on the 'Login with Google' button which will redirect to the google login
- To connect to slack account, click on 'Connect Slack Account' button which will redirect to slack 

## Video
![ezgif-5-6698f3b23a](https://github.com/PoorvKumar/google-slack/assets/55318092/55cfa900-d510-4b8e-86d8-8c7c4e321dc9)

