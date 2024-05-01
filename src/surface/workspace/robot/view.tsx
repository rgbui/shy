import { lazy } from 'react';
import { LazySingleton } from 'rich/component/lib/Singleton';
import { RobotInfo } from 'rich/types/user';

export async function useOpenRobotSettings(robot: RobotInfo) {
    var popover = await LazySingleton(lazy(() => import('./src')));
    await popover.open(robot);
}