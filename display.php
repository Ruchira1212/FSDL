<?php
// ── Database Connection ────────────────────────────────────────
$host     = "localhost";
$dbname   = "fullstackdev";
$username = "root";        // change if different
$password = "";            // change if you have a password set

$conn = mysqli_connect($host, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("<p style='color:red'>Connection failed: " . mysqli_connect_error() . "</p>");
}

// ── Fetch All Students ─────────────────────────────────────────
$sql    = "SELECT id, first_name, last_name, roll_no, contact, created_at FROM students ORDER BY id ASC";
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Records</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; background: #f4f4f4; }
    h2   { color: #333; }

    table        { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    thead        { background: #4a90e2; color: #fff; }
    th, td       { padding: 12px 16px; text-align: left; border-bottom: 1px solid #ddd; }
    tr:hover td  { background: #f0f7ff; }
    tr:last-child td { border-bottom: none; }

    .count { margin-bottom: 14px; color: #555; font-size: 0.9rem; }
    .no-records { text-align: center; padding: 30px; color: #999; }
  </style>
</head>
<body>

<h2>Student Records — fullstackdev</h2>

<?php if (mysqli_num_rows($result) > 0): ?>

  <p class="count">Total records: <strong><?= mysqli_num_rows($result) ?></strong></p>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Roll No</th>
        <th>Contact</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      <?php while ($row = mysqli_fetch_assoc($result)): ?>
        <tr>
          <td><?= $row['id']         ?></td>
          <td><?= $row['first_name'] ?></td>
          <td><?= $row['last_name']  ?></td>
          <td><?= $row['roll_no']    ?></td>
          <td><?= $row['contact']    ?></td>
          <td><?= $row['created_at'] ?></td>
        </tr>
      <?php endwhile; ?>
    </tbody>
  </table>

<?php else: ?>
  <p class="no-records">No student records found.</p>
<?php endif; ?>

<?php
  mysqli_free_result($result);
  mysqli_close($conn);
?>

</body>
</html>
```

