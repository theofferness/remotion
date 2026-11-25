import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {FORMAT} from './config';
import {Offervisions} from './Offervisions';
import {Ch00Cover1} from './reels/ch00/Cover1';
import {Ch00Video1, getV1Duration, V1_FPS} from './reels/ch00/Video1';
import {Ch00Cover2} from './reels/ch00/Cover2';
import {INTRO_FRAMES, LogoIntro} from './reels/kit/LogoIntro';
import {PaletteProvider} from './reels/kit/palette';
import {SEASONS} from './reels/kit/series';
import {AvatarOptions} from './reels/kit/AvatarOptions';
import {Ch00Video2, getV2Duration, V2_FPS} from './reels/ch00/Video2';
import {Ch00Cover3} from './reels/ch00/Cover3';
import {Ch00Video3, getV3Duration, V3_FPS} from './reels/ch00/Video3';
import {defaultProps, offervisionsSchema} from './schema';
import {getTotalFrames} from './timing';

/**
 * The video currently in production. `npx remotion render src/index.ts Master out/video.mp4`
 * renders whatever this points to – update it when a new Reel goes into production.
 */
const MASTER = {component: Ch00Video3, fps: V3_FPS, durationInFrames: getV3Duration(V3_FPS)};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="Master" component={MASTER.component} fps={MASTER.fps} width={1080} height={1920} durationInFrames={MASTER.durationInFrames} />
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
			<Folder name="Brand">
				<Composition
					id="Logo-Intro"
					component={() => (
						<PaletteProvider palette={SEASONS.winter}>
							<LogoIntro fadeOut={false} />
						</PaletteProvider>
					)}
					fps={30}
					width={1080}
					height={1920}
					durationInFrames={INTRO_FRAMES}
				/>
				<Composition id="Avatar-Options" component={AvatarOptions} fps={30} width={1920} height={1080} durationInFrames={150} />
				<Composition
					id="Avatar-Page-Variations"
					component={AvatarOptions}
					defaultProps={{order: ['page', 'cover', 'bookmark', 'dogear', 'roof', 'origami'], subtitle: 'variations on Page', firstLabel: 'YOUR PICK · '}}
					fps={30}
					width={1920}
					height={1080}
					durationInFrames={150}
				/>
			</Folder>
			<Folder name="Ch00-Introduction">
				<Composition
					id="Ch00-Video1-Trailer"
					component={Ch00Video1}
					fps={V1_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV1Duration(V1_FPS)}
				/>
				<Composition
					id="Ch00-Video1-15s"
					component={Ch00Video1}
					defaultProps={{cut: 'cut15' as const}}
					fps={V1_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV1Duration(V1_FPS, 'cut15')}
				/>
				<Still id="Ch00-Video1-Cover" component={Ch00Cover1} width={1080} height={1920} />
				<Composition id="Ch00-Video2-Main" component={Ch00Video2} fps={V2_FPS} width={1080} height={1920} durationInFrames={getV2Duration(V2_FPS)} />
				<Composition
					id="Ch00-Video2-Main-WithIntro"
					component={Ch00Video2}
					defaultProps={{intro: true}}
					fps={V2_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV2Duration(V2_FPS) + INTRO_FRAMES}
				/>
				<Composition
					id="Ch00-Video2-30s"
					component={Ch00Video2}
					defaultProps={{cut: 'cut30' as const}}
					fps={V2_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV2Duration(V2_FPS, 'cut30')}
				/>
				<Composition
					id="Ch00-Video2-15s"
					component={Ch00Video2}
					defaultProps={{cut: 'cut15' as const}}
					fps={V2_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV2Duration(V2_FPS, 'cut15')}
				/>
				<Still id="Ch00-Video2-Cover" component={Ch00Cover2} width={1080} height={1920} />
				<Composition id="Ch00-Video3-FollowUp" component={Ch00Video3} fps={V3_FPS} width={1080} height={1920} durationInFrames={getV3Duration(V3_FPS)} />
				<Composition
					id="Ch00-Video3-15s"
					component={Ch00Video3}
					defaultProps={{cut: 'cut15' as const}}
					fps={V3_FPS}
					width={1080}
					height={1920}
					durationInFrames={getV3Duration(V3_FPS, 'cut15')}
				/>
				<Still id="Ch00-Video3-Cover" component={Ch00Cover3} width={1080} height={1920} />
			</Folder>
		</>
	);
};
