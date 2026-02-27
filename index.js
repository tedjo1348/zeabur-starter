const url = require('url');
const { MONGO_URI, MONGODB_URI } = process.env;

if (MONGO_URI || MONGODB_URI) {
  const connectUrl = url.parse(MONGO_URI || MONGODB_URI);
  const [user, password] = connectUrl.auth.split(':');
  process.env.MONGO_HOST = process.env.MONGO_HOST || connectUrl.hostname;
  process.env.MONGO_PORT = process.env.MONGO_PORT || connectUrl.port;
  process.env.MONGO_USER = process.env.MONGO_USER || user;
  process.env.MONGO_PASSWORD = process.env.MONGO_PASSWORD || password;
  process.env.MONGO_AUTHSOURCE = process.env.MONGO_AUTHSOURCE || 'admin';
  process.env.MONGO_DB = process.env.MONGO_DB || 'waline';
}

const Waline = require('@waline/vercel');

// Tambahkan konfigurasi di dalam objek ini
const app = Waline({
  // 1. Kustomisasi Teks UI (Server-side Locale)
  locale: {
    placeholder: 'Tulis komentar di sini...', // Mengganti teks placeholder default
    admin: 'Administrator',
  },

  // 2. Custom Hooks
  async postSave(comment) {
    // Aksi setelah komentar tersimpan (misal: kirim notifikasi)
    console.log('Komentar baru tersimpan:', comment.nick);
  },

  // Contoh hook sebelum menyimpan (untuk filter spam sederhana)
  async preSave(comment) {
    if (comment.mail.endsWith('@spam.com')) {
      return { errmsg: 'Email tidak diizinkan!' };
    }
  }
});

require('http').createServer(app).listen(process.env.PORT || 3000);
