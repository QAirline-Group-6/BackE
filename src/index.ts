import { error } from 'console';
import dotenv from 'dotenv';
import app from './app';
import db from './models';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Sync DB and start the server
db.sequelize.sync()
  .then(() => {
    console.log('Kết nối DB và đồng bộ thành công.');
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Lỗi kết nối DB:', error);
  });
