import { ThemeToggle } from '~/components/ThemeToggle';
import { Separator } from '~/components/ui/separator';
import { Link } from '@remix-run/react';
import { cn } from '~/lib/utils';

export type LayoutProps = {
	children: React.ReactNode;
	showFooter?: boolean;
};

export function Layout({ children, showFooter = true }: LayoutProps) {
	return (
		<div className='flex flex-col min-h-screen overflow-hidden'>
			<div className={cn('flex flex-col flex-grow w-full', showFooter ? '' : 'min-h-screen')}>
				<Header className='sticky top-0 z-50 bg-background px-4 pl-2 sm:px-6 py-2' fixed offset={10}>
					<div className='flex justify-between items-center w-full'>
						<div className='flex items-center space-x-2'>
							<Link to='/' className='flex items-center space-x-2 px-2 rounded-md hover:bg-muted-foreground/20 transition-all'>
								<img src='/logo.webp' alt='Logo' className='h-8 w-8 object-cover rounded-full hover:rotate-180 transition-all duration-300' />
								<h1 className='text-lg font-bold text-primary-foreground'>VLSM Calculator</h1>
							</Link>
						</div>

						<div className='flex items-center space-x-2'>
							<ThemeToggle />
						</div>
					</div>
				</Header>

				<div className='overflow-hidden px-4 sm:px-6 h-full w-full flex-grow'>
					{children}
				</div>
			</div>
		</div>
	);
}

export type HeaderProps = {
	children: React.ReactNode;
	className?: string;
	fixed?: boolean;
	offset?: number;
	separator?: boolean;
};

export function Header({ children, className, fixed, offset = 0, separator, ...props }: HeaderProps) {
	return (
		<header
			className={cn(
				'flex items-center gap-3 sm:gap-4 bg-background !pt-4 !mt-0 w-full transition-all',
				fixed && 'fixed top-0 left-0 w-full z-50 rounded-md',
				offset > 10 && fixed ? 'shadow-lg' : 'shadow-none',
				fixed ? 'backdrop-blur-md' : '',
				className,
			)}
			{...props}
		>
			{separator && <Separator orientation='vertical' className='h-6' />}
			{children}
		</header>
	);
}
