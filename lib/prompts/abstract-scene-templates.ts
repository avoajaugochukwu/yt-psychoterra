/**
 * Modular Abstract Scene Template System - Psychoterra Style
 *
 * Generates vibrant, dramatic close-up marble statue imagery with:
 * - Tight framing (close-ups, half-body shots)
 * - Massive scale (figures filling the frame)
 * - Vibrant colors (red, purple, green neon, orange fire)
 * - Draped/clothed figures (no nudity)
 * - Dynamic camera angles
 */

// Draped marble statue subjects with tight framing (30+ options)
const SUBJECTS = [
  'close-up of draped Roman emperor marble statue in flowing robes',
  'half-body shot of robed Greek philosopher marble statue',
  'tight framing on cloaked Marcus Aurelius marble statue',
  'close-up of robed Zeus marble statue with commanding presence',
  'half-body view of draped Atlas titan marble statue',
  'intimate shot of toga-wearing Socrates marble bust',
  'close-up of robed Athena marble statue with helmet and draped fabric',
  'half-body framing of cloaked warrior marble statue',
  'tight shot of draped Poseidon marble statue with flowing robes',
  'close-up of robed Apollo marble statue',
  'half-body view of cloaked wanderer marble statue',
  'intimate framing of draped Prometheus marble statue',
  'close-up of toga-clad Roman senator marble statue',
  'half-body shot of robed Hercules marble statue',
  'tight framing on draped elderly sage marble statue with long beard',
  'close-up of cloaked Stoic philosopher marble statue',
  'half-body view of robed contemplative figure marble statue',
  'intimate shot of draped Mercury messenger marble statue',
  'close-up of toga-wearing wise elder marble statue',
  'half-body framing of robed Diana huntress marble statue',
  'tight shot of draped cherubim with wings marble sculpture',
  'close-up of cloaked mystic marble statue',
  'half-body view of robed king marble statue',
  'intimate framing of draped teacher marble statue',
  'close-up of toga-clad orator marble statue',
  'half-body shot of robed guardian marble statue with draped cloak',
  'tight framing on draped Neptune marble statue',
  'close-up of cloaked titan marble statue',
  'half-body view of robed scholar marble statue with flowing fabric',
  'intimate shot of draped celestial being marble statue',
];

// Camera angles and framing (20+ options)
const CAMERA_ANGLES = [
  'extreme low angle looking upward',
  'dramatic upward perspective',
  'tight close-up from below',
  'half-body shot, low angle',
  'intimate close-up focusing on face and upper torso',
  'dramatic worm\'s eye view',
  'close framing from slightly below',
  'heroic low angle shot',
  'tight half-body composition looking up',
  'powerful upward angle emphasizing scale',
  'close-up with dramatic perspective',
  'intimate framing, slightly below eye level',
  'imposing low angle view',
  'tight shot from ground level looking up',
  'majestic upward perspective',
  'close half-body framing from below',
  'dramatic low angle close-up',
  'intimate upward view',
  'tight composition emphasizing monumentality',
  'powerful low perspective shot',
];

// Poses and gestures (25+ options)
const POSES = [
  'reaching one arm upward toward the heavens',
  'head tilted back gazing at sky',
  'arms outstretched in powerful gesture',
  'one hand raised as if teaching or proclaiming',
  'standing with chest forward in triumphant pose',
  'turning to look over shoulder',
  'hands clasped in deep contemplation',
  'arm extended pointing into the distance',
  'leaning forward with intense focus',
  'arms crossed in stoic, unmoved stance',
  'holding a scroll or book close to chest',
  'gesture of protection with hands forward',
  'resting chin on closed fist in thought',
  'both arms raised dramatically to the sky',
  'noble profile view with commanding bearing',
  'head bowed in sorrowful reflection',
  'victorious pose with one fist raised',
  'hand on heart in solemn gesture',
  'pointing upward with authoritative gesture',
  'gazing directly forward with piercing eyes',
  'hands spread wide in welcoming motion',
  'one arm shielding eyes from light',
  'gripping staff or trident firmly',
  'serene meditation pose with peaceful expression',
  'dynamic twisted pose full of energy',
];

// Vibrant lighting styles (30+ options)
const LIGHTING = [
  'intense red and orange fire glow illuminating the statue',
  'electric green neon rim lighting with purple accents',
  'vibrant purple and blue aurora energy surrounding the figure',
  'bright cyan and magenta cosmic glow',
  'vivid orange sunset lighting with pink highlights',
  'neon turquoise with hot pink rim light',
  'crimson red backlight with golden sparks',
  'brilliant green and yellow energy beams',
  'electric blue lightning illumination',
  'fierce orange fire glow with red shadows',
  'radiant purple energy with teal accents',
  'vibrant pink and blue neon lighting',
  'golden hour orange with purple sky glow',
  'bright lime green mystical aura',
  'intense magenta and cyan color contrast',
  'fiery red backlight with orange smoke',
  'electric violet energy with white highlights',
  'vivid emerald green with golden rim light',
  'bright coral and turquoise lighting',
  'neon yellow energy with purple shadows',
  'brilliant red and blue dramatic lighting',
  'vibrant teal glow with orange fire accents',
  'electric pink and green neon energy',
  'bright amber and purple cosmic light',
  'vivid crimson with electric blue highlights',
  'neon cyan backlight with magenta atmosphere',
  'intense orange fire with purple storm light',
  'bright lime and hot pink energy',
  'vibrant ruby red with golden lightning',
  'electric indigo with bright green accents',
];

// Vibrant color palettes and skies (35+ options)
const COLOR_PALETTES = [
  'vibrant red and orange fiery sky with swirling clouds',
  'electric green and purple neon atmosphere',
  'bright cyan and magenta cosmic background',
  'vivid orange sunset sky with purple storm clouds',
  'neon turquoise with pink and purple nebula',
  'crimson red storm with golden lightning streaks',
  'brilliant emerald green sky with teal clouds',
  'hot pink and electric blue cosmic backdrop',
  'vibrant coral and turquoise atmosphere',
  'neon yellow energy field with purple haze',
  'bright red and blue swirling storm sky',
  'vivid teal and orange fire background',
  'electric pink and lime green neon sky',
  'brilliant amber and deep purple cosmic space',
  'vibrant ruby red with electric blue lightning',
  'neon cyan and hot magenta energy backdrop',
  'intense orange fire sky with violet clouds',
  'bright lime green with fuchsia nebula',
  'vivid crimson with golden and teal accents',
  'electric indigo with bright green aurora',
  'vibrant tangerine orange with purple storm',
  'neon violet and bright yellow cosmic background',
  'brilliant scarlet red with turquoise energy',
  'hot magenta and electric cyan atmosphere',
  'vivid emerald with orange fire glow',
  'neon rose pink with green and blue nebula',
  'bright cherry red with electric purple lightning',
  'vibrant aqua and orange sunset sky',
  'electric lavender with neon green accents',
  'brilliant gold and deep magenta cosmic space',
  'neon coral with electric blue energy',
  'vivid burgundy with bright teal highlights',
  'electric lime with hot pink and purple sky',
  'vibrant sapphire blue with orange fire',
  'neon mint green with crimson red clouds',
];

// Atmospheric effects (20+ options)
const ATMOSPHERIC_EFFECTS = [
  'thick volumetric fog with light rays piercing through',
  'swirling colorful smoke tendrils',
  'floating glowing particles and dust',
  'dramatic storm clouds churning behind statue',
  'cosmic nebula clouds in vibrant colors',
  'cascading embers and glowing sparks',
  'spiraling energy vortex',
  'billowing colored smoke',
  'vertical god rays cutting through atmosphere',
  'floating luminous orbs of energy',
  'dense atmospheric haze with color',
  'ethereal wisps of colored energy',
  'swirling mist with dramatic lighting',
  'rising heat distortion waves',
  'cascading light beams',
  'churning vortex of colored energy behind figure',
  'floating magical particles',
  'dramatic crepuscular rays through clouds',
  'billowing fabric-like energy waves',
  'crystalline light particles suspended in air',
];

/**
 * Generates a unique abstract scene prompt by randomly combining components
 * @returns A detailed image generation prompt optimized for Psychoterra style
 */
export function generateAbstractScenePrompt(): string {
  // Randomly select one element from each category
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const angle = CAMERA_ANGLES[Math.floor(Math.random() * CAMERA_ANGLES.length)];
  const pose = POSES[Math.floor(Math.random() * POSES.length)];
  const lighting = LIGHTING[Math.floor(Math.random() * LIGHTING.length)];
  const colorPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  const effect = ATMOSPHERIC_EFFECTS[Math.floor(Math.random() * ATMOSPHERIC_EFFECTS.length)];

  // Combine into cohesive prompt with tight framing emphasis
  return `${subject}, ${angle}, ${pose}, ${lighting}, ${colorPalette}, ${effect}`;
}

/**
 * Generates multiple unique prompts for a video
 * @param count Number of scenes needed
 * @returns Array of unique prompts
 */
export function generateVideoScenePrompts(count: number): string[] {
  const prompts: string[] = [];

  for (let i = 0; i < count; i++) {
    prompts.push(generateAbstractScenePrompt());
  }

  return prompts;
}

// Export arrays for potential direct access
export {
  SUBJECTS,
  CAMERA_ANGLES,
  POSES,
  LIGHTING,
  COLOR_PALETTES,
  ATMOSPHERIC_EFFECTS,
};
