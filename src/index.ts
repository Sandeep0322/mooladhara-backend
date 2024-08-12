import cors from 'cors'
import express, { Express, Response, Request, NextFunction } from 'express'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import error from '../middleware/error'
import swaggerSpec from '../swaggerConfig'
import asyncMiddleware from '../middleware/async'
import userRoutes from './routes/user'
import chatRoutes from './routes/chat'
import Users from './models/Users'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import jwt from 'jsonwebtoken'
import { jwtPrivateKey } from '../startup/config'

export default function configureApp(app: Express): void {
  const corsOptions = {
    origin: '*',
    exposedHeaders: '*',
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '54603994795-ngnet86qebsnpnam8990vr6m46ljnfot.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback',
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          let user = await Users.findOne({ googleId: profile.id })
          console.log(profile)
          if (!user) {
            user = new Users({ googleId: profile.id })
            await user.save()
          }
          const token = jwt.sign({ id: user._id }, jwtPrivateKey)
          user.authTokens = [token]
          user.name = profile.name.givenName
          user.image = profile.photos[0].value
          await user.save()
          done(null, user)
        } catch (err) {
          done(err)
        }
      }
    )
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: 'YOUR_FACEBOOK_CLIENT_ID',
        clientSecret: 'YOUR_FACEBOOK_CLIENT_SECRET',
        callbackURL: '/auth/facebook/callback',
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          let user = await Users.findOne({ facebookId: profile.id })
          if (!user) {
            user = new Users({ facebookId: profile.id })
            await user.save()
          }
          const token = jwt.sign({ id: user._id }, jwtPrivateKey)
          user.authTokens = [token]
          await user.save()
          done(null, user)
        } catch (err) {
          done(err)
        }
      }
    )
  )

  app.use(passport.initialize())

  // Middlewares and configurations
  app.use(cors(corsOptions))
  app.use(express.static('public'))
  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ limit: '5mb', extended: true }))
  app.use(morgan('tiny'))

  // Serve Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use('/api/users', userRoutes)
  app.use('/api/chat', chatRoutes)

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
  )
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req: Request, res: Response) => {
      try {
        const user = req.user as any
        if (user.isLogin === true) {
          res.redirect(
            `http://localhost:3000/chat?authToken=${user.authTokens[0]}`
          )
        } else {
          await Users.findOneAndUpdate({ _id: user._id }, { isLogin: true })
          res.redirect(
            `http://localhost:3000/update-details?authToken=${user.authTokens[0]}`
          )
        }
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  )

  app.get('/auth/facebook', passport.authenticate('facebook'))
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req: Request, res: Response) => {
      try {
        res.json({ authToken: '' })
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  )

  app.post('/auth/mobile', async (req: Request, res: Response) => {
    try {
      const { mobile } = req.body
      let user = await Users.findOne({ mobile })
      if (!user) {
        user = new Users({ mobile })
        await user.save()
      }
      const token = jwt.sign({ id: user._id }, 'YOUR_JWT_SECRET')
      user.authTokens = [token]
      await user.save()
      res.json({ authToken: user.authTokens[0] })
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  app.get('/test', (req: Request, res: Response) => {
    try {
      res.status(200).json('hello')
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // Custom error handling middleware
  app.use(error)

  app.all(
    '/:unknown/*',
    asyncMiddleware((req: Request, res: Response) => {
      return res.status(404).json({ error: 'UNKNOWN END POINT' })
    })
  )
}
