import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ScheduleModal = ({ isOpen, onClose, onSubmit, title = "", description = "" }) => {
  const [eventTitle, setEventTitle] = useState(title);
  const [eventDescription, setEventDescription] = useState(description);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      // Reset fields when modal opens
      setEventTitle(title);
      setEventDescription(description);
      setStartDateTime("");
      setEndDateTime("");
      setIsEndDateEnabled(false);
      setShowOkButton(false);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen, title, description]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start < now) {
      toast.warn("Start date and time must be in the future.");
      return;
    }

    if (isEndDateEnabled && end <= start) {
      toast.warn("End date must be after the start date.");
      return;
    }

    onSubmit({
      title: eventTitle,
      description: eventDescription,
      startDateTime,
      endDateTime: isEndDateEnabled ? endDateTime : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Schedule Media</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
              placeholder="Enter event title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => {
                setStartDateTime(e.target.value);
                setShowOkButton(true);
              }}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           
          </div>

          {/* Optional End Date & Time */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isEndDateEnabled}
                onChange={() => setIsEndDateEnabled(!isEndDateEnabled)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700 font-medium">Add End Date & Time</span>
            </label>
            {isEndDateEnabled && (
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
                min={startDateTime || new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
              placeholder="Enter event description"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
