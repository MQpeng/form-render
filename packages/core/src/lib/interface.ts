import { FRUISchemaItem } from './ui';
import type { Options as AjvOptions } from 'ajv';

export type FRLayout = 'horizontal' | 'vertical' | 'inline';

export type FRSize = 'small' | 'medium' | 'large';

export type FRAlign = 'start' | 'center' | 'end';

export type FRSizeLDSType = 'large' | 'default' | 'small';
export type FRSizeMDSType = 'middle' | 'default' | 'small';
export type FRSizeDSType = 'default' | 'small';

export type FRFormControlStatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'validating'
  | '';

export type FRClassType = string | string[] | Set<string> | FRClassInterface;
export interface FRClassInterface {
  [klass: string]: any;
}
export interface FRStyleInterface {
  [klass: string]: any;
}

export type FRValue = any;

export interface FRFormValueChange {
  path: string | null;
  pathValue: FRValue;
  value: FRValue;
}

export interface FRValueChange {
  /**
   * Always return complete data
   */
  value: FRValue;
  /**
   * Current triggered path
   */
  path: string | null;
  /**
   * Current path value
   */
  pathValue: FRValue;
}

export interface FRUpdateValueAndValidity {
  /**
   * 是否包含上级字段，默认：`false`
   */
  onlySelf?: boolean;
  /**
   * 是否触发值变更通知，默认：`true`
   */
  emitValueEvent?: boolean;
  /**
   * 是否触发校验，默认：`true`
   */
  emitValidator?: boolean;
  /**
   * 当前更新路径
   */
  updatePath?: string;
  /**
   * 当前更新路径对应值
   */
  updateValue?: FRValue | null;
}

export interface FRSchemaDefinition {
  [key: string]: FRSchema;
}

export interface FRSchemaEnum {
  [key: string]: any;

  /** 是否禁用状态 */
  disabled?: boolean;

  /** 文本 */
  label?: any;

  /** 文本 */
  title?: any;

  /** 值 */
  value?: any;

  /**
   * 主键，适用部分小部件数据键名，例如：`tree-select`
   */
  key?: any;

  /** 是否选中 */
  checked?: boolean;

  /**
   * 组名，适用部分允许组列表的小部件，例如：`select`
   * - 组对应的文本为 `label`
   * - `children` 为子项
   */
  group?: boolean;

  /**
   * Whether to hide item
   *
   * 是否隐藏项
   */
  hide?: boolean;

  isLeaf?: boolean;

  /** 组对应的子类 */
  children?: FRSchemaEnum[];
}

export type FRSchemaType =
  | 'number'
  | 'integer'
  | 'string'
  | 'boolean'
  | 'object'
  | 'array';

export type FRSchemaEnumType = FRSchemaEnum | number | string | boolean;

/**
 * JSON Schema Form 结构体
 *
 * **注意：** 所有结构都以标准为基准，除了 `ui` 属性为非标准单纯只是为了更好的开发
 */
export interface FRSchema {
  [key: string]: any;
  //////////// Any /////////////
  /**
   * 数据类型，支持 JavaScript 基础类型；注意项：
   *
   * - `integer` 表示整型，`number` 表示浮点型
   * - JSON 中 `date` 等同 `string` 类型
   * - 指定 `format` 标准参数可以自动适配渲染小部件
   * - 指定 `widget` 参数强制渲染小部件
   */
  type?: FRSchemaType;
  /**
   * 枚举，静态数据源，例如：`radio`、`checkbox` 等
   *
   * - `disabled` 属性表示：禁用状态
   * - `label` 属性表示：文本
   * - `value` 属性表示：返回值
   * - 基础数据类型数组会自动转化成 `FRSchemaEnum` 数组格式
   */
  enum?: FRSchemaEnumType[];
  //////////// 数值类型 /////////////
  /**
   * 最小值
   */
  minimum?: number;
  /**
   * 约束是否包括 `minimum` 值
   */
  exclusiveMinimum?: boolean;
  /**
   * 最大值
   */
  maximum?: number;
  /**
   * 约束是否包括 `maximum` 值
   */
  exclusiveMaximum?: boolean;
  /**
   * 倍数
   */
  multipleOf?: number;
  //////////// 字符串类型/////////////
  /**
   * 定义字符串的最大长度
   */
  maxLength?: number;
  /**
   * 定义字符串的最小长度
   */
  minLength?: number;
  /**
   * 验证输入字段正则表达式字符串
   */
  pattern?: string;
  //////////// 数组类型/////////////
  /**
   * 数组元素类型描述，只支持数组对象，若需要基础类型数组可通过其他部件支持
   *
   * ```json
   * items: {
   *   type: 'object',
   *   properties: {
   *     name: { type: 'string' },
   *     age: { type: 'number' }
   *   }
   * }
   * ```
   *
   * 结果
   *
   * ```json
   * [
   *   { "name": "cipchk1", "age": 18 },
   *   { "name": "cipchk2", "age": 16 }
   * ]
   * ```
   */
  items?: FRSchema;
  /**
   * 约束数组最小的元素个数
   * - `type="array"` 时有效
   */
  minItems?: number;
  /**
   * 约束数组最大的元素个数
   * - `type="array"` 时有效
   */
  maxItems?: number;
  /**
   * 约束数组每个元素都不相同
   * - `type="array"` 时有效
   */
  uniqueItems?: boolean;
  /**
   * 数组额外元素的校验规则
   */
  additionalItems?: FRSchema;
  //////////// 对象类型/////////////
  /**
   * 最大属性个数，必须是非负整数
   */
  maxProperties?: number;
  /**
   * 最小属性个数，必须是非负整数
   */
  minProperties?: number;
  /**
   * 必填项属性
   */
  required?: string[];
  /**
   * 定义属性
   */
  properties?: { [key: string]: FRSchema };
  //////////// 条件类/////////////
  // 未来可能被移除
  // dependencies?: { [key: string]: string[] | FRSchema };
  /**
   * 条件验证
   * - 必须包含 `properties` 节点
   *  - 键名必须是当前节点 `properties` 值之一
   *  - 利用 `enum` 属性表示条件值，支持 `$ANY$` 表示任意值
   * - 不支持跨 Schema 节点
   * - 当条件成功会执行 `then` 否则执行 `else`
   * - `if`和`then` 是必须同时出现，`else` 可选项
   */
  if?: FRSchema;
  /**
   * 条件成功时执行
   * - 只支持 `required` 参数，用于表示显示
   */
  then?: FRSchema;
  /**
   * 条件失败时执行
   * - 只支持 `required` 参数，用于表示显示
   */
  else?: FRSchema;
  //////////// 逻辑类/////////////
  /** **不建议** 使用，可用 `required` 替代 */
  allOf?: FRSchema[];
  /** **不建议** 使用，可用 `required` 和 `minProperties` 替代 */
  anyOf?: FRSchema[];
  /** 值必须是其中之一 */
  oneOf?: FRSchema[];
  //////////// 格式/////////////
  /**
   * 数据格式，[文档](http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3)
   * - `date-time` 日期时间，渲染为 `date`，[RFC3339](https://tools.ietf.org/html/rfc3339#section-5.6)
   * - `date`、`full-date` 日期，渲染为 `date`
   * - `time`、`full-time` 时间，渲染为 `time`
   * - `email` Email格式，渲染为 `autocomplete`
   * - 非标准：`week`，渲染为 `nz-week-picker`
   * - 非标准：`month`，渲染为 `nz-month-picker`
   * - `ip` IP地址，渲染为 `input`
   * - `uri` URL地址，渲染为 `upload`
   * - `mobile` 手机号
   * - `id-card` 身份证
   * - `color` 颜色值
   */
  format?: string;
  //////////// 注释/////////////
  /**
   * 属性描述，相当于 `label` 值，按以下规则展示：
   * - 当值为 `null`、`undefined` 时使用 `key` 替代
   * - 当值为 `''` 空字符串表示不展示 `label` 部分，例如：`checkbox` 可能需要
   */
  title?: string | null;
  /**
   * 属性目的性解释
   */
  description?: string;
  /**
   * 默认值
   */
  default?: any;
  /**
   * 是否只读状态
   */
  readOnly?: boolean;
  //////////// 其他/////////////
  //////////// Definitions /////////////
  // /** 指定 Schema JSON 模式，默认为：`http://json-schema.org/draft-07/schema` */
  // $schema?: string;
  /** 内部类型定义体 */
  definitions?: FRSchemaDefinition;
  /** 引用定义体 */
  $ref?: string;
  // $schema?: string;
  /** 针对开发者的注释，无任何意义，也不会被校验 */
  $comment?: string;
  //////////// 非标准/////////////
  /** **唯一非标准：** 指定UI配置信息，优先级高于 `sf` 组件 `ui` 属性值 */
  ui?: FRUISchemaItem | string;
}

export interface FRConfigFormatMap {
  'date-time': { widget?: string; showTime?: boolean; format?: string };
  date: { widget?: string; format?: string };
  'full-date': { widget?: string; format?: string };
  time: { widget?: string; format?: string };
  'full-time': { widget?: string; format?: string };
  week: { widget?: string; mode?: string; format?: string };
  month: { widget?: string; mode?: string; format?: string };
  uri: { widget?: string };
  email: { widget?: string; type?: string };
  color: { widget?: string; type?: string };
  '': { widget?: string };
}

export interface FRConfig {
  formatMap?: FRConfigFormatMap;
  /**
   * 是否忽略某些数据类型校验 `ERRORSDEFAULT`，默认：`[ 'type', 'enum' ]`
   *
   * - `type` 限定 Schema 中 `type` 类型
   * - `enum` 限定应当是预设定的枚举值之一
   */
  ignoreKeywords?: string[];
  /**
   * [ajv](https://ajv.js.org/options.html) 参数
   */
  ajv?: AjvOptions;
  /**
   * 是否实时校验，默认：`true`
   * - `true` 每一次都校验
   * - `false` 提交时校验
   */
  liveValidate?: boolean;
  /**
   * 指定表单 `autocomplete` 值，默认：`on`
   */
  autocomplete?: 'on' | 'off' | null;
  /**
   * 是否立即呈现错误视觉，默认：`false`
   */
  firstVisual?: boolean;
  /**
   * 是否只展示错误视觉不显示错误文本，默认：`false`
   */
  onlyVisual?: boolean;
  /**
   * 自定义通用错误信息，默认：`{}`
   */
  errors?: { [key: string]: string };
  /**
   * 默认全局布局，类型为：`SFUISchemaItem`，使用时加上可智能提示，例如：
   *
   * ```ts
   * ui: {} as SFUISchemaItem
   * ```
   */
  ui?: any;
  /**
   * 元素组件大小，用于 `nzSize` 值
   */
  size?: 'default' | 'large' | 'small';
  /**
   * 按钮风格，类型为：`SFButton`，使用时加上可智能提示，例如：
   *
   * ```ts
   * button: {} as SFButton
   * ```
   */
  button?: any;
  /**
   * date小部件：`type="string"` 且不指定 `schema.format` 和 `ui.format` 时日期格式，默认：`yyyy-MM-dd HH:mm:ss`
   */
  uiDateStringFormat?: string;
  /**
   * date小部件：`type="number"` 且不指定 `schema.format` 和 `ui.format` 时日期格式，默认：`T` 13位 Unix Timestamp
   */
  uiDateNumberFormat?: string;
  /**
   * time小部件：`type="string"` 且不指定 `schema.format` 和 `ui.format` 时日期格式，默认：`HH:mm:ss`
   */
  uiTimeStringFormat?: string;
  /**
   * time小部件：`type="number"` 且不指定 `schema.format` 和 `ui.format` 时日期格式，默认：`T` 13位 Unix Timestamp，日期统一使用 `1970-01-01`
   */
  uiTimeNumberFormat?: string;
  /**
   * 指定 `format: 'email'` 的默认Email后缀，默认：`['qq.com', '163.com', 'gmail.com', '126.com', 'aliyun.com']`
   */
  uiEmailSuffixes?: string[];
  /**
   * Whether to delay rendering, should be manually call `refreshSchema()`
   *
   * 是否延迟渲染，需要手动调用 `refreshSchema()`
   */
  delay?: boolean;
}
