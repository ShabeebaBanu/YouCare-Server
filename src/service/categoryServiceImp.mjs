import categoryRepository from "../repository/categoryRepository.mjs";

const categoryServiceImp = {
    async createCategory(categoryData) {
        try {
            return await categoryRepository.createCategory(categoryData);     
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error occured while Creating Category";
            throw new Error(errorMessage); 
        }
    },

    async getAllCategories() {
        try{
           return await categoryRepository.getAllCategories();
        } catch (error) {
            const errorMessage = error.message || "Unexpected Error Occured While Fetching All Categories"
            throw new Error(errorMessage); 
        }
    },

    async deleteCategory(categoryId) {
        return await categoryRepository.deleteCategory(categoryId);
    },

    async isCategoryExistByName(categoryName) {
        try{
            const category = await categoryRepository.getCategoryByName(categoryName);

            if (category) {
                console.log("Category Already Available with Name : ", category.name);
                return category;
            }

            return category;
        }  catch(error) {
            const errorMessage = error.message || "Unexpected Error occured While Creating Category";
            throw new Error(errorMessage);
        } 
    }
};

export default categoryServiceImp;