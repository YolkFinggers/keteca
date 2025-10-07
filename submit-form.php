<?php
header("Content-Type: application/json");
require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "No input received"]);
    exit;
}

// Detect which form was used
$isNewForm = isset($input["firstName"]) && isset($input["email"]);

// Common variables
$mail = new PHPMailer(true);
$subject = "Keteca Website Contact Form Submission";

if ($isNewForm) {
    $first = htmlspecialchars($input["firstName"] ?? "");
    $last = htmlspecialchars($input["lastName"] ?? "");
    $phone = htmlspecialchars($input["phone"] ?? "");
    $email = htmlspecialchars($input["email"] ?? "");
    $company = htmlspecialchars($input["company"] ?? "");
    $message = htmlspecialchars($input["message"] ?? "");

    $fullMessage = "From: $first $last <$email>\nPhone Number: $phone\nCompany: $company\n\nMessage:\n$message";
} else {
    $name = htmlspecialchars($input["name"] ?? "");
    $email = htmlspecialchars($input["address"] ?? "");
    $number = htmlspecialchars($input["Number"] ?? "");
    $message = htmlspecialchars($input["name-2"] ?? "No message provided"); // This the message body of contact-us.html
    $project = htmlspecialchars($input["Project"] ?? "Website Inquiry"); // this is the NATURE OF BUSINEZZ, god I really hope i will be the only one working on this.
// at least the first form is more straight forward in their html class naming

    $fullMessage = "From: $name <$email>\nPhone Number: $number\nProject: $project\n\nMessage:\n$message";
} 

/*
Due to client preference, I need to go with html class names that is so out of the place that honestly, frankly, frantically, $uizided my brain
*/ 

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host = "mail.keteca.com";
    $mail->SMTPAuth = true;
    $mail->Username = "smtp@keteca.com";
    $mail->Password = "Smtp7878Ktc$";
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Recipients
    $mail->setFrom("smtp@keteca.com", "Contact Form");
    $mail->addAddress("salesmktg@keteca.com.sg");
    $mail->addReplyTo($email);

    // Email content
    $mail->Subject = $subject;
    $mail->Body = $fullMessage;

    $mail->send();

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
?>

