import categoryRepository from "../repository/categoryRepository.mjs";

const categoryServiceImp = {
    async createCategory(categoryData) {
        const categoryName = categoryData.name.toUpperCase();
        const category = await categoryRepository.getCategoryByName(categoryName);
    
        if (category == null) {
            return await categoryRepository.createCategory(categoryData);
        }
        
        return category;
    },

    async getAllCategories() {
        return await categoryRepository.getAllCategories();
    },

    async deleteCategory(categoryId) {
        return await categoryRepository.deleteCategory(categoryId);
    }
};

export default categoryServiceImp;