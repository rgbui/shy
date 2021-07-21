

/**
 * 打包发布的版本
 * dev 开发版
 * beta 测试版（线上的）
 * pro 正式版
 */
declare var MODE: 'pro' | 'dev' | 'beta';
declare var VERSION: string;
declare var REMOTE_URL:string;
type ArrayOf<T> = T extends (infer p)[] ? p : never;

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>

declare module '*.svg' {
  const content: SvgrComponent
  export default content
}

declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.webp';


interface File{
   md5?:string
}


