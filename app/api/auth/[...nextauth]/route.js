import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoClient } from 'mongodb'

// MongoDB connection
let cachedClient = null
let cachedDb = null

async function connectToMongoDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  const db = client.db()

  cachedClient = client
  cachedDb = db

  return { client, db }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { db } = await connectToMongoDB()
        const existingUser = await db.collection('users').findOne({ email: user.email })
        
        if (!existingUser) {
          await db.collection('users').insertOne({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            totalPoints: 0,
            level: 1,
            badges: [],
            quizScore: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const { db } = await connectToMongoDB()
          const user = await db.collection('users').findOne({ email: session.user.email })
          if (user) {
            session.user.id = user.id
            session.user.totalPoints = user.totalPoints || 0
            session.user.level = user.level || 1
            session.user.badges = user.badges || []
            session.user.quizScore = user.quizScore || 0
          }
        } catch (error) {
          console.error('Session error:', error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }