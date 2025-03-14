import connectDB  from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import User from '@/models/User'; // Assuming you have a User model

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const { date } = req.query; // Get the selected date from query parameters

      // Get total number of projects
      const totalProjects = await Project.countDocuments();

      // Get number of tasks by status
      const tasksByStatus = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get daily task status changes
      const dailyStatusChanges = await Task.aggregate([
        {
          $match: {
            updatedAt: {
              $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
              $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            count: { $sum: 1 }
          }
        }
      ]);

      // Get completed tasks for each user on the selected date
      const completedTasks = await Task.aggregate([
        {
          $match: {
            status: 'completed',
            updatedAt: {
              $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
              $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
            }
          }
        },
        {
          $lookup: {
            from: 'users', // Assuming your User model is called 'users'
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            assignedTo: 1,
            userDetails: { $arrayElemAt: ['$userDetails', 0] } // Get the first user detail
          }
        }
      ]);

      return res.status(200).json({
        totalProjects,
        tasksByStatus,
        dailyStatusChanges,
        completedTasks
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API /dashboard error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}