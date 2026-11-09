import React, { Suspense } from 'react';

// Tail feathers as [angle, color]. The front view's fan is painted outside-in so the middle feather
// sits on top; the side view's rises behind the turkey's back.
const FRONT_FEATHERS = [[-72, 'red'], [72, 'red'], [-48, 'orange'], [48, 'orange'], [-24, 'gold'], [24, 'gold'], [0, 'red']];
const SIDE_FEATHERS = [[-80, 'red'], [-58, 'orange'], [-36, 'gold'], [-14, 'orange'], [8, 'red']];
const LEG = 'M0 0 L0 9.5 M-1.6 11.2 L0 9.5 L4 10.8 M0 9.5 L2.6 12';

const Feather = ({ className, angle, color, delay }) => (
    <g className={`${className} turkey-${color}`} style={{ '--a': `${angle}deg`, animationDelay: delay }}>
        <path d='M0 -2 C-6 -8 -6.5 -21 0 -26 C6.5 -21 6 -8 0 -2 Z' />
        <path className='turkey-feather-tip' d='M0 -17 C-3.2 -19 -3.4 -23.5 0 -25.5 C3.4 -23.5 3.2 -19 0 -17 Z' />
    </g>
);

// Facing you: fans its tail, bobs its head and blinks.
const FrontTurkey = () => (
    <g className='turkey-front'>
        <g className='turkey-bird'>
            <g transform='translate(32 40)'>
                {FRONT_FEATHERS.map(([angle, color]) => (
                    // Outer feathers start later, so the tail opens like a wave
                    <Feather key={angle} className='turkey-feather' angle={angle} color={color} delay={`${Math.abs(angle) * 2}ms`} />
                ))}
            </g>
            <g className='turkey-foot'>
                <path d='M28.5 53.5 L28.5 59 M26 60.5 L28.5 59 L31 60.5 M28.5 59 L28.5 61' />
            </g>
            <g className='turkey-foot right'>
                <path d='M35.5 53.5 L35.5 59 M33 60.5 L35.5 59 L38 60.5 M35.5 59 L35.5 61' />
            </g>
            <ellipse className='turkey-body' cx='32' cy='43' rx='11' ry='12' />
            <ellipse className='turkey-belly' cx='32' cy='46' rx='7' ry='8' />
            <g transform='rotate(18 23.5 45)'>
                <ellipse className='turkey-wing' cx='23.5' cy='45' rx='3.5' ry='6.5' />
            </g>
            <g transform='rotate(-18 40.5 45)'>
                <ellipse className='turkey-wing right' cx='40.5' cy='45' rx='3.5' ry='6.5' />
            </g>
            <g className='turkey-head'>
                <ellipse className='turkey-body' cx='32' cy='32.5' rx='4.5' ry='6' />
                <circle className='turkey-face' cx='32' cy='26' r='6.5' />
                <g className='turkey-eyes'>
                    <circle className='turkey-eye-white' cx='29.6' cy='24.8' r='1.9' />
                    <circle className='turkey-eye-white' cx='34.4' cy='24.8' r='1.9' />
                    <circle className='turkey-pupil' cx='29.9' cy='25.1' r='1' />
                    <circle className='turkey-pupil' cx='34.1' cy='25.1' r='1' />
                </g>
                <path className='turkey-beak' d='M30.2 27.3 L33.8 27.3 L32 30.6 Z' />
                <path className='turkey-wattle' d='M32.8 28.6 C35.2 30.4 35.4 34.2 33.6 35.2 C32.2 34.4 32 30.8 32.8 28.6 Z' />
            </g>
        </g>
    </g>
);

// Running to the right: legs pumping, wing flapping, head bobbing, dust and speed lines behind,
// skid dust in front when it brakes. CSS mirrors it to run left.
const SideTurkey = () => (
    <g className='turkey-side'>
        <g className='turkey-dust'>
            <circle cx='19' cy='59' r='2.2' />
            <circle cx='14' cy='58' r='1.6' />
        </g>
        <g className='turkey-speed'>
            <path d='M6 47 L15 47' />
            <path d='M3 51 L13 51' />
            <path d='M7 55 L15 55' />
        </g>
        <g className='turkey-skid'>
            <circle cx='40' cy='59' r='2.4' />
            <circle cx='44.5' cy='58' r='1.8' />
            <circle cx='36.5' cy='60' r='1.6' />
        </g>
        <g className='turkey-side-bird'>
            <g transform='translate(24 39) scale(0.85)'>
                {SIDE_FEATHERS.map(([angle, color]) => (
                    <Feather key={angle} className='turkey-side-feather' angle={angle} color={color} />
                ))}
            </g>
            <g transform='translate(30 48)'>
                <g className='turkey-leg back'><path d={LEG} /></g>
            </g>
            <g transform='translate(34 48)'>
                <g className='turkey-leg'><path d={LEG} /></g>
            </g>
            <ellipse className='turkey-body' cx='32' cy='41' rx='13' ry='10.5' />
            <ellipse className='turkey-belly' cx='35' cy='45' rx='8' ry='5.5' />
            <g transform='rotate(-8 30 40.5)'>
                <ellipse className='turkey-side-wing' cx='30' cy='40.5' rx='8.5' ry='5' />
            </g>
            <ellipse className='turkey-body' cx='42' cy='31' rx='3.8' ry='7' transform='rotate(20 42 31)' />
            <g className='turkey-side-head'>
                <circle className='turkey-face' cx='45.5' cy='23.5' r='5.2' />
                <circle className='turkey-eye-white' cx='47.2' cy='22.3' r='1.7' />
                <circle className='turkey-pupil' cx='47.8' cy='22.5' r='0.9' />
                <path className='turkey-beak' d='M49.8 22.6 L55 24.4 L49.8 26.2 Z' />
                <path className='turkey-side-wattle' d='M49.4 25.6 C51.4 27.4 51 31 49.4 31.6 C48.2 30.6 48.4 27.4 49.4 25.6 Z' />
            </g>
        </g>
    </g>
);

// Cartoon dust cloud that hides the swap between the side and front views at each hop-turn.
const Poof = () => (
    <g className='turkey-poof'>
        <path className='turkey-sparks' d='M32 16 L32 10 M49 22 L53 17 M15 22 L11 17 M55 40 L61 40 M9 40 L3 40' />
        <circle cx='32' cy='36' r='11' />
        <circle cx='22' cy='44' r='9' />
        <circle cx='42' cy='44' r='9' />
        <circle cx='26' cy='52' r='7.5' />
        <circle cx='38' cy='52' r='7.5' />
    </g>
);

// Flat loading indicator. Block spinners run back and forth across a track three turkeys wide, hop-turning to
// face you and strut at each end; inline ones strut in place. Animations live in App.css under TURKEY SPINNER.
const SvgTurkeySpinner = ({ size, inline, style }) => {
    const width = inline ? size : size * 3;
    return (
        <div
            className={inline ? 'turkey-spinner inline' : 'turkey-spinner running'}
            style={{ width, height: size, '--size': `${size}px`, '--run': `${width - size}px`, ...style }}
            role='status'
            aria-label='Loading'
        >
            <svg viewBox='0 0 64 64' width={size} height={size} aria-hidden='true'>
                <ellipse className='turkey-shadow' cx='32' cy='61.5' rx='14' ry='2' />
                {inline ? <FrontTurkey /> : (
                    <>
                        <g className='turkey-side-show'>
                            <g className='turkey-side-pose'><SideTurkey /></g>
                        </g>
                        <g className='turkey-front-show'>
                            <g className='turkey-front-pose'><FrontTurkey /></g>
                        </g>
                        <Poof />
                    </>
                )}
            </svg>
        </div>
    );
};

// The block spinner is the 3D turkey; the flat one shows without WebGL, for inline spinners and for people who
// prefer reduced motion. Its code (with three.js) starts loading when the app does, so it's usually ready before the
// first loader shows; the browser caches it after that. If it can't load, the flat turkey shows instead.
const turkey3D = import('./turkey3d').catch(() => ({ default: ({ fallback }) => fallback }));
const Turkey3D = React.lazy(() => turkey3D);
const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const TurkeySpinner = ({ size = 64, inline = false, style }) => {
    const flat = <SvgTurkeySpinner size={size} inline={inline} style={style} />;
    if (inline || prefersReducedMotion()) {
        return flat;
    }
    // While three.js downloads, hold the 3D turkey's space empty: showing the flat turkey there flashed its
    // dust poof and then jumped to the 3D one
    const loading = <div className='turkey-spinner running' style={{ width: size * 3, height: Math.round(size * 1.2), ...style }} role='status' aria-label='Loading' />;
    return (
        <Suspense fallback={loading}>
            <Turkey3D size={size} style={style} fallback={flat} />
        </Suspense>
    );
};
