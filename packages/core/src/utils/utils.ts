import { cloneDeep, get } from 'lodash-es';

/**
 * Base on [lodash](https://lodash.com/docs/4.17.15#cloneDeep) cloneDeep
 */
export function deepCopy(from: any) {
  return cloneDeep(from);
}

export function deepGet(
  obj: any,
  path: string | string[] | null | undefined,
  defaultValue?: unknown
) {
  if (!obj || path == null || path.length === 0) return defaultValue;
  return get(obj, path, defaultValue);
}

/**
 * Deep merge object.
 *
 * 深度合并对象
 *
 * @param original 原始对象
 * @param arrayProcessMethod 数组处理方式
 *  - `true` 表示替换新值，不管新值为哪种类型
 *  - `false` 表示会合并整个数组（将旧数据与新数据合并成新数组）
 * @param objects 要合并的对象
 */
export function deepMergeKey(
  original: unknown,
  arrayProcessMethod: boolean,
  ...objects: any[]
): any {
  if (Array.isArray(original) || typeof original !== 'object') return original;

  const isObject = (v: unknown): boolean => typeof v === 'object';

  const merge = (target: any, obj: any): any => {
    Object.keys(obj)
      .filter(
        (key) =>
          key !== '__proto__' && Object.prototype.hasOwnProperty.call(obj, key)
      )
      .forEach((key) => {
        const fromValue = obj[key];
        const toValue = target[key];
        if (Array.isArray(toValue)) {
          target[key] = arrayProcessMethod
            ? fromValue
            : [...toValue, ...fromValue];
        } else if (typeof fromValue === 'function') {
          target[key] = fromValue;
        } else if (
          fromValue != null &&
          isObject(fromValue) &&
          toValue != null &&
          isObject(toValue)
        ) {
          target[key] = merge(toValue, fromValue);
        } else {
          target[key] = deepCopy(fromValue);
        }
      });
    return target;
  };

  objects
    .filter((v) => v != null && isObject(v))
    .forEach((v) => merge(original, v));

  return original;
}

/**
 * Deep merge object.
 *
 * 深度合并对象
 */
export function deepMerge(original: unknown, ...objects: unknown[]): any {
  return deepMergeKey(original, false, ...objects);
}

export function isBlank(o: any): boolean {
  return o == null;
}

export function toBoolean(
  value: unknown,
  defaultValue: boolean | null | undefined = false
): boolean | null | undefined {
  return value == null ? defaultValue : `${value}` !== 'false';
}

export function toNumber(value: unknown): number;
export function toNumber<D>(value: unknown, fallback: D): number | D;
export function toNumber(value: unknown, fallbackValue: number = 0): number {
  return !isNaN(parseFloat(value as any)) && !isNaN(Number(value))
    ? Number(value)
    : fallbackValue;
}

/**
 * String formatting
 *
 * 字符串格式化
 * ```
 * format('this is ${name}', { name: 'asdf' })
 * // output: this is asdf
 * format('this is ${user.name}', { user: { name: 'asdf' } }, true)
 * // output: this is asdf
 * ```
 */
export function format(
  str: string | null | undefined,
  obj: any | null | undefined,
  needDeepGet: boolean = false
): string {
  return (str || '').replace(/\${([^}]+)}/g, (_work: string, key: string) =>
    needDeepGet ? deepGet(obj, key.split('.'), '') : (obj || {})[key] || ''
  );
}

export interface FormatMaskOption {
  mask: string;
  tokens?: { [key: string]: FormatMaskToken };
}

export interface FormatMaskToken {
  pattern: RegExp;
  default?: any;
  transform?: (char: string) => string;
}

/**
 * Format mask
 *
 * 格式化掩码
 *
 * | 字符 | 描述 |
 * | --- | --- |
 * | `0` | 任意数字，若该位置字符不符合，则默认为 `0` 填充 |
 * | `9` | 任意数字 |
 * | `#` | 任意字符 |
 * | `U` | 转换大写 |
 * | `L` | 转换小写 |
 * | `*` | 转换为 `*` 字符 |
 *
 * ```ts
 * formatMask('123', '(###)') => (123)
 * formatMask('15900000000', '999****9999') => 159****0000
 * ```
 */
export function formatMask(
  value: string,
  option: string | FormatMaskOption
): string {
  if (!value) {
    return '';
  }
  const opt: FormatMaskOption = {
    ...(typeof option === 'string' ? { mask: option } : option),
  };
  const tokens: { [key: string]: FormatMaskToken } = {
    '0': { pattern: /\d/, default: '0' },
    '9': { pattern: /\d/ },
    '#': { pattern: /[a-zA-Z0-9]/ },
    U: {
      pattern: /[a-zA-Z]/,
      transform: (char) => char.toLocaleUpperCase(),
    },
    L: {
      pattern: /[a-zA-Z]/,
      transform: (char) => char.toLocaleLowerCase(),
    },
    '*': {
      pattern: /.*/,
      transform: (_) => `*`,
    },
    ...opt.tokens,
  };

  const splitValue = value.split('');
  return opt.mask
    .split('')
    .reduce((res, cur) => {
      const token = tokens[cur];
      if (!token) {
        res.push(cur);
        return res;
      }

      const value = splitValue.shift() ?? '';
      if (!token.pattern.test(value)) {
        if (token.default) res.push(token.default);
        return res;
      }

      if (typeof token.transform === 'function') {
        res.push(token.transform(value));
      } else {
        res.push(value);
      }
      return res;
    }, [] as string[])
    .join('');
}
