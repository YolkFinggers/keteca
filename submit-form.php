<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON"]);
    exit;
}

// Extract fields
$name = htmlspecialchars($data["name"] ?? "");
$email = filter_var($data["address"] ?? "", FILTER_VALIDATE_EMAIL); // email input
$phone = htmlspecialchars($data["Number"] ?? "");
$business = htmlspecialchars($data["name-2"] ?? "");
$project = htmlspecialchars($data["Project"] ?? "");

if (!$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid email address"]);
    exit;
}

$to = "tanshanyu2004@gmail.com";
$subject = "New Contact Form Submission";
$message = "
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Business:</strong> $business</p>
    <p><strong>Project:</strong> $project</p>
";

// Headers: From is the email input
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Mail failed"]);
}

