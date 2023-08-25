import { SchemaValidatorFactory } from './validator.factory';

export const SF_SEQ = '/';

export abstract class FormProperty {
  constructor(schemaValidatorFactory: SchemaValidatorFactory) {
    schemaValidatorFactory;
  }
}

export abstract class PropertyGroup extends FormProperty {}
