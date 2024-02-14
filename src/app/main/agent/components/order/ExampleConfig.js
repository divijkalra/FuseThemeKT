import React from 'react';
import { Redirect } from 'react-router-dom';

const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/orders',
            component: React.lazy(() => import('./Example'))
        },
        {
            path: '/order/:orderId',  // Specify a dynamic parameter ':orderId' for the order ID
            component: React.lazy(() => import('./OrderDetails'))
        }
    ]
};

export default ExampleConfig;
