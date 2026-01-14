// Flag to communicate nail clicks to parent WallObject
// This allows NailMarker to signal that a click was on a nail,
// preventing the parent WallObject from also handling the click
export const nailClickFlag = { clicked: false };
