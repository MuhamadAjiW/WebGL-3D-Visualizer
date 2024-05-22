import { useState } from "react";

export default function SaveData() {
  const [formData, setFormData] = useState({
    sceneData: {}, // Replace with your actual scene data
    filename: "sceneData",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Data saved successfully");
      } else {
        console.error("Error:", result);
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="filename"
        value={formData.filename}
        onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
        placeholder="Filename"
      />
      <button type="submit">Save Data</button>
    </form>
  );
}
