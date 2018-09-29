

const sqlite3 = require( 'sqlite3').verbose();
const path = require('path')
const db = new sqlite3.Database(path.resolve('./.sqlite.db'))

const insertReading = (type, reading) => {
  db.run(`INSERT INTO ${type} VALUES (datetime('now'), ${reading});`) 
}

const fetchLatestReadings = (type , limit, callback) => {
  db.all(`SELECT * FROM ${type} ORDER BY createdAt DESC LIMIT ${limit}`,callback)
}

const fetchReadingBetweenTime =(type,start,end,callback) => {
    db.all(`SELECT * FROM ${type} WHERE createdAt > ? AND createdAt < ?;`,[start,end],callback)
}

const fetchAverageOfReadingsBetweenTime = (type,start,end,callback) => {
    db.get(`SELECT avg(value) FROM ${type} WHERE createdAt > ? AND createdAt < ?;`,[start,end],callback)
}

module.exports = {

 insertReading,
 fetchLatestReadings,
 fetchReadingBetweenTime,
 fetchAverageOfReadingsBetweenTime

}
