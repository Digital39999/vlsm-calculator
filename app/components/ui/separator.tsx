import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '~/lib/utils';
import * as React from 'react';

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
	(
		{ className, orientation = 'horizontal', decorative = true, ...props },
		ref,
	) => (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn(
				'shrink-0 bg-zinc-200 dark:bg-zinc-800',
				orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
				className,
			)}
			{...props}
		/>
	),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;


const SeparatorWithText = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
		text: string;
	}
>(
	(
		{ className, orientation = 'horizontal', decorative = true, text, ...props },
		ref,
	) => (
		<div className='flex items-center gap-2 w-full'>
			<Separator
				ref={ref}
				decorative={decorative}
				orientation={orientation}
				className={cn(
					'shrink-0 bg-zinc-200 dark:bg-zinc-800 flex-1',
					orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
					className,
				)}
				{...props}
			/>
			<p className='text-sm text-zinc-500 dark:text-zinc-400'>{text}</p>
			<Separator
				ref={ref}
				decorative={decorative}
				orientation={orientation}
				className={cn(
					'shrink-0 bg-zinc-200 dark:bg-zinc-800 flex-1',
					orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
					className,
				)}
				{...props}
			/>
		</div>
	),
);
SeparatorWithText.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, SeparatorWithText };
