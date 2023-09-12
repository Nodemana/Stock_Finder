const { VisitCountModel } = require('../classes/countSchema.js');

module.exports.incrementVisitCount = async (req, res) => {
    try {
        // Find the visit count document
        const visit = await VisitCountModel.findOne();
        if (!visit) {
            // If not found, create one
            await VisitCountModel.create({});
            return res.json({ count: 1 }); // Since this is a new record, the count is 1
        } else {
            // If found, increment the count and update the timestamp
            visit.count += 1;
            visit.updatedAt = Date.now();
            await visit.save();
            return res.json({ count: visit.count }); // Return the incremented count
        }
    } catch (err) {
        console.error("Error updating visit count:", err);
        res.status(500).json({ error: "Failed to update visit count" });
    }
};


