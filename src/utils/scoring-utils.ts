
// This file is now just a wrapper to maintain backward compatibility
// All logic has been moved to smaller, more focused files in the /scoring directory

import {
  calculatePoints,
  calculateTotalPoints,
  POINTS_SYSTEM,
  calculateDriverPoints,
  calculateConstructorPoints,
  calculateAllPoints
} from './scoring';

export {
  calculatePoints,
  calculateTotalPoints,
  POINTS_SYSTEM,
  calculateDriverPoints,
  calculateConstructorPoints,
  calculateAllPoints
};
