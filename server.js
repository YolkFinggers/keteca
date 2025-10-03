const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const PORT = 5000;

// SMTP transporter
const transporter = nodemailer.createTransport({
	host: "mail.keteca.com",
	port: 587,
	secure: false,
	auth: {
		user: "smtp@keteca.com",
		pass: "Smtp7878Ktc$",
	},
});

const server = http.createServer((req, res) => {
	// === Serve static files ===
	if (req.method === "GET") {
		let filePath = req.url === "/" ? "/index.html" : req.url;
		filePath = path.join(__dirname, filePath);

		const ext = path.extname(filePath);
		const contentType =
			{
				".html": "text/html",
				".css": "text/css",
				".js": "text/javascript",
				".png": "image/png",
				".jpg": "image/jpeg",
				".ico": "image/x-icon",
			}[ext] || "text/plain";

		fs.readFile(filePath, (err, content) => {
			if (err) {
				res.writeHead(404);
				res.end("Not Found");
			} else {
				res.writeHead(200, {
					"Content-Type": contentType,
				});
				res.end(content);
			}
		});

		return;
	}

	// === Handle CORS preflight ===
	if (req.method === "OPTIONS") {
		res.writeHead(204, {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		});
		res.end();
		return;
	}

	// === Handle POST /submit-form ===
	if (req.method === "POST" && req.url === "/submit-form") {
		let body = "";
		req.on("data", (chunk) => (body += chunk.toString()));
		req.on("end", async () => {
			try {
				const data = JSON.parse(body);
				const {
					name,
					address,
					Number,
					"name-2": business,
					Project,
				} = data;

				const mailOptions = {
					from: `"Website Contact" <smtp@keteca.com>`,
					to: "salesmktg@keteca.com",
					subject: "New Contact Form Submission",
					html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Phone:</strong> ${Number}</p>
            <p><strong>Business:</strong> ${business}</p>
            <p><strong>Project:</strong> ${Project}</p>
          `,
				};

				await transporter.sendMail(mailOptions);

				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				});
				res.end(JSON.stringify({ success: true }));
			} catch (err) {
				console.error(err);
				res.writeHead(500, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				});
				res.end(
					JSON.stringify({
						success: false,
						error: err.message,
					}),
				);
			}
		});
		return;
	}

	// === Fallback for other routes ===
	res.writeHead(404);
	res.end("Not Found");
});

server.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}`),
);
