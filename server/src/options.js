// Fixed lists used across the app. Change them here and the frontend picks them up from GET /api/options.

const options = {
  circles: ["Exam stress", "Loneliness", "Family", "Relationships", "Anxiety", "General"],

  reactions: [
    { type: "relate", label: "I relate" },
    { type: "strength", label: "Sending strength" },
    { type: "thanks", label: "Thank you for sharing" },
  ],

  specialisations: ["Anxiety", "Depression", "Exam stress", "Relationships", "Family", "Grief", "Loneliness", "Sleep"],
  languages: ["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Bengali"],
  genders: ["Female", "Male", "Non-binary", "Prefer not to say"],
  helperKinds: [
    { value: "licensed", label: "Licensed therapist" },
    { value: "volunteer", label: "Volunteer listener" },
  ],

  emotions: ["Happy", "Calm", "Grateful", "Sad", "Anxious", "Angry", "Tired"],
  resourceCategories: ["Stress", "Anxiety", "Sleep", "Mindfulness", "Students"],
};

export const penNameWords = {
  adjectives: ["Quiet", "Gentle", "Brave", "Calm", "Kind", "Bright", "Soft", "Steady", "Warm", "Hopeful"],
  nouns: ["Fern", "River", "Sparrow", "Maple", "Cloud", "Lotus", "Pebble", "Willow", "Harbor", "Meadow"],
};

export default options;
