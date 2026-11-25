import React from 'react';
import {Composition} from 'remotion';
import {FORMAT} from './config';
import {Offervisions} from './Offervisions';
import {defaultProps, offervisionsSchema} from './schema';
import {getTotalFrames} from './timing';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Offervisions"
			component={Offervisions}
			schema={offervisionsSchema}
			defaultProps={defaultProps}
			fps={FORMAT.fps}
			width={FORMAT.width}
			height={FORMAT.height}
			durationInFrames={getTotalFrames(defaultProps.script, FORMAT.fps, defaultProps.transitionFrames)}
			calculateMetadata={({props}) => ({
				durationInFrames: getTotalFrames(props.script, FORMAT.fps, props.transitionFrames),
			})}
		/>
	);
};
