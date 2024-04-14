import { lazy } from "react";
import { LazySingleton } from "rich/component/lib/Singleton";

export async function useLazyOpenWorkspaceSettings(mode?: string) {
    var popover = await LazySingleton(lazy(() => import('./index')));
    console.log(popover);
    popover.open(mode);
}