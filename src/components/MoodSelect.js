import React from 'react';

const MoodSelect = ({ onMoodSelect }) => {
  const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed'];

  return (
    <div>
      <h2>Select your mood:</h2>
      {moods.map((mood) => (
        <button key={mood} onClick={() => onMoodSelect(mood.toLowerCase())}>
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodSelect;