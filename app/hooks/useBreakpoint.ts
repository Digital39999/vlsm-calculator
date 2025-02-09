import { useEffect, useState } from 'react';

const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
	'3xl': 1920,
	'4xl': 2560,
	'5xl': 3840,
	'6xl': 4096,
};

export default function useTailwindBreakpoint() {
	const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('default');

	const getBreakpoint = () => {
		const width = window.innerWidth;

		if (width >= breakpoints['6xl']) return '6xl';
		if (width >= breakpoints['5xl']) return '5xl';
		if (width >= breakpoints['4xl']) return '4xl';
		if (width >= breakpoints['3xl']) return '3xl';
		if (width >= breakpoints['2xl']) return '2xl';
		if (width >= breakpoints.xl) return 'xl';
		if (width >= breakpoints.lg) return 'lg';
		if (width >= breakpoints.md) return 'md';
		if (width >= breakpoints.sm) return 'sm';
		return 'default';
	};

	useEffect(() => {
		const updateBreakpoint = () => setCurrentBreakpoint(getBreakpoint());

		updateBreakpoint();
		window.addEventListener('resize', updateBreakpoint);

		return () => window.removeEventListener('resize', updateBreakpoint);
	}, []);

	return currentBreakpoint;

}
