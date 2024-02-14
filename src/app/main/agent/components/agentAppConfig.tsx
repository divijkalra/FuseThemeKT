import React from 'react';
import { Redirect } from 'react-router-dom';


const AgentAppConfig = {

	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/agent',
			component: React.lazy(() => import('./AgentPageLayout')),
			routes: [
				{
					path: '/agent/order',
					component: React.lazy(() => import('./order/Example'))
				},
				{
					path: '/order/:orderId',  // Specify a dynamic parameter ':orderId' for the order ID
					component: React.lazy(() => import('./order/OrderDetails'))
				},
				{
					path: '/agent',
					component: () => <Redirect to="/agent/order" />
				}]
		}


	]
};

export default AgentAppConfig;
