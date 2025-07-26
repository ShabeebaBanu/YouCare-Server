import Category from "../model/Category.mjs";

const categoryRepository = {

      async createCategory(categoryDate) {
        const category = new Category(categoryDate);
        return await category.save();
      },

      async getAllCategories() {
        return await Category.find({});
      },

      async getCategoryByName(categoryName) {
        return await Category.findOne({ name: categoryName })
      },

      async deleteCategory(categoryId) {
        return await Category.deleteOne({ _id: categoryId });
      }
}

export default categoryRepository;