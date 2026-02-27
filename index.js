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

const app = Waline({
  async postSave(comment) {
    // do what ever you want after save comment
  },
});

require('http').createServer(app).listen(process.env.PORT || 3000);
