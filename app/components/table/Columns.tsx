'use client';

import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './Header';
import { Host } from '~/other/types';

export const networkColumns: ColumnDef<Jsonify<Host>>[] = [{
	accessorKey: 'name',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Name' />
	),
	cell: ({ row }) => (
		<div className='flex w-[100px] items-center'>
			<span className='capitalize'>{row.original.name}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'hostsNeeded',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Hosts Needed' />
	),
	cell: ({ row }) => (
		<div className='flex w-[40px] items-center'>
			<span className='capitalize'>{row.original.hostsNeeded}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'hostsAvailable',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Hosts Available' />
	),
	cell: ({ row }) => (
		<div className='flex w-[40px] items-center'>
			<span className='capitalize'>{row.original.hostsAvailable}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'unusedHosts',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Unused Hosts' />
	),
	cell: ({ row }) => (
		<div className='flex w-[40px] items-center'>
			<span className='capitalize'>{row.original.unusedHosts}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'networkAddress',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Network' />
	),
	cell: ({ row }) => (
		<div className='flex w-[100px] items-center'>
			<span className='capitalize'>{row.original.networkAddress}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'broadcastAddress',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Broadcast' />
	),
	cell: ({ row }) => (
		<div className='flex w-[100px] items-center'>
			<span className='capitalize'>{row.original.broadcastAddress}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'subnetSlash',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Slash' />
	),
	cell: ({ row }) => (
		<div className='flex w-[40px] items-center'>
			<span className='capitalize'>/{row.original.subnetSlash}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'subnetMask',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Subnet' />
	),
	cell: ({ row }) => (
		<div className='flex w-[100px] items-center'>
			<span className='capitalize'>{row.original.subnetMask}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'wildcardMask',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Wildcard' />
	),
	cell: ({ row }) => (
		<div className='flex w-[100px] items-center'>
			<span className='capitalize'>{row.original.wildcardMask}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'usableRange',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Usable Range' />
	),
	cell: ({ row }) => (
		<div className='flex w-full items-center'>
			<span className='capitalize'>{row.original.usableRange.start} - {row.original.usableRange.end}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}, {
	accessorKey: 'networkRange',
	header: ({ column }) => (
		<DataTableColumnHeader column={column} title='Network Range' />
	),
	cell: ({ row }) => (
		<div className='flex w-full items-center'>
			<span className='capitalize'>{row.original.networkRange.start} - {row.original.networkRange.end}</span>
		</div>
	),
	enableHiding: false,
	enableSorting: false,
}];
