import { deepMergeKey } from '../utils/utils';
import { FRConfig } from './interface';
import { FRUISchemaItem } from './ui';

export const SF_DEFAULT_CONFIG: FRConfig = {
  formatMap: {
    'date-time': {
      widget: 'date',
      showTime: true,
      format: `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`,
    },
    date: { widget: 'date', format: 'yyyy-MM-dd' },
    'full-date': { widget: 'date', format: 'yyyy-MM-dd' },
    time: { widget: 'time', format: 'HH:mm:ss.SSSxxx' },
    'full-time': { widget: 'time' },
    week: { widget: 'date', mode: 'week', format: 'yyyy-ww' },
    month: { widget: 'date', mode: 'month', format: 'yyyy-MM' },
    uri: { widget: 'upload' },
    email: { widget: 'autocomplete', type: 'email' },
    color: { widget: 'string', type: 'color' },
    '': { widget: 'string' },
  },
  ignoreKeywords: ['type', 'enum'],
  liveValidate: true,
  autocomplete: null,
  firstVisual: false,
  onlyVisual: false,
  errors: {},
  ui: {} as FRUISchemaItem,
  button: { submit_type: 'primary', reset_type: 'default' },
  uiDateStringFormat: 'yyyy-MM-dd HH:mm:ss',
  uiDateNumberFormat: 'T',
  uiTimeStringFormat: 'HH:mm:ss',
  uiTimeNumberFormat: 'T',
  uiEmailSuffixes: ['qq.com', '163.com', 'gmail.com', '126.com', 'aliyun.com'],
  delay: false,
};

export type FRConfigKey = keyof FRConfig;

export class FRConfigService {
  private config: FRConfig;

  constructor(defaultConfig?: FRConfig) {
    this.config = { ...defaultConfig };
  }

  getConfig(): FRConfig {
    return this.config;
  }

  get<T extends FRConfigKey>(key: T): FRConfig[T] {
    return this.config[key];
  }

  merge<T extends FRConfigKey>(
    ...defaultValues: Array<FRConfig[T]>
  ): FRConfig[T] {
    return deepMergeKey({}, true, ...defaultValues, this.config);
  }

  set<T extends FRConfigKey>(key: FRConfig[T], value: any): void {
    this.config[key] = value;
  }
}

export class FRConfigServiceFactory {
  static instance: FRConfigServiceFactory;

  private src: FRConfigService;
  private constructor() {
    this.src = new FRConfigService();
  }

  public static getInstance(): FRConfigServiceFactory {
    if (!FRConfigServiceFactory.instance) {
      FRConfigServiceFactory.instance = new FRConfigServiceFactory();
    }
    return FRConfigServiceFactory.instance;
  }

  setService(src: FRConfigService) {
    this.src = src;
  }

  getSrc() {
    return this.src;
  }
}
