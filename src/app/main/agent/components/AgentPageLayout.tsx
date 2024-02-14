import React from 'react'
import FuseSuspense from '@fuse/core/FuseSuspense';
import { renderRoutes } from 'react-router-config';


export default function AgentPageLayout({ content, route }: any) {
    return (
        <FuseSuspense>{renderRoutes(route.routes)}</FuseSuspense>
    )
}
