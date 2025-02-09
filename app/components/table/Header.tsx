import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { FaArrowDown, FaArrowUp, FaEyeSlash, FaSort } from 'react-icons/fa';
import { Button } from '~/components/ui/button';
import { Column } from '@tanstack/react-table';
import { cn } from '~/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='-ml-3 h-8 data-[state=open]:bg-accent'
					>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<FaArrowDown />
						) : column.getIsSorted() === 'asc' ? (
							<FaArrowUp />
						) : (
							<FaSort />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<FaArrowUp className='text-muted-foreground/70' />
						Ascend
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<FaArrowDown className='text-muted-foreground/70' />
						Descend
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.getIsSorted() ? column.toggleSorting() : null}>
						<FaSort className='text-muted-foreground/70' />
						Reset
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<FaEyeSlash className='text-muted-foreground/70' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
