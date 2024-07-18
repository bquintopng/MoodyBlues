import React, { useState } from "react";

const MoodSelect = ({ onMoodSelect }) => {
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedFace, setSelectedFace] = useState("");
  const [selectedBody, setSelectedBody] = useState("");

  const faces = ["Happy", "Sad", "Energetic", "Relaxed"];
  const bodies = ["Running", "Sitting", "Standing", "Dancing"];
  const backgrounds = ["City", "Park", "Party", "Gym"];

  const handleSubmit = () => {
    if (!selectedBackground || !selectedFace || !selectedBody) {
      alert("Please complete your mood selection by choosing one option from each category.");
      return;
    }

    const selectedMood = {
      background: selectedBackground,
      face: selectedFace,
      body: selectedBody,
    };

    console.log("User's selected mood:", selectedMood);
    onMoodSelect(selectedMood);
  };

  const isSelected = (category, value) => {
    if (category === "background") return selectedBackground === value;
    if (category === "face") return selectedFace === value;
    if (category === "body") return selectedBody === value;
    return false;
  };

  return (
    <div>
      <h2>Select your mood:</h2>
      <div>
        <h3>Background</h3>
        {backgrounds.map((background) => (
          <button
            key={background}
            className={isSelected("background", background.toLowerCase()) ? "selected" : ""}
            onClick={() => setSelectedBackground(background.toLowerCase())}
          >
            {background}
          </button>
        ))}
      </div>
      <div>
        <h3>Face</h3>
        {faces.map((face) => (
          <button
            key={face}
            className={isSelected("face", face.toLowerCase()) ? "selected" : ""}
            onClick={() => setSelectedFace(face.toLowerCase())}
          >
            {face}
          </button>
        ))}
      </div>
      <div>
        <h3>Body</h3>
        {bodies.map((body) => (
          <button
            key={body}
            className={isSelected("body", body.toLowerCase()) ? "selected" : ""}
            onClick={() => setSelectedBody(body.toLowerCase())}
          >
            {body}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Get Playlist</button>
    </div>
  );
};

export default MoodSelect;
