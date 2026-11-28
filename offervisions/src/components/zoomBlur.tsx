import type {
	TransitionPresentation,
	TransitionPresentationComponentProps,
} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';

type Props = Record<string, never>;

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Outgoing scene pushes forward + blurs away; incoming scene settles in from slightly small. */
const ZoomBlurPresentation: React.FC<TransitionPresentationComponentProps<Props>> = ({
	children,
	presentationDirection,
	presentationProgress,
}) => {
	const p = ease(presentationProgress);
	const exiting = presentationDirection === 'exiting';
	return (
		<AbsoluteFill
			style={{
				opacity: exiting ? 1 - p : p,
				scale: String(exiting ? 1 + 0.18 * p : 0.88 + 0.12 * p),
				filter: `blur(${exiting ? p * 14 : (1 - p) * 14}px)`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const zoomBlur = (): TransitionPresentation<Props> => ({
	component: ZoomBlurPresentation,
	props: {},
});
