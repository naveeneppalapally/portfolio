// domMax = domAnimation + layout animations + drag.
// Required for the Work index FLIP case-study modals (layoutId).
// Still lazy-loaded via LazyMotion — the feature bundle never hits the initial chunk.
import { domMax } from 'framer-motion';
export default domMax;
