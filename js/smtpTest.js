const form = document.getElementById("email-form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const data = {
		name: form.name.value,
		address: form.address.value,
		Number: form.Number.value,
		"name-2": form["name-2"].value,
		Project: form.Project.value,
	};

	const doneEl = document.querySelector(".w-form-done");
	const failEl = document.querySelector(".w-form-fail");

	try {
		const res = await fetch("/submit-form", {
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
