import { createConnection } from "mysql2";

const conn = createConnection({
    host: "localhost",
    port: "3307",
    user: "Lurian",
    password: "root",
    database: "barber_order",
});

conn.connect((err)=>{
    if (err) throw err;
    console.log("DB Conectado!");
});

export default conn;