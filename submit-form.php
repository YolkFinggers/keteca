<?php
header("Content-Type: application/json");

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "No input received"]);
    exit;
}

$name = htmlspecialchars($input["name"] ?? "");
$email = htmlspecialchars($input["address"] ?? ""); // adjust based on your field naming
$subject = htmlspecialchars($input["Project"] ?? "Website Inquiry");
$message = htmlspecialchars($input["name-2"] ?? "No message provided");

require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // SMTP setup
    $mail->isSMTP();
    $mail->Host = "mail.keteca.com";
    $mail->SMTPAuth = true;
    $mail->Username = "smtp@keteca.com";
    $mail->Password = "Smtp7878Ktc$";
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Recipients
	
    $mail->setFrom("smtp@keteca.com", "Contact Form"); // send from must be smtp server for auth
    $mail->addAddress("tanshanyu2004@gmail.com"); // send to
    $mail->addReplyTo($email, $name);

    // Content
    $mail->Subject = $subject;
    $mail->Body = "From: $name <$email>\n\nMessage:\n$message";

    $mail->send();

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
}
?>

