

/**
 * 打包发布的版本
 * dev 开发版
 * beta 测试版（线上的）
 * pro 正式版
 */
declare var MODE: 'pro' | 'dev' | 'beta';
declare var VERSION: string;
declare var API_MASTER_URLS: string;
declare var API_VERSION: string;

type ArrayOf<T> = T extends (infer p)[] ? p : never;

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>

declare module '*.svg' {
  const content: SvgrComponent
  export default content
}

// for style loader
declare module '*.css' {
  const styles: any
  export = styles
}


declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.gif';
declare module "*.md";

interface File {
  md5?: string
}

/**
 * 自动在HTMLElement上面申明一个接收拖放元素的函数
 */
interface HTMLElement {
  receive_drop_elements?: (type: 'pageItem', elements: any[]) => void;
}

/**
 * 申明一个全局的toast ，主要是对一些通知进行报警
 */
interface Window {
  Toast: {
    error(msg: string);
    warn(msg: string);
    success(msg: string);
  }
}


