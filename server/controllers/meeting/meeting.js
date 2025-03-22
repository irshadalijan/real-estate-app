const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { agenda, attendes, attendesLead, location, related, dateTime, notes, createBy } = req.body;

        if (!agenda || !createBy || !dateTime) {
            return res.status(400).json({ success: false, message: 'Agenda, DateTime, and CreateBy are required' });
        }

        const meeting = new MeetingHistory({
            agenda,
            attendes,
            attendesLead,
            location,
            related,
            dateTime,
            notes,
            createBy,
        });
        await meeting.save();

        res.status(201).json(meeting);
    } catch (error) {
        console.error('Error adding meeting:', error);
        res.status(500).json({ success: false, message: 'Failed to create meeting', error });
    }
};

const index = async (req, res) => {
    try {
        const meetings = await MeetingHistory.find({ deleted: false })
            .populate('createBy', 'firstName lastName').lean();
            const transformedMeetings = meetings.map(meeting => ({
                ...meeting,
                createdByName: meeting.createBy ? `${meeting.createBy.firstName} ${meeting.createBy.lastName}` : null
            }));
        res.status(200).json(transformedMeetings);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch meetings', error });
    }
};

const view = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid meeting ID' });
        }

        const meeting = await MeetingHistory.findOne({ _id: id, deleted: false })
            .populate('createBy', 'firstName lastName')
            .populate('attendes', 'name email')
            .populate('attendesLead', 'leadName').lean();

        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }

        meeting.createdByName = meeting.createBy 
    ? `${meeting.createBy.firstName} ${meeting.createBy.lastName}` 
    : null; 

        res.status(200).json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch meeting', error });
    }
};

const deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid meeting ID' });
        }

        const meeting = await MeetingHistory.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }

        res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete meeting', error });
    }
};

const deleteMany = async (req, res) => {
    try {
        const ids = req.body;
        if (!Array.isArray(ids) || !ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ success: false, message: 'Invalid meeting IDs' });
        }

        await MeetingHistory.updateMany({ _id: { $in: ids } }, { deleted: true });
        res.status(200).json({ success: true, message: 'Meetings deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete meetings', error });
    }
};

module.exports = { add, index, view, deleteData, deleteMany };
