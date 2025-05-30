export const exportToCSV = (users) => {
  const headers = ["Date", "Nom", "Prénom", "Email", "Statut", "Facture"];
  const rows = users.map((user) => [
    new Date(user.createdAt).toLocaleDateString("fr-FR"),
    user.lastName,
    user.firstName,
    user.email,
    user.status,
    user.facture || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
