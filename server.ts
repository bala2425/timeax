import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db-store.json");

app.use(express.json());

// Initialize Gemini SDK with lazy check
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Interfaces for our DB Store
interface DBStore {
  users: any[];
  routines: any[];
  screen_time: any[];
  goals: any[];
  journals: any[];
  reflections: any[];
  chatbot_history: any[];
  quotes: any[];
  feedback: any[];
}

// Load DB Store with high-fidelity seed data
function loadDB(): DBStore {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      console.error("Failed to read DB file, resetting...", e);
    }
  }

  // Prepopulate with gorgeous, realistic seed data for Balachandar A (balachandarrangan@gmail.com)
  const defaultStore: DBStore = {
    users: [
      {
        id: "user-1",
        fullName: "Balachandar A",
        username: "balachandar",
        email: "balachandarrangan@gmail.com",
        mobile: "+91 8438461479",
        dob: "1998-05-12",
        gender: "Male",
        country: "India",
        state: "Tamil Nadu",
        city: "Chennai",
        occupation: "Developer & Creator",
        schoolCompany: "TIMEX Inc.",
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        streak: 12,
        productivityScore: 88,
        achievements: ["Early Bird", "Consistency Master", "Screen Time Slayer", "Mindfulness Guru"],
        role: "admin",
        password: "admin"
      }
    ],
    routines: [],
    screen_time: [],
    goals: [],
    journals: [],
    reflections: [],
    chatbot_history: [],
    quotes: [
      { id: "q-1", text: "Time is life itself.", author: "Balachandar A" },
      { id: "q-2", text: "Lost time is never found again.", author: "Benjamin Franklin" },
      { id: "q-3", text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
      { id: "q-4", text: "Discipline is choosing between what you want now and what you want most.", author: "Augustine of Hippo" },
      { id: "q-5", text: "Small daily improvements create extraordinary results.", author: "Robin Sharma" },
      { id: "q-6", text: "Consistency beats motivation.", author: "James Clear" },
      { id: "q-7", text: "Time once wasted can never be recovered.", author: "Unknown" }
    ],
    feedback: [
      {
        id: "fb-1",
        userId: "user-1",
        username: "balachandar",
        text: "Loving the glassmorphic design and the AI chatbot suggestion features!",
        date: "2026-07-04"
      }
    ]
  };

  // Prepopulate last 7 days of historical screen time, goals, reflections, journals for "user-1"
  const now = new Date();
  const purposes = ["Study", "Work", "Coding", "Entertainment", "Social Media", "Gaming", "YouTube", "Movies", "Other"] as const;
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Seed Screen Time (make some days highly productive, others a bit wasted)
    if (i === 0) {
      // Today (so far)
      defaultStore.screen_time.push(
        { id: `st-${dateStr}-1`, userId: "user-1", date: dateStr, mobile: 120, desktop: 240, purpose: "Coding" },
        { id: `st-${dateStr}-2`, userId: "user-1", date: dateStr, mobile: 45, desktop: 90, purpose: "Entertainment" }
      );
    } else {
      defaultStore.screen_time.push(
        { id: `st-${dateStr}-1`, userId: "user-1", date: dateStr, mobile: Math.floor(60 + Math.random() * 80), desktop: Math.floor(180 + Math.random() * 200), purpose: "Coding" },
        { id: `st-${dateStr}-2`, userId: "user-1", date: dateStr, mobile: Math.floor(30 + Math.random() * 60), desktop: Math.floor(60 + Math.random() * 100), purpose: "Study" },
        { id: `st-${dateStr}-3`, userId: "user-1", date: dateStr, mobile: Math.floor(60 + Math.random() * 120), desktop: Math.floor(30 + Math.random() * 60), purpose: "Social Media" }
      );
    }

    // Seed Goals
    defaultStore.goals.push(
      { id: `g-${dateStr}-1`, userId: "user-1", date: dateStr, title: "Practice React & Vite optimization", completed: i !== 2 },
      { id: `g-${dateStr}-2`, userId: "user-1", date: dateStr, title: "Complete 45 mins morning cardio", completed: i !== 4 },
      { id: `g-${dateStr}-3`, userId: "user-1", date: dateStr, title: "Drink 3 liters of water", completed: true }
    );

    // Seed Daily Reflections
    const ratings = [5, 4, 5, 3, 5, 4, 5];
    const moods = ["😊", "😃", "😊", "😐", "😃", "😊", "😃"] as const;
    defaultStore.reflections.push({
      id: `ref-${dateStr}`,
      userId: "user-1",
      date: dateStr,
      productivityRating: ratings[i % ratings.length],
      timeWasters: i === 3 ? "Spent too long on infinite scroll reels" : "Minor distactions during lunch",
      happinessFactors: "Completed key features ahead of schedule and had family walk",
      mood: moods[i % moods.length]
    });

    // Seed Journals
    defaultStore.journals.push({
      id: `jr-${dateStr}`,
      userId: "user-1",
      date: dateStr,
      time: "20:30:00",
      learnedToday: "Learned about server-side proxy routes and caching techniques to optimize loading.",
      skillPracticed: "Implemented clean responsive SVG visualizers.",
      mistakesMade: "Spent too much time debugging peer dependency warnings manually.",
      improveTomorrow: "Plan the system architecture beforehand and rely on robust built-in browser layouts."
    });

    // Seed Routines checklist (default routines complete / pending)
    const defaultChecklist = [
      "Brushed Teeth", "Took Bath", "Morning Exercise", "Yoga", "Meditation", 
      "Healthy Breakfast", "Read Books", "Studied", "Office Work", "College Work", 
      "Homework", "Drank Enough Water", "Family Time", "Evening Walk", "Slept Before 11 PM"
    ];

    defaultChecklist.forEach((item, index) => {
      // Completed randomly based on day to simulate healthy habit tracking
      const isCompleted = (index % 3 !== 0) || (i === 1);
      defaultStore.routines.push({
        id: `rt-${dateStr}-${index}`,
        userId: "user-1",
        date: dateStr,
        title: item,
        completed: isCompleted,
        completedAt: isCompleted ? `${dateStr}T${8 + (index % 12)}:30:00.000Z` : undefined
      });
    });
  }

  saveDB(defaultStore);
  return defaultStore;
}

function saveDB(data: DBStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write to DB file", e);
  }
}

// Global store instance
let db = loadDB();

// Authentication Endpoints
app.post("/api/auth/register", (req, res) => {
  const {
    fullName, username, email, mobile, dob, gender, country,
    state, city, occupation, schoolCompany, password
  } = req.body;

  if (!email || !password || !fullName || !username) {
    return res.status(400).json({ error: "Missing required registration details." });
  }

  const emailExists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const newUser = {
    id: "user-" + Date.now(),
    fullName,
    username,
    email,
    mobile: mobile || "",
    dob: dob || "",
    gender: gender || "",
    country: country || "",
    state: state || "",
    city: city || "",
    occupation: occupation || "",
    schoolCompany: schoolCompany || "",
    profilePicture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
    streak: 1,
    productivityScore: 70,
    achievements: ["Novice Timer"],
    role: email.toLowerCase() === "balachandarrangan@gmail.com" ? "admin" : "user",
    password // stored directly for sandbox ease
  };

  db.users.push(newUser);
  saveDB(db);

  // Auto-seed today's routines for new user
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultChecklist = [
    "Brushed Teeth", "Took Bath", "Morning Exercise", "Yoga", "Meditation", 
    "Healthy Breakfast", "Read Books", "Studied", "Office Work", "College Work", 
    "Homework", "Drank Enough Water", "Family Time", "Evening Walk", "Slept Before 11 PM"
  ];
  defaultChecklist.forEach((item, index) => {
    db.routines.push({
      id: `rt-${todayStr}-${newUser.id}-${index}-${Date.now()}`,
      userId: newUser.id,
      date: todayStr,
      title: item,
      completed: false
    });
  });
  saveDB(db);

  res.status(201).json({ user: newUser, token: `mock-jwt-token-${newUser.id}` });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({ user, token: `mock-jwt-token-${user.id}` });
});

// Profile Management
app.get("/api/user/profile/:id", (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json(user);
});

app.put("/api/user/profile/:id", (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found." });

  db.users[index] = { ...db.users[index], ...req.body };
  saveDB(db);
  res.json(db.users[index]);
});

// Routine Tracker API
app.get("/api/routines", (req, res) => {
  const { userId, date } = req.query;
  if (!userId || !date) return res.status(400).json({ error: "userId and date are required." });

  let items = db.routines.filter(r => r.userId === userId && r.date === date);
  
  // If no routines exist for today/this date, generate the default list automatically
  if (items.length === 0) {
    const defaultChecklist = [
      "Brushed Teeth", "Took Bath", "Morning Exercise", "Yoga", "Meditation", 
      "Healthy Breakfast", "Read Books", "Studied", "Office Work", "College Work", 
      "Homework", "Drank Enough Water", "Family Time", "Evening Walk", "Slept Before 11 PM"
    ];
    
    defaultChecklist.forEach((item, index) => {
      db.routines.push({
        id: `rt-${date}-${userId}-${index}-${Date.now()}`,
        userId: userId as string,
        date: date as string,
        title: item,
        completed: false
      });
    });
    saveDB(db);
    items = db.routines.filter(r => r.userId === userId && r.date === date);
  }

  res.json(items);
});

app.post("/api/routines", (req, res) => {
  const { userId, date, title } = req.body;
  if (!userId || !date || !title) return res.status(400).json({ error: "Missing task attributes." });

  const newItem = {
    id: `rt-custom-${Date.now()}`,
    userId,
    date,
    title,
    completed: false
  };

  db.routines.push(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

app.put("/api/routines/:id", (req, res) => {
  const index = db.routines.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Routine item not found." });

  db.routines[index].completed = req.body.completed;
  db.routines[index].completedAt = req.body.completed ? new Date().toISOString() : undefined;
  saveDB(db);

  // Dynamically update streak & score on completion
  const userId = db.routines[index].userId;
  const userIdx = db.users.findIndex(u => u.id === userId);
  if (userIdx !== -1) {
    // Basic scoring: complete routine increases productivity score slightly
    const completedCount = db.routines.filter(r => r.userId === userId && r.date === db.routines[index].date && r.completed).length;
    const totalCount = db.routines.filter(r => r.userId === userId && r.date === db.routines[index].date).length;
    const routineRatio = totalCount > 0 ? (completedCount / totalCount) : 0;
    
    // Update score
    const currentScore = db.users[userIdx].productivityScore || 70;
    const targetScore = Math.min(100, Math.max(30, Math.floor(60 + routineRatio * 40)));
    db.users[userIdx].productivityScore = Math.floor((currentScore * 2 + targetScore) / 3);
    saveDB(db);
  }

  res.json(db.routines[index]);
});

app.delete("/api/routines/:id", (req, res) => {
  const idx = db.routines.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item not found." });
  db.routines.splice(idx, 1);
  saveDB(db);
  res.json({ success: true });
});

// Screen Time API
app.get("/api/screen-time", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required." });
  const records = db.screen_time.filter(s => s.userId === userId);
  res.json(records);
});

app.post("/api/screen-time", (req, res) => {
  const { userId, date, mobile, desktop, purpose } = req.body;
  if (!userId || !date || purpose === undefined) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newRecord = {
    id: `st-${Date.now()}`,
    userId,
    date,
    mobile: Number(mobile) || 0,
    desktop: Number(desktop) || 0,
    purpose
  };

  db.screen_time.push(newRecord);
  saveDB(db);
  res.status(201).json(newRecord);
});

// Journal API
app.get("/api/journals", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required." });
  const entries = db.journals.filter(j => j.userId === userId);
  res.json(entries);
});

app.post("/api/journals", (req, res) => {
  const { userId, date, learnedToday, skillPracticed, mistakesMade, improveTomorrow } = req.body;
  if (!userId || !date) return res.status(400).json({ error: "Missing fields." });

  const id = `jr-${Date.now()}`;
  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0];

  const newJournal = {
    id,
    userId,
    date,
    time: timeStr,
    learnedToday: learnedToday || "",
    skillPracticed: skillPracticed || "",
    mistakesMade: mistakesMade || "",
    improveTomorrow: improveTomorrow || ""
  };

  db.journals.push(newJournal);
  saveDB(db);
  res.status(201).json(newJournal);
});

// Reflections API
app.get("/api/reflections", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required." });
  const reflections = db.reflections.filter(r => r.userId === userId);
  res.json(reflections);
});

app.post("/api/reflections", (req, res) => {
  const { userId, date, productivityRating, timeWasters, happinessFactors, mood } = req.body;
  if (!userId || !date || productivityRating === undefined) {
    return res.status(400).json({ error: "Missing reflection fields." });
  }

  const existingIdx = db.reflections.findIndex(r => r.userId === userId && r.date === date);
  const newRef = {
    id: existingIdx !== -1 ? db.reflections[existingIdx].id : `ref-${Date.now()}`,
    userId,
    date,
    productivityRating: Number(productivityRating),
    timeWasters: timeWasters || "",
    happinessFactors: happinessFactors || "",
    mood: mood || "😊"
  };

  if (existingIdx !== -1) {
    db.reflections[existingIdx] = newRef;
  } else {
    db.reflections.push(newRef);
  }
  saveDB(db);
  res.status(201).json(newRef);
});

// Goal Planner API
app.get("/api/goals", (req, res) => {
  const { userId, date } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required." });
  
  let goals = db.goals.filter(g => g.userId === userId);
  if (date) {
    goals = goals.filter(g => g.date === date);
  }
  res.json(goals);
});

app.post("/api/goals", (req, res) => {
  const { userId, date, title } = req.body;
  if (!userId || !date || !title) return res.status(400).json({ error: "Missing data." });

  const newGoal = {
    id: `g-${Date.now()}`,
    userId,
    date,
    title,
    completed: false
  };

  db.goals.push(newGoal);
  saveDB(db);
  res.status(201).json(newGoal);
});

app.put("/api/goals/:id", (req, res) => {
  const idx = db.goals.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Goal not found." });

  db.goals[idx].completed = req.body.completed;
  saveDB(db);
  res.json(db.goals[idx]);
});

app.delete("/api/goals/:id", (req, res) => {
  const idx = db.goals.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Goal not found." });
  db.goals.splice(idx, 1);
  saveDB(db);
  res.json({ success: true });
});

// Custom Quotes API (Admin view + random quote generator)
app.get("/api/quotes", (req, res) => {
  res.json(db.quotes);
});

app.post("/api/quotes", (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ error: "Quote text is required." });

  const newQuote = {
    id: `q-${Date.now()}`,
    text,
    author: author || "Unknown"
  };

  db.quotes.push(newQuote);
  saveDB(db);
  res.status(201).json(newQuote);
});

app.delete("/api/quotes/:id", (req, res) => {
  const idx = db.quotes.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Quote not found." });
  db.quotes.splice(idx, 1);
  saveDB(db);
  res.json({ success: true });
});

// Feedback / Bug Report API
app.get("/api/feedback", (req, res) => {
  res.json(db.feedback);
});

app.post("/api/feedback", (req, res) => {
  const { userId, username, text } = req.body;
  if (!text) return res.status(400).json({ error: "Feedback content is required." });

  const newFb = {
    id: `fb-${Date.now()}`,
    userId: userId || "anonymous",
    username: username || "Anonymous User",
    text,
    date: new Date().toISOString().split("T")[0]
  };

  db.feedback.push(newFb);
  saveDB(db);
  res.status(201).json(newFb);
});

// Admin Control APIs
app.get("/api/admin/users", (req, res) => {
  // Return users except their passwords for basic display
  const usersSafe = db.users.map(({ password, ...u }) => u);
  res.json(usersSafe);
});

app.delete("/api/admin/users/:id", (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found." });
  db.users.splice(idx, 1);
  saveDB(db);
  res.json({ success: true });
});

app.get("/api/admin/chats", (req, res) => {
  res.json(db.chatbot_history);
});

// Chatbot Endpoint with Specialized Gemini Assistant
app.post("/api/chatbot", async (req, res) => {
  const { userId, message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required." });

  // Add to history
  const userMsgId = `chat-msg-${Date.now()}`;
  const userMsg = {
    id: userMsgId,
    userId: userId || "guest",
    timestamp: new Date().toISOString(),
    sender: "user" as const,
    message
  };
  db.chatbot_history.push(userMsg);
  saveDB(db);

  let replyText = "";

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: "You are TIMEX AI, a specialized productivity, wellness, and time management assistant. " +
            "You answer ONLY topics related to: Healthy Lifestyle, Exercise, Nutrition, Productivity, Time Management, Study Techniques, Career Guidance, Motivation, Learning Methods, and Mental Wellness. " +
            "If the user asks anything unrelated to these domains, you must respond politely EXACTLY with: 'I'm TIMEX AI. I specialize only in health, productivity, education, and personal development.'"
        }
      });
      replyText = response.text || "I apologize, I could not generate a response.";
    } else {
      // Fallback response generator if Gemini key is missing
      const promptLower = message.toLowerCase();
      if (promptLower.includes("hello") || promptLower.includes("hi")) {
        replyText = "Hello! I'm TIMEX AI, your productivity and wellness assistant. How can I help you manage your time and habits today?";
      } else if (promptLower.includes("routine") || promptLower.includes("habit")) {
        replyText = "Establishing routines is key to discipline. Try completing the default daily habits in your TIMEX Tracker (like Morning Exercise, Reading, and sleeping early) to build a solid consistency score!";
      } else if (promptLower.includes("screen") || promptLower.includes("phone")) {
        replyText = "To reduce screen time, try setting hard boundaries: no devices 1 hour before sleep, track your daily sessions in the Screen Time tab, and dedicate at least 2 blocks to focused study or coding.";
      } else if (promptLower.includes("study") || promptLower.includes("productivity")) {
        replyText = "Boost productivity using the Pomodoro Technique: 25 minutes of deep focus followed by a 5-minute offline break. Review your weekly analytics score inside TIMEX to optimize your learning days.";
      } else if (promptLower.includes("exercise") || promptLower.includes("health") || promptLower.includes("water")) {
        replyText = "Physical wellness powers cognitive clarity. Aim for 3 liters of water, 30 minutes of daily activity, and track them daily in your TIMEX Checklists!";
      } else if (promptLower.includes("weather") || promptLower.includes("stock") || promptLower.includes("movie") || promptLower.includes("recipe") || promptLower.includes("joke")) {
        replyText = "I'm TIMEX AI. I specialize only in health, productivity, education, and personal development.";
      } else {
        replyText = "That's a great thought! As your TIMEX companion, I encourage you to time-block this topic, eliminate distractions, and record your notes in your daily Learning Journal to reinforce your recall.";
      }
    }
  } catch (err) {
    console.error("Gemini API error, using safe fallback", err);
    replyText = "I'm TIMEX AI. I specialize only in health, productivity, education, and personal development. Let's talk about building habits, study methods, or reducing screen time!";
  }

  const aiMsgId = `chat-msg-${Date.now() + 1}`;
  const aiMsg = {
    id: aiMsgId,
    userId: userId || "guest",
    timestamp: new Date().toISOString(),
    sender: "ai" as const,
    message: replyText
  };
  db.chatbot_history.push(aiMsg);
  saveDB(db);

  res.json({ reply: replyText });
});

// Dynamic AI Suggestions / Insights API to reduce unnecessary screen time
app.get("/api/ai-suggestions", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required." });

  const screenRecords = db.screen_time.filter(s => s.userId === userId);
  const totalMobile = screenRecords.reduce((sum, r) => sum + r.mobile, 0);
  const totalDesktop = screenRecords.reduce((sum, r) => sum + r.desktop, 0);
  
  const categories = screenRecords.reduce((acc: any, r) => {
    acc[r.purpose] = (acc[r.purpose] || 0) + r.mobile + r.desktop;
    return acc;
  }, {});

  let highestCat = "None";
  let maxMin = 0;
  Object.keys(categories).forEach(c => {
    if (categories[c] > maxMin) {
      maxMin = categories[c];
      highestCat = c;
    }
  });

  const summary = `User has logged a total of ${totalMobile + totalDesktop} minutes of screen time, of which ${totalMobile} minutes are mobile and ${totalDesktop} minutes are desktop. Their primary category is '${highestCat}' taking up ${maxMin} minutes.`;

  let suggestion = "";
  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Based on this user time data: "${summary}", generate three short, highly actionable, bulleted advice points to reduce screen time, improve focus, and promote physical wellbeing. Keep it under 100 words.`,
      });
      suggestion = response.text || "";
    }
  } catch (e) {
    // fallback suggestion
  }

  if (!suggestion) {
    suggestion = `• **Set Boundaries on ${highestCat || "Social Media"}**: Create a daily limit of 45 minutes on your mobile device for recreational use.\n• **Tech-Free Blocks**: Reserve 2 hours in the morning exclusively for deep-work or learning without any desktop notifications.\n• **Active Replacements**: Swap 30 minutes of screen scroll with a physical outdoor walk or book-reading routine.`;
  }

  res.json({ suggestion });
});

// Setup Dev/Production Server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
