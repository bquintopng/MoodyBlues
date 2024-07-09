import React, { useState } from "react";

const MoodSelect = ({ onMoodSelect }) => {
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedFace, setSelectedFace] = useState("");
  const [selectedBody, setSelectedBody] = useState("");

  const faces = ["Happy", "Sad", "Energetic", "Relaxed"];
  const bodies = ["Running", "Sitting", "Standing", "Dancing"];
  const background = ["City", "Park", "Party", "Gym"];

  const handleSubmit = () => {
    onMoodSelect({
      background: selectedBackground,
      face: selectedFace,
      body: selectedBody,
    });
  };

  return (
    <div>
      <h2>Select your mood:</h2>
      <div>
        <h3>Background</h3>
        {background.map((background) => (
          <button
            key={background}
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
