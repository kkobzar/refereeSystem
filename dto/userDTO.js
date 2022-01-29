module.exports = class UserDto {
    email;
    id;
    isActivated;
    name;
    surname;

    constructor(user) {
        this.email = user.email
        this.id = user.id
        this.isActivated = user.isActivated;
        this.surname = user.surname;
        this.name = user.name;
    }

}
