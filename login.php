<?php
$host   = "localhost";
$dbname = "fullstackdev";
$user   = "root";
$pass   = "";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $roll_no  = trim($_POST["roll_no"]);
    $password = trim($_POST["password"]);

    // MD5 hash the input password to match what's stored in DB
    $hashed_password = MD5($password);

    $sql  = "SELECT * FROM students WHERE roll_no = ? AND password = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $roll_no, $hashed_password);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) == 1) {
        $row     = mysqli_fetch_assoc($result);
        $message = "success";
    } else {
        $message = "error";
    }
}

mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Login</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background: #f0f4f8;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .card {
      background: #fff;
      padding: 36px 40px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 24px;
      color: #333;
      font-size: 1.4rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      color: #555;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
      margin-bottom: 18px;
      outline: none;
      transition: border 0.2s;
    }

    input:focus { border-color: #4a90e2; }

    button {
      width: 100%;
      padding: 12px;
      background: #4a90e2;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #357abd; }

    /* ── Alert boxes ── */
    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      font-weight: bold;
      text-align: center;
    }
    .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert-error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

    /* ── Welcome box (shown on success) ── */
    .welcome-box {
      background: #eaf7ee;
      border: 1px solid #b2dfdb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-top: 16px;
    }
    .welcome-box h3 { color: #2e7d32; margin-bottom: 8px; }
    .welcome-box p  { color: #555; font-size: 0.9rem; }
  </style>
</head>
<body>

<div class="card">
  <h2>Student Login</h2>

  <?php if ($message === "success"): ?>
    <!-- ✅ Login Successful -->
    <div class="alert alert-success">✔ Login Successful!</div>
    <div class="welcome-box">
      <h3>Welcome, <?= htmlspecialchars($row['first_name']) ?>
                   <?= htmlspecialchars($row['last_name'])  ?>!</h3>
      <p>Roll No: <strong><?= htmlspecialchars($row['roll_no']) ?></strong></p>
      <p>Contact: <strong><?= htmlspecialchars($row['contact']) ?></strong></p>
    </div>

  <?php elseif ($message === "error"): ?>
    <!-- ❌ Login Failed -->
    <div class="alert alert-error">✘ Invalid Roll No or Password.</div>

  <?php endif; ?>

  <!-- Login Form (always visible) -->
  <form method="POST" action="">
    <label>Roll No / ID</label>
    <input type="text" name="roll_no" placeholder="e.g. CS2024001" required>

    <label>Password</label>
    <input type="password" name="password" placeholder="Enter your password" required>

    <button type="submit">Login</button>
  </form>
</div>

</body>
</html>

