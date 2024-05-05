import { lazy } from "react";
import { LazySingleton } from "rich/component/lib/Singleton";

export async function useLazyOpenWorkspaceSettings(mode?: string) {
    var popover = await LazySingleton(lazy(() => import('./index')));
    popover.open(mode);
}