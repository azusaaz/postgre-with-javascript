const pg = require("pg");
const settings = require("./settings"); // settings.json
var arg = process.argv[2];

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

function printData(rows) {
  let index = 0;
  for (row of rows) {
    index += 1;
    console.log(`- ${index}: ${row.first_name} ${row.last_name}, born '${row.birthdate.toISOString().split('T')[0]}' ${row.date}`)
  }
}

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }

  console.log("Searching ...");

  //***/can use TO_CHAR(birthdate,'yyyy-mm-dd') for direct formatting
  client.query("SELECT first_name, last_name, birthdate, AS date from famous_people where first_name = $1::text or last_name = $1::text", [arg], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    
    if (result.rows) {
      console.log(`Found ${result.rows.length} person(s) by the name '${arg}':`);
      printData(result.rows);
    }

    client.end();
  });
});
