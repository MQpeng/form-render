import {
  deepCopy,
  deepGet,
  deepMerge,
  deepMergeKey,
  format,
  formatMask,
  FormatMaskOption,
} from './utils';

describe('abc: utils', () => {
  describe('#deepGet', () => {
    const tree = {
      response: {
        list: [],
        total: 10,
      },
      status: 'ok',
    };
    it('should be get [status]', () => {
      expect(deepGet(tree, ['status'])).toBe(tree.status);
    });
    it('should be get [response.total]', () => {
      expect(deepGet(tree, ['response', 'total'])).toBe(tree.response.total);
    });
    it('should be return default value when not exist key', () => {
      const def = 'aa';
      expect(deepGet(tree, ['status11'], def)).toBe(def);
    });
    it('should be return default value when not exist deep key', () => {
      const def = 'aa';
      expect(deepGet(tree, ['response', 'totala'], def)).toBe(def);
    });
    it('should be return default value when path is null', () => {
      const def = 'aa';
      expect(deepGet(tree, null, def)).toBe(def);
    });
    it('should be return default value when path is empty array', () => {
      const def = 'aa';
      expect(deepGet(tree, [], def)).toBe(def);
    });
    it('should be return default value when source object is null', () => {
      const def = 'aa';
      expect(deepGet(null, ['status11'], def)).toBe(def);
    });
    it('should be dot get', () => {
      expect(deepGet(tree, 'response.total')).toBe(tree.response.total);
    });
    it('should be string path', () => {
      expect(deepGet(tree, 'status')).toBe(tree.status);
    });
    it('should be return default value when paths include null value', () => {
      expect(deepGet({ res: {} }, 'res.address.city')).toBeUndefined();
    });
    it('should be get zero value', () => {
      const res = deepGet({ res: { zero: 0 } }, 'res.zero');
      expect(res).toBe(0);
    });
  });

  it('#deepCopy', () => {
    const a = { number: 1 };
    expect(deepCopy(a).number).toBe(a.number);
  });

  describe('#deepMerge', () => {
    let original: any;
    it('should working', () => {
      const fn1 = (): any => {};
      const fn2 = (): any => {};
      const time = new Date();
      original = {
        a: 1,
        b: { c: 'c' },
        fn: fn1,
        arr2: [],
        str: 'str',
        time,
        bool: true,
      };

      deepMerge(original, { b: { d: 'd' }, arr: [2], fn: fn2 });

      expect(original.b.c).toBe('c');
      expect(original.b.d).toBe('d');
      expect(original.fn).toBe(fn2);
      expect(original.arr.length).toBe(1);
      expect(original.arr2.length).toBe(0);
      expect(original.str).toBe('str');
      expect(original.time).toBe(time);
      expect(original.bool).toBe(true);
    });
    it('should be only object of original', () => {
      original = [];

      deepMerge(original, [1, 2], [3, 4]);

      expect(Array.isArray(original)).toBe(true);
      expect(original.length).toBe(0);
    });
    it('should support dynamic params', () => {
      original = { a: 1, b: 2 };

      deepMerge(original, { c: 3 }, { d: 4 });

      expect(original.a).toBe(1);
      expect(original.b).toBe(2);
      expect(original.c).toBe(3);
      expect(original.d).toBe(4);
    });
    it('should be null or undefined', () => {
      original = { a: null };

      deepMerge(original, { a: null, b: undefined });

      expect(original.a).toBe(null);
      expect(original.b).toBe(undefined);
      expect(original.c).toBe(undefined);
    });
    it('should be ingored null or undefined in objects arguments', () => {
      original = {};

      deepMerge(original, null, undefined);

      expect(Object.keys(original).length).toBe(0);
    });
  });

  describe('#deepMergeKey', () => {
    it('should be merge array', () => {
      const original = { arr: [1, 2] };
      deepMergeKey(original, false, { arr: [3] });
      expect(original.arr.length).toBe(3);
    });

    it('should be override array ', () => {
      const original = { arr: [1, 2] };
      deepMergeKey(original, true, { arr: [3] });
      expect(original.arr.length).toBe(1);
      expect(original.arr[0]).toBe(3);
    });
  });

  describe('#format', () => {
    [
      { s: 'this is ${name}', o: { name: 'asdf' }, r: 'this is asdf' },
      {
        s: 'this is ${name}, age: ${age}',
        o: { name: 'asdf', age: 10 },
        r: 'this is asdf, age: 10',
      },
    ].forEach((item) => {
      it(item.s, () => {
        expect(format(item.s, item.o)).toBe(item.r);
      });
    });
    it('should allow null string', () => {
      expect(format(null, {})).toBe('');
    });
    it('should be support non-exists obj value', () => {
      expect(format('this is ${name}', {})).toBe('this is ');
    });
    it('should be support invalid object (eg: null, undefined)', () => {
      expect(format('this is ${name}', null)).toBe('this is ');
      expect(format('this is ${name}', undefined)).toBe('this is ');
    });
    it('should be deep get value', () => {
      expect(
        format('this is ${user.name}', { user: { name: 'asdf' } }, true)
      ).toBe('this is asdf');
    });
  });

  describe('#formatMask', () => {
    const data: Array<{
      value: string;
      mask: string | FormatMaskOption;
      result: string;
    }> = [
      { value: '123', mask: '(###)', result: '(123)' },
      {
        value: '15900000000',
        mask: '+86 ###########',
        result: '+86 15900000000',
      },
      { value: '123', mask: '#-#-#', result: '1-2-3' },
      { value: '15900000000', mask: '999****9999', result: '159****0000' },
      { value: 'aBc', mask: 'UUU', result: 'ABC' },
      { value: 'ABc', mask: 'LLL', result: 'abc' },
      {
        value: '15900000000',
        mask: '+86 999-9999-9999',
        result: '+86 159-0000-0000',
      },
      { value: '1', mask: '900', result: '100' },
    ];
    for (const item of data) {
      it(`should be return ${item.result} when value is '${item.value}' and mask is '${item.mask}'`, () => {
        expect(formatMask(item.value, item.mask)).toBe(item.result);
      });
    }

    it('should be custom token', () => {
      expect(
        formatMask('你好123', {
          mask: 'CC999',
          tokens: {
            C: {
              pattern: /.*/,
              transform: (char) => (char === '你' ? 'N' : 'H'),
            },
          },
        })
      ).toBe('NH123');
    });

    it('should be return empty when is invalid string', () => {
      expect(formatMask(null as any, '#')).toBe('');
    });
  });
});
