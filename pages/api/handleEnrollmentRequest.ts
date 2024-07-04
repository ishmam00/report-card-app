import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { requestId, status } = req.body;

    const requestsFilePath = path.join(process.cwd(), 'public', 'data', 'enrollmentRequests.json');
    const coursesFilePath = path.join(process.cwd(), 'public', 'data', 'courseEnrollment.json');

    const requestsData = fs.readFileSync(requestsFilePath, 'utf8');
    const requests = JSON.parse(requestsData);

    const requestIndex = requests.findIndex((request: any) => request.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    requests[requestIndex].status = status;

    fs.writeFileSync(requestsFilePath, JSON.stringify(requests, null, 2));

    if (status === 'approved') {
      const coursesData = fs.readFileSync(coursesFilePath, 'utf8');
      const courses = JSON.parse(coursesData);

      const courseName = requests[requestIndex].course.name;
      console.log("Course name:", courseName)
      if (!courses[courseName]) {
        courses[courseName] = [];
      }

      courses[courseName].push(requests[requestIndex].student);

      fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));
    }

    res.status(200).json({ message: `Request ${status}` });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
