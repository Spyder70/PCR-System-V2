# Project Title
PCR SYSTEM for study sessions

## Running the project

Install deps
```
$ npm install
```
.Configure .env file:
Follow the example env for your local development.
Make sure you have SITE_URI as localhost:3000
```
$ npm run start
```
Please fork the repo for your practice & study

## Recent Ngrok issues

Set values in the .env file as a few values are missing.

Run Ngrok on two different terminals, 
you may require to have two seperate accounts registered with Ngrok
for this as it only allows one tunnel per account for free tier.

Change the values in server.ts and server.js to allow access of the api
to these tunnels running on PORT 3000 by replacing your tunnel links,
with the ones already there.

In .env.local in frontend Folder Change the REACT_API_URI to your tunnel link running on PORT 8080.

## Problem faced

Individually going to the links the tunnels are running on 
they seem to be working fine, although trying to access the api through the front-end app,
different browsers respond differently.

## Chrome 
seems to connect to the api but when trying to login it display a toast message
that reads, logged in, loggin again.

## Mozilla and Ms edge
Displays the same CORS error which has been provided as a screenshot in the discord group

