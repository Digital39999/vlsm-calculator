import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigation as useNavigationRemix } from '@remix-run/react';

const NavigationContext = createContext({ isLoading: false, currentPath: '' });

export function NavigationProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPath, setCurrentPath] = useState('');

	const transition = useNavigationRemix();

	useEffect(() => {
		if (transition.state === 'loading') {
			setIsLoading(true);
			setCurrentPath(transition.location.pathname);
		} else {
			setIsLoading(false);
		}
	}, [transition.state, transition.location]);

	return (
		<NavigationContext.Provider value={{ isLoading, currentPath }}>
			{children}
		</NavigationContext.Provider>
	);
}

export function useNavigation() {
	return useContext(NavigationContext);
}
