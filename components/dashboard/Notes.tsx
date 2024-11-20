import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

interface NotesProps {
  selectedDate: dayjs.Dayjs | null;
}

const Notes: React.FC<NotesProps> = ({ selectedDate }) => {
  const [textareaContent, setTextareaContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);

  // Check if notes exist for the selected date
  const fetchNotes = async (date: string) => {
    try {
      const response = await axios.get(`/api/notes`, {
        params: { date },
        withCredentials: true,
      });

      if (response.data?.success && response.data.data.length > 0) {
        const note = response.data.data[0]; // Assuming one note per date
        setTextareaContent(note.notes || "");
        setNoteId(note._id); // Save the note ID for updates
      } else {
        setTextareaContent("");
        setNoteId(null);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchNotes(selectedDate.format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  // Add notes (POST request)
  const handleAddNotes = async () => {
    try {
      if (!textareaContent.trim()) {
        toast("Please enter some content before adding notes.")
        return;
      }
      setIsLoading(true);
      const response = await axios.post(
        `/api/notes`,
        { date: selectedDate?.format("YYYY-MM-DD"), notes: textareaContent },
        { withCredentials: true }
      );
      toast.success("Notes created successfully");
      setNoteId(response.data.data._id); // Save the newly created note ID
    } catch (error) {
      console.error("Error adding notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update notes (PATCH request)
  const handleUpdateNotes = async () => {
    try {
      if (!textareaContent.trim()) {
        toast("Please enter some content before updating notes.");
        return;
      }
      if (!noteId) {
        toast("No existing note to update.");
        return;
      }
      setIsLoading(true);
      await axios.patch(
        `/api/notes?id=${noteId}`,
        { notes: textareaContent },
        { withCredentials: true }
      );
      toast.success("Notes updated successfully");
    } catch (error) {
      console.error("Error updating notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col justify-center items-center space-x-5">
      <textarea
        name="description"
        className="w-full m-auto h-40 rounded-sm lg:px-10 px-5 mb-2 py-2 mt-5"
        value={textareaContent}
        onChange={(e) => setTextareaContent(e.target.value)} // Only updates local state
        disabled={isLoading}
        placeholder="Write your notes here..."
      />
      {!noteId ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded lg:w-40 "
          onClick={handleAddNotes}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Notes"}
        </button>
      ) : (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 lg:w-40 "
          onClick={handleUpdateNotes}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Notes"}
        </button>
      )}
    </div>
  );
};

export default Notes;
