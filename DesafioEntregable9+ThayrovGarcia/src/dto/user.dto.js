export class UserResponseDTO {
	constructor({id, email, first_name, last_name, age, role}) {
		this.id = id;
		this.email = email;
		this.first_name = first_name;
		this.last_name = last_name;
		this.age = age;
		this.role = role;
	}
}
