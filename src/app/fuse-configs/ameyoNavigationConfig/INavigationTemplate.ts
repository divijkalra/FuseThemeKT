export interface INavigationConfig {
    id: string,
    title: string,
    translate?: string,
    type: 'group' | 'collapse' | 'item' | 'divider',
    icon?: string,
    children?: INavigationConfig[],
    exact?: boolean
    url?: string,
    badge?: { title: string, bg: string, fg: string }
}
export default INavigationConfig;