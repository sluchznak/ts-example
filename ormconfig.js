let entities = ["./build/db/entities/*.js"];
let synchronize = true;
if (process.env.NODE_ENV === 'test') {
  entities = ["./src/db/entities/*.ts"];
  synchronize = false
}

module.exports = {
  type: "sqlite",
  database: "./db.sqlite",
  entities,
  synchronize,
}
