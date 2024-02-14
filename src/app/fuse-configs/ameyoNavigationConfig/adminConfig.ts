import INavigationConfig from './INavigationTemplate';

const adminConfig: INavigationConfig[] = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'ADMIN',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'example-component',
				title: 'Settings',
				translate: 'Settings',
				type: 'item',
				icon: 'whatshot',
				url: '/example'
			},
			{
				id: 'process',
				title: 'Process',
				translate: 'Process',
				type: 'item',
				icon: 'whatshot',
				url: '/admin'
			}
		]
	}
];

export default adminConfig;
