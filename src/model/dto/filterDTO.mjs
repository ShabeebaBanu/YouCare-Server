class FilterDTO {
    constructor({
        district,
        province,
        userType,
        category
    }) {
        this.district = district,
        this.province = province,
        this.userType = userType,
        this.category = category
    }
}

module.exports = FilterDTO;