import { MongoClient, ObjectId } from 'mongodb';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
let cachedClient = null;
let cachedDb = null;

async function connectToMongoDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// NextAuth configuration
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
        const { db } = await connectToMongoDB();
        const existingUser = await db.collection('users').findOne({ email: user.email });
        
        if (!existingUser) {
          await db.collection('users').insertOne({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            totalPoints: 0,
            level: 1,
            badges: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const { db } = await connectToMongoDB();
          const user = await db.collection('users').findOne({ email: session.user.email });
          if (user) {
            session.user.id = user.id;
            session.user.totalPoints = user.totalPoints;
            session.user.level = user.level;
            session.user.badges = user.badges || [];
          }
        } catch (error) {
          console.error('Session error:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);

// Route handlers
export async function GET(request, { params }) {
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  // NextAuth routes
  if (path.startsWith('auth')) {
    return handler(request);
  }

  try {
    const { db } = await connectToMongoDB();

    // Get current user
    if (path === 'user/current') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // For demo, we'll use a simple approach - in production use proper JWT validation
      const email = authHeader.replace('Bearer ', '');
      const user = await db.collection('users').findOne({ email });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user);
    }

    // Get leaderboard
    if (path === 'leaderboard') {
      const users = await db.collection('users')
        .find({})
        .sort({ totalPoints: -1 })
        .limit(10)
        .toArray();

      const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        image: user.image,
        totalPoints: user.totalPoints,
        level: user.level,
        badges: user.badges || [],
      }));

      return NextResponse.json(leaderboard);
    }

    // Get user reports
    if (path === 'reports') {
      const url = new URL(request.url);
      const userEmail = url.searchParams.get('user');
      
      let query = {};
      if (userEmail) {
        query.userEmail = userEmail;
      }

      const reports = await db.collection('reports')
        .find(query)
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json(reports);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  // NextAuth routes
  if (path.startsWith('auth')) {
    return handler(request);
  }

  try {
    const { db } = await connectToMongoDB();
    const body = await request.json();

    // Submit report
    if (path === 'reports/submit') {
      const { title, description, category, location, image, userEmail, userName } = body;

      let imageUrl = null;
      if (image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(image, {
            folder: 'civic-engage/reports',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          });
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }

      // Calculate points based on category
      const pointsMap = {
        'infrastructure': 25,
        'environment': 30,
        'safety': 35,
        'transport': 20,
        'waste': 25,
      };
      const pointsAwarded = pointsMap[category.toLowerCase()] || 25;

      const report = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        category,
        location,
        imageUrl,
        userEmail,
        userName,
        pointsAwarded,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('reports').insertOne(report);

      // Update user points
      await db.collection('users').updateOne(
        { email: userEmail },
        { 
          $inc: { totalPoints: pointsAwarded },
          $set: { 
            updatedAt: new Date(),
            level: Math.floor((await db.collection('users').findOne({ email: userEmail }))?.totalPoints / 100) + 1
          }
        }
      );

      // Check for badges
      const user = await db.collection('users').findOne({ email: userEmail });
      const userReportCount = await db.collection('reports').countDocuments({ userEmail });
      
      const newBadges = [];
      if (userReportCount === 1) newBadges.push('First Reporter');
      if (userReportCount === 5) newBadges.push('Community Helper');
      if (user.totalPoints >= 500) newBadges.push('Civic Champion');

      if (newBadges.length > 0) {
        await db.collection('users').updateOne(
          { email: userEmail },
          { $addToSet: { badges: { $each: newBadges } } }
        );
      }

      return NextResponse.json({ 
        success: true, 
        report,
        pointsAwarded,
        newBadges,
        totalPoints: user.totalPoints + pointsAwarded
      });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('POST API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}