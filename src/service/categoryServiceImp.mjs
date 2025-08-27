import categoryRepository from "../repository/categoryRepository.mjs";

const categoryServiceImp = {
    async createCategory(categoryData) {
        console.log("inside create category");
        if (!categoryData || !categoryData.name) {
            throw new Error("Invalid category Data: Missing 'name'");
        }

        const categoryName = categoryData.name.trim().toUpperCase();

        try {
            console.log("Creating new category:", categoryName);
            return await categoryRepository.createCategory(categoryData);     
        } catch (err) {
            console.error("Error creating Category:", err);
            throw new Error("Unexpected error while creating category"); 
        }
    },

    async getAllCategories() {
        return await categoryRepository.getAllCategories();
    },

    async deleteCategory(categoryId) {
        return await categoryRepository.deleteCategory(categoryId);
    },

    async isCategoryExistByName(categoryName) {
        const category = await categoryRepository.getCategoryByName(categoryName);

        if (category) {
            console.log("Category Already Available with Name : ", category.name);
            return category;
        }

        console.log("No Category Available with Name :", categoryName);
        return category;
    }
};

export default categoryServiceImp;