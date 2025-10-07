const form = document.getElementById("email-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	let data = {};

	// Detect which form it is by checking its unique fields
	if (form["First-Name"] && form["Last-Name"]) {
		// --- New form (First/Last Name version) ---
		data = {
			formType: "new", // add an identifier for clarity
			firstName: form["First-Name"].value,
			lastName: form["Last-Name"].value,
			phone: form["Phone-Number"].value,
			email: form["Email"].value,
			company: form["Company"].value,
			message: form["Message"].value,
		};
	} else {
		// --- Old form (Name, Address, Project version) ---
		data = {
			formType: "old",
			name: form.name.value,
			address: form.address.value,
			Number: form.Number.value,
			"name-2": form["name-2"].value,
			Project: form.Project.value,
		};
	}
	const res = await fetch("/submit-form.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Server error: ${res.status}`);

	const json = await res.json();
	if (json.success) {
		document.querySelector(".w-form-fail").style.display = "none";
		document.querySelector(".w-form-done").style.display = "inline";
		form.reset();
	} else {
		document.querySelector(".w-form-fail").style.display = "inline";
	}
});
