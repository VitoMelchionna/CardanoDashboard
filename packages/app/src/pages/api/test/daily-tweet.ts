import { NextApiRequest, NextApiResponse } from 'next';
import { triggerDailyTweet } from '../../../lib/scheduler';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await triggerDailyTweet();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in test daily tweet:', error);
    return res.status(500).json({ 
      error: 'Failed to trigger daily tweet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 