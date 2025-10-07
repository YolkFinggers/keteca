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

	const doneEl = document.querySelector(".w-form-done");
	const failEl = document.querySelector(".w-form-fail");

	try {
		const res = await fetch("/submit-form.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error(`Server error: ${res.status}`);
		const json = await res.json();

		if (json.success) {
			doneEl.classList.add("w--show");
			doneEl.style.display = "inline"; // force it to show
			failEl.classList.remove("w--show");
			failEl.style.display = "none"; // hide fail div
			form.reset();
		} else {
			doneEl.classList.remove("w--show");
			doneEl.style.display = "none";
			failEl.classList.add("w--show");
			failEl.style.display = "inline";
		}
	} catch (err) {
		console.error(err);
		doneEl.classList.remove("w--show");
		failEl.classList.add("w--show");
	}
});
