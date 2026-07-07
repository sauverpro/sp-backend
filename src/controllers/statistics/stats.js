import { customerOrderModel } from "../../models";

export const getTotalEarnings = async (req, res) => {
    const { year } = req.query;
    try {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const totalEarningsPerMonth = await customerOrderModel.aggregate([
        {
          $match: {
            status: 'successful',
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalEarnings: { $sum: "$amount" },
          },
        },
      ]);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const combinedResponse = months.map((monthName, index) => {
      const matchingEarnings = totalEarningsPerMonth.find((entry) => entry._id === index + 1);
        return {
          label: monthName,
          totalEarnings: matchingEarnings ? matchingEarnings.totalEarnings : 0,
        };
      });
      res.status(200).json(combinedResponse);
    } catch (error) {
      console.error("Error combining orders count and total earnings:", error);
      res.status(500).json({ error: error.message, message: "Internal Server Error" });
    }
  };
  export const getTotalEarningsPerday = async (req, res) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(endDate.getDate() - 6);
      const earningsPerDay = await Payment.aggregate([
        {
          $match: {
            status: 'Successful',
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalEarnings: { $sum: "$amount" },
          }
        }
      ]);
      const dateArray = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        dateArray.push(date.toISOString().split('T')[0]);
      }
      const response = dateArray.map(date => {
        const matchingDay = earningsPerDay.find(day => day._id === date);
        return {
          date,
          count: matchingDay ? matchingDay.totalEarnings : 0,
        };
      });
      res.status(200).json(response);
    } catch (error) {
      console.error("Error combining orders count and total earnings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const getUsersCount= async (req, res) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);
      const userSignupCountPerDay = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      const dateArray = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        dateArray.push(date.toISOString().split('T')[0]);
      }
      const userSignupCountMap = new Map();
      userSignupCountPerDay.forEach((entry) => {
        userSignupCountMap.set(entry._id, entry.count);
      });
      const userSignupCounts = dateArray.map((date) => ({
        date,
        count: userSignupCountMap.get(date) || 0,
      }));
      const totalUserCount = await User.countDocuments();
      res.status(200).json({
        userSignupCounts,
        totalUserCount,
      });
    } catch (error) {
      console.error('Error calculating user signups per day:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  
  
  
  
  
  
  