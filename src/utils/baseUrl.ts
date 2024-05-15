import {
  API_DEV,
  API_LOCAL,
  API_PROD,
  UPLOAD_DEV,
  UPLOAD_PROD,
} from '@/dictionary';
import envVersion from '@/utils/version';

class BaseUrl {
  static instance: BaseUrl;
  private readonly url: string = '';
  private readonly upload_url: string = '';
  private readonly envVersion = envVersion;

  private constructor() {
    if (this.envVersion === 'develop') {
      this.url = API_LOCAL;
      this.upload_url = UPLOAD_DEV;
    }

    if (this.envVersion === 'trial') {
      this.url = API_DEV;
      this.upload_url = UPLOAD_DEV;
    }

    if (this.envVersion === 'release') {
      this.url = API_PROD;
      this.upload_url = UPLOAD_PROD;
    }
  }

  static getInstance() {
    if (!BaseUrl.instance) {
      BaseUrl.instance = new BaseUrl();
    }
    return BaseUrl.instance;
  }

  getBaseUrl() {
    return this.url;
  }

  getBaseUploadUrl() {
    return this.upload_url;
  }
}

export default BaseUrl;
