<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = htmlspecialchars($_POST['first_name']);
    $last_name = htmlspecialchars($_POST['last_name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $company = htmlspecialchars($_POST['company']);
    $project_details = htmlspecialchars($_POST['project_details']);

    $to = "hannahhatherell@gmail.com";
    $subject = "New Project Inquiry";
    $message = "Name: $first_name $last_name\nEmail: $email\nCompany: $company\nProject Details:\n$project_details";
    $headers = "From: $email";

    if(mail($to, $subject, $message, $headers)) {
        echo "<p>Thank you! Your message has been sent.</p>";
    } else {
        echo "<p>Sorry, there was an error sending your message.</p>";
    }
}
?>