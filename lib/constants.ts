export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "canorous-floorplan",
    SOURCES: "canorous-floorplan/sources",
    RENDERS: "canorous-floorplan/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

export const CANOROUS_PROMPT_TOPDOWN = `
Generate a photorealistic 3D architectural rendering from the provided floor plan.

OUTPUT: TOP-DOWN VIEW ONLY.
Orthographic top-down render, strictly overhead, 90 degree nadir angle. No perspective tilt.
Complete layout with accurate room proportions and spatial relationships.

STRICT REQUIREMENTS (do not violate):
1) REMOVE ALL TEXT: No letters, numbers, labels, dimensions, or annotations anywhere.
   Floors must be continuous and clean where text previously appeared.
2) GEOMETRY MUST MATCH: Walls, rooms, doors, and windows must follow the exact lines
   and positions in the plan. Do not shift, add, or resize any element.
3) CLEAN, REALISTIC OUTPUT: Crisp edges, balanced lighting, realistic materials.
   No sketch, hand-drawn, or cartoon look.
4) NO EXTRA CONTENT: Do not add rooms, furniture, or objects not clearly indicated
   by the plan. No shadows cast outside wall boundaries.
5) SCALE ACCURACY: All furniture and fixtures must be correctly scaled to room size.

STRUCTURE & GEOMETRY:
- Walls: Extruded precisely from plan lines. Consistent height and thickness.
- Doors: Convert door swing arcs into realistically rendered open doors.
- Windows: Convert thin perimeter lines into realistic glass windows with frames.

FURNITURE & ROOM MAPPING (only where clearly shown in the plan):
- Bed icon          -> realistic bed with duvet, pillows, and side tables
- Sofa icon         -> modern sectional or sofa with coffee table
- Dining table icon -> table with chairs, properly centered in room
- Kitchen icon      -> counters with sink, stove, and upper cabinets
- Bathroom icon     -> toilet, sink, and tub/shower with tiling
- Office/study icon -> desk, chair, and minimal shelving
- Porch/patio icon  -> minimal outdoor seating, keep uncluttered
- Utility/laundry   -> washer/dryer and minimal cabinetry

MATERIALS & LIGHTING:
- Lighting: Bright, neutral daylight. High clarity and balanced contrast.
- Floors: Realistic wood or tile textures.
- Walls: Clean painted finish with subtle shadows.
- Finish: Professional architectural visualization. No watermarks, logos, or text.
`.trim();

export const CANOROUS_PROMPT_ISOMETRIC = `
Generate a photorealistic ISOMETRIC 3D architectural rendering from the provided floor plan.

OUTPUT: ISOMETRIC DOLLHOUSE VIEW — like the classic "3D floor plan" style.
- Camera angle: exactly 45 degrees above, rotated 45 degrees on the horizontal axis
- All walls extruded upward, roof completely removed, all rooms visible from above
- The result must look like a physical architectural scale model or dollhouse cutaway
- DO NOT render a flat 2D top-down view. DO NOT render a straight overhead view.
- The image must show wall depth, floor depth, and furniture from a diagonal angle

REFERENCE STYLE: Real estate 3D floor plan visualization. Walls have visible height.
Floors are visible inside each room. Furniture is seen from an above-diagonal angle.
The entire floor plan floats on a clean neutral background like a physical model.

STRICT REQUIREMENTS (do not violate):
1) REMOVE ALL TEXT: No letters, numbers, labels, dimensions, or annotations anywhere.
   Floors must be continuous and clean where text previously appeared.
2) GEOMETRY MUST MATCH: Walls, rooms, doors, and windows must follow the exact lines
   and positions in the plan. Do not shift, add, or resize any element.
3) CLEAN, REALISTIC OUTPUT: Crisp edges, balanced lighting, realistic materials.
   No sketch, hand-drawn, or cartoon look.
4) NO EXTRA CONTENT: Do not add rooms, furniture, or objects not clearly indicated
   by the plan. No shadows cast outside wall boundaries.
5) SCALE ACCURACY: All furniture and fixtures must be correctly scaled to room size.

STRUCTURE & GEOMETRY:
- Walls: Extruded upward, visible from the side at the isometric angle.
- Doors: Open doors visible from the diagonal angle, aligned to plan positions.
- Windows: Realistic glass with frames set into walls, visible from the side.

FURNITURE & ROOM MAPPING (only where clearly shown in the plan):
- Bed icon          -> realistic bed with duvet, pillows, and side tables
- Sofa icon         -> modern sectional or sofa with coffee table
- Dining table icon -> table with chairs, properly centered in room
- Kitchen icon      -> counters with sink, stove, and upper cabinets
- Bathroom icon     -> toilet, sink, and tub/shower with tiling
- Office/study icon -> desk, chair, and minimal shelving
- Porch/patio icon  -> minimal outdoor seating, keep uncluttered
- Utility/laundry   -> washer/dryer and minimal cabinetry

MATERIALS & LIGHTING:
- Lighting: Bright, neutral daylight with soft directional shadows showing wall depth.
- Floors: Realistic wood or tile textures per room type.
- Walls: Clean white or light painted finish with visible exterior sides.
- Background: Clean neutral gray or white, like a product render on a studio backdrop.
- Finish: Professional architectural visualization. No watermarks, logos, or text.
`.trim();

export const CANOROUS_GALLERY_PROMPTS = [
    `Generate a photorealistic interior perspective render from this floor plan.
Focus on the LIVING ROOM. Eye-level camera, as if standing inside looking toward the main seating area.
Show sofa, coffee table, and any connected open spaces. Natural daylight from windows.
No text, no labels, no watermarks. Photorealistic quality only.`.trim(),

    `Generate a photorealistic interior perspective render from this floor plan.
Focus on the KITCHEN and DINING AREA. Eye-level camera showing counters, appliances, and dining table.
Show the connection between kitchen and dining if open plan. Warm natural lighting.
No text, no labels, no watermarks. Photorealistic quality only.`.trim(),

    `Generate a photorealistic interior perspective render from this floor plan.
Focus on the MASTER BEDROOM. Eye-level camera, as if standing at the doorway looking in.
Show the bed, side tables, and any windows. Soft warm lighting with natural light.
No text, no labels, no watermarks. Photorealistic quality only.`.trim(),

    `Generate a photorealistic interior perspective render from this floor plan.
Focus on the HALLWAY or ENTRANCE corridor connecting the main rooms.
Eye-level camera showing doors leading to different rooms and the overall flow of the space.
Natural overhead lighting. Clean minimal style.
No text, no labels, no watermarks. Photorealistic quality only.`.trim(),

    `Generate a photorealistic interior perspective render from this floor plan.
Focus on a SECONDARY BEDROOM or BATHROOM. Eye-level camera showing the full room.
If bathroom: show tiling, fixtures, and natural light. If bedroom: show bed and window.
No text, no labels, no watermarks. Photorealistic quality only.`.trim(),
] as const;

// Legacy alias — keeps any other files that import this from breaking
export const CANOROUS_RENDER_PROMPT = CANOROUS_PROMPT_TOPDOWN;