import express from 'express'
import mongoose from 'mongoose'
import { DB_PATH, PORT } from './startup/config';

const app = express()

;(async () => {
	// Set up default mongoose connection
	require('./startup/database')
	const mongoDB = DB_PATH

	try {
		await mongoose.connect(mongoDB)
		// It's best approach to lazy load the app configuration as it may have public variables which looks for db static data or something else in future.So, it's better to clear the dependencies before loading the app
		const { default: configureApp } = await import('./src/index')
		configureApp(app)

		const port = PORT || 3004
		app.listen(port, () => console.log(`listening on port ${port}...`))
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log('Unable to initiate Mongoose default connection, because of the error: %s', error.message)
			process.exit(0)
		} else {
			console.log('An unknown error occurred')
		}
	}
})()
