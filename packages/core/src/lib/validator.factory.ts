import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { REGEX } from '../utils/validate';

import { ErrorData } from './errors';
import { FRConfig, FRValue } from './interface';
import { FRSchema } from './schema';
import { FRConfigServiceFactory } from './config.service';

export abstract class SchemaValidatorFactory {
  abstract createValidatorFn(
    schema: FRSchema,
    extraOptions: { ignoreKeywords: string[]; debug: boolean }
  ): (value: FRValue) => ErrorData[];
}

export class AjvSchemaValidatorFactory extends SchemaValidatorFactory {
  protected ajv!: Ajv;
  protected options!: FRConfig;
  constructor() {
    super();
    if (!(typeof document === 'object' && !!document)) {
      return;
    }
    this.options = FRConfigServiceFactory.getInstance().getSrc().getConfig();
    const customOptions = this.options.ajv || {};
    this.ajv = new Ajv({
      allErrors: true,
      loopEnum: 50,
      ...customOptions,
      formats: {
        'data-url': /^data:([a-z]+\/[a-z0-9-+.]+)?;name=(.*);base64,(.*)$/,
        color: REGEX.color,
        mobile: REGEX.mobile,
        'id-card': REGEX.idCard,
        ...customOptions.formats,
      },
    });
    addFormats(this.ajv as any);
  }

  createValidatorFn(
    schema: FRSchema,
    extraOptions: { ignoreKeywords: string[]; debug: boolean }
  ): (value: FRValue) => ErrorData[] {
    const ignoreKeywords: string[] = [
      ...(this.options.ignoreKeywords as string[]),
      ...((extraOptions.ignoreKeywords as string[]) || []),
    ];

    return (value: FRValue): ErrorData[] => {
      try {
        this.ajv.validate(schema, value);
      } catch (e) {
        if (extraOptions.debug) {
          console.warn(e);
        }
      }
      let errors = this.ajv.errors;
      if (this.options && ignoreKeywords && errors) {
        errors = errors.filter((w) => ignoreKeywords.indexOf(w.keyword) === -1);
      }
      return errors as ErrorData[];
    };
  }
}
