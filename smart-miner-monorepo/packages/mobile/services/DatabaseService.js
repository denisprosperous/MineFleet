import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mining.db');

class DatabaseService {
  constructor() {
    this.init();
  }

  init() {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS mining_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, startTime TEXT, endTime TEXT, hashrate REAL, earnings REAL);'
      );
    });
  }

  logSession(session) {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO mining_sessions (startTime, endTime, hashrate, earnings) VALUES (?, ?, ?, ?);',
        [session.startTime, session.endTime, session.hashrate, session.earnings]
      );
    });
  }

  getSessions(callback) {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mining_sessions;', [], (_, { rows }) => {
        callback(rows._array);
      });
    });
  }
}

export default new DatabaseService();
