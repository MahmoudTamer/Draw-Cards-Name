import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Simple in-memory rate limiter: 30 requests per hour per IP
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 30
const WINDOW_MS = 60 * 60 * 1000

function isAllowed(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!isAllowed(ip)) {
    return res.status(429).json({ error: 'RATE_LIMIT_EXCEEDED' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API_KEY_MISSING' })

  try {
    const { prompt } = req.body as { prompt: string }
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '')

    const data = JSON.parse(raw)
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ error: 'ANALYSIS_FAILED' })
  }
}
