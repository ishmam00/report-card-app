import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { courses, student } = req.body;

      const filePath = path.join(process.cwd(), 'public', 'data', 'enrollmentRequests.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const requests = JSON.parse(fileData);

      (courses as []).forEach((course: any) => (
        requests.push({
          id: requests.length + 1,
          student,
          course,
          status: 'pending',
        })
      ))

      fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));

      res.status(200).json({ message: 'Request sent to the corresponding faculty' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
