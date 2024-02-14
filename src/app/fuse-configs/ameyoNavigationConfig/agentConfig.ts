import INavigationConfig from './INavigationTemplate';

const agentConfig: INavigationConfig[] = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [

			{
				id: 'example-component',
				title: 'Order',
				translate: 'Order',
				type: 'item',
				icon: 'whatshot',
				url: '/agent/order'
			}
		]
	}
];

export default agentConfig;
