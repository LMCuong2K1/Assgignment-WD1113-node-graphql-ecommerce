const slugify = require('slugify');
const Product = require('../../models/Product');

describe('Product Model', () => {
  describe('slug generation logic', () => {
    it('should generate correct slug from name using slugify', () => {
      const name = 'iPhone 15 Pro Max';
      const expectedSlug = slugify(name, { lower: true, strict: true });

      expect(expectedSlug).toBe('iphone-15-pro-max');
    });

    it('should handle special characters in name', () => {
      const name = 'Áo thun & Quần jean!';
      const slug = slugify(name, { lower: true, strict: true });

      expect(slug).toBe('ao-thun-and-quan-jean');
    });
  });

  describe('schema structure', () => {
    it('should have slug field defined', () => {
      const schema = Product.schema;
      expect(schema.paths.slug).toBeDefined();
    });

    it('should have pre-validate hook registered', () => {
      const schema = Product.schema;
      expect(schema.s.hooks._pres.get('validate')).toBeDefined();
    });
  });
});
