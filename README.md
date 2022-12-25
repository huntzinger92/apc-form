# APC Event Updater

## What This Is

This is a React app that handles creating, updating, and deleting events from the APC event database. Users can query existing events by date or add new events entirely. The app integrates with supabase on the backend.

This project is intended to be an "internal" only tool, to greatly expedite the process of keeping our database up to date. That being said, this work could serve as the basis of allowing in-website edits in the future.

## How to Use It

To use this app, you will need to setup the env file with the correct supabase project url, api key, and table name, like so:

```
REACT_APP_SUPABASE_URL=https://stahmaxffcqankienulh.supabase.co
REACT_APP_SUPABASE_ANON_KEY=some_api_key
REACT_APP_SUPABASE_TABLE_NAME=table_name_here
```

You will also need an account to login. This app does not handle the creation of new accounts. You will need to contact the owner of this repository to set one up.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the jest-based test runner.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

