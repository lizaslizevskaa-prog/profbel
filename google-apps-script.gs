// === Google Apps Script для отправки писем ProfBel ===
// НАСТРОЙКА:
// 1. Открой https://script.google.com
// 2. Создай новый проект, вставь этот код
// 3. Замени PROFBEL_SECRET на любую секретную строку (ту же самую добавишь в Railway)
// 4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy
// 5. Скопируй URL деплоя и добавь в Railway как GOOGLE_MAIL_URL

const PROFBEL_SECRET = "PROFBEL_SECRET_2026";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== PROFBEL_SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "Unauthorized" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    GmailApp.sendEmail(data.to, data.subject, "", {
      htmlBody: data.html,
      name: "ProfBel",
      replyTo: "lizaslizevskaa@gmail.com",
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
