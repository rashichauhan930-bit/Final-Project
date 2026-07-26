const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Auto-generate slug from categoryName whenever it changes
categorySchema.pre('save', function (next) {
  if (this.isModified('categoryName')) {
    this.slug = slugify(this.categoryName, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
