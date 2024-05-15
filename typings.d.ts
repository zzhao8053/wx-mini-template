declare module "*.css";
declare module "*.less";
declare module "*.png";
declare module "*.svg" {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>
  ): React.ReactElement;

  const url: string;
  // @ts-ignore
  export default url;
}

declare global {
  interface Window {
    wx: {
      login: () => void;
      config: (params: any) => void;
      ready: (params: any) => void;
      updateAppMessageShareData: (params: any) => void;
      updateTimelineShareData: (params: any) => void;
      checkJsApi: (params: any) => void;
      onMenuShareTimeline: (params: any) => void;
    };
  }
}

export {};
