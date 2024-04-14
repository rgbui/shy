import { lazy } from "react";
import { LazySingleton } from "rich/component/lib/Singleton";

export async function useOpenUserSettings(mode?: 'update' | 'price') {
    var us = await LazySingleton(lazy(() => import('./index')));
    us.open(mode);
}