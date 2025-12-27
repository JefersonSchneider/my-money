export function SelectTab(tabId: string) {
    console.log(tabId);
    return {
        type: 'TAB_SELECTED',
        payload: tabId
    };
}