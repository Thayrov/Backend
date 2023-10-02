async function changeRole(userId) {
	try {
		const response = await fetch(`/api/users/premium/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		if (response.ok) {
			location.reload();
		} else {
			alert(data.message || 'Error toggling user role');
		}
	} catch (error) {
		alert('An error occurred: ' + error.message);
	}
}

async function deleteUser(userId) {
	try {
		const response = await fetch(`/api/users/delete-user/${userId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		if (response.ok) {
			location.reload();
		} else {
			alert(data.message || 'Error deleting user');
		}
	} catch (error) {
		alert('An error occurred: ' + error.message);
	}
}
