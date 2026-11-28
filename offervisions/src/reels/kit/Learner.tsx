import React from 'react';
import {Avatar, type AvatarProps} from './Avatars';
import {SERIES} from './series';

/**
 * The learner used in every scene. Its design is chosen once in `SERIES.learner`
 * (series.ts): 'classic' | 'pebble' | 'sprout' | 'page' | 'bird' | 'ember'.
 */
export const Learner: React.FC<AvatarProps> = (props) => <Avatar variant={SERIES.learner} {...props} />;
