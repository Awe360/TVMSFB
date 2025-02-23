import MediaCollection from "../model/MediaCollection.js";
import NewTVModel from "../model/TVCollection.js";
import TVUploadedMedia from "../model/TVSharedMedia.js";
import Schedule from "../model/Schedule.js";
import { io } from '../socket/index.js';

export const SetSchedule = async (req, res) => {
    const { mediaId, tvId, title, public_id, mediaCategory, description, mediaUrl, startDateTime, endDateTime } = req.body;

    try {
        const newSchedule = new Schedule({
            mediaId,
            tvId,
            title,
            description,
            mediaUrl,
            startDateTime,
            endDateTime,
            status: "Pending",
            
        });

        await newSchedule.save();

        const targetTV = await NewTVModel.findOne({ tvId });
        if (!targetTV) {
            return res.status(404).json({ success: false, message: "TV not found" });
        }

        targetTV.schedules.push({
            scheduleId: newSchedule._id,
            startDateTime,
            endDateTime,
            status: "Pending",
        });

        await targetTV.save();

        // Calculate the delay time for emitting the event
        const now = new Date();
        const startTime = new Date(startDateTime);
        const delay = startTime - now;

        if (delay > 0) {
            setTimeout(async () => {
                const schedule = await Schedule.findOne({ _id: newSchedule._id });

                if (!schedule || schedule.status !== "Pending") {
                    console.log("Schedule not found or already processed.");
                    return;
                }

                io.to(tvId).emit("mediaUpdate", { mediaUrl });

                console.log(`Media update sent to TV ${tvId}`);
                await Schedule.findByIdAndUpdate(newSchedule._id, { status: "confirmed" });

                // Remove existing media in TVUploadedMedia
                await TVUploadedMedia.findByIdAndDelete(mediaId);

                // Check if media exists in MediaCollection
                const existingMediaInCollection = await MediaCollection.findById(mediaId);
                if (existingMediaInCollection) {
                    await MediaCollection.findByIdAndDelete(mediaId);
          
                    const newMediaCollection = new MediaCollection({
                      _id: mediaId,
                      title,
                      mediaUrl,
                      public_id,
                      description,
                      mediaCategory,
                    });
          
                    await newMediaCollection.save();
                    console.log(newMediaCollection)
                  }
          

                // Add media to TVUploadedMedia
                const newUploadedMedia = new TVUploadedMedia({
                    _id: mediaId,
                    title,
                    tvId,
                    mediaUrl,
                    public_id,
                    description,
                    mediaType: mediaCategory,
                });

                await newUploadedMedia.save();
            }, delay);
        }

        res.status(201).json({ success: true, message: "Schedule has been created successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const GetAllSchedules = async (req, res) => {
    try {
        const allSchedules = await Schedule.find({});
        res.json(allSchedules);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const HandleCancel = async (req, res) => {
    const { _id } = req.body;
    console.log("payload", req.body);
    try {
        const schedule = await Schedule.findByIdAndUpdate(_id, { status: "Cancelled" });

        if (!schedule) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.json({ schedule });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
export const DeleteSchedule=async(req,res)=>{
    const { _id } = req.body;
    console.log("payload", req.body);
    try {
        const schedule = await Schedule.findByIdAndDelete(_id);
        if (!schedule) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }
        res.json({ schedule });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    

}}
