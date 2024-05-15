export const STATIC_URL = "https://static.hbtv.com.cn/hbsredcross";

export const STATIC_URL_ICON = `${STATIC_URL}/icon`;

export const AMAP_kEY = "033e96c11712774788ed28f300c7a201";

export const QQMAP_KEY = "2GABZ-O6U65-BV3IT-QO2MM-DAQJS-H3B7I";

export const STATIC_URL_WEB_VIEW =
  process.env.NODE_ENV === "production"
    ? "https://act.hbsredcross.org.cn/app/h5"
    : "https://p2.hbtv.com.cn/app/red-cross-h5-test";

export const WEB_URL = {
  agreement: `${STATIC_URL_WEB_VIEW}/agreement`,
  privacy: `${STATIC_URL_WEB_VIEW}/privacy`,
  member: `${STATIC_URL_WEB_VIEW}/member`,
  volunteer: `${STATIC_URL_WEB_VIEW}/volunteer`,
  volunteerRule: `${STATIC_URL_WEB_VIEW}/volunteerRule`,
  serviceRule: `${STATIC_URL_WEB_VIEW}/serviceRule`,
  newsList: `${STATIC_URL_WEB_VIEW}/news/list`,
  newsDetail: `${STATIC_URL_WEB_VIEW}/news/detail`,
};
export const AGREEMENT_URL = WEB_URL.agreement;
export const PRIVACY_URL = WEB_URL.privacy;

export const DEFAULT_USER_AVATAR = `${STATIC_URL}/default/user_avatar.png`;
