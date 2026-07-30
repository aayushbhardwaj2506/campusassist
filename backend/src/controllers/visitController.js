const { db } = require("../config/firebase");

const addVisit = async (req, res) => {
  try {
    const {
      page,
      browser,
      device,
      operatingSystem,
      userAgent,
      referrer,
    } = req.body;

    await db.collection("visits").add({
      page,
      browser,
      device,
      operatingSystem,
      userAgent,
      referrer,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Visit recorded successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to record visit",
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const snapshot = await db.collection("visits").get();

    const visits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalVisits = visits.length;

    const browserCounts = {};
    const deviceCounts = {};

    visits.forEach((visit) => {
      browserCounts[visit.browser] =
        (browserCounts[visit.browser] || 0) + 1;

      deviceCounts[visit.device] =
        (deviceCounts[visit.device] || 0) + 1;
    });

    res.json({
      success: true,
      totalVisits,
      browserCounts,
      deviceCounts,
      recentVisits: visits.slice(-10).reverse(),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  addVisit,
  getAnalytics,
};