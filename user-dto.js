// data transfer object from user
module.exports = class UserDto{
    id;
    email;
    roles;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.roles = model.roles;
    }
}