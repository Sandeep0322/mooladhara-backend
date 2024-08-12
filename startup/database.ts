import mongoose, { Connection } from 'mongoose'
import { DB_PATH } from './config'

const mongoDB: string = DB_PATH

const db: Connection = mongoose.connection

// CONNECTION EVENTS
db.on('error', (error) => {
	console.log('Mongoose default connection error: %s', error)
})

// When successfully connected
db.on('connected', () => {
	console.log('Mongoose default connection open to ' + mongoDB)
})

// When the connection is disconnected
db.on('disconnected', () => {
	console.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	db.close().then(() => {
		process.exit(0)
	})
})

export default db
