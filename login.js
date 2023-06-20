import express  from "express";
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from "cookie-parser";
import jwt  from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors(
    {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
    }
));

const db = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "Lurian",
    password: "root",
    database: "barber"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Message: "Precisamos da Credencial, tente na próxima vez."})
    } else {
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
            if(err) {
                return res.json({Message: "Authentication Error."})
            }else{
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/',verifyUser, (req, res) =>{
    return res.json({Status: "Success", name: req.name})
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE user = ? AND password = ?";
    db.query(sql, [req.body.user, req.body.password], (err, data) =>{
        if(err) return res.json({Message: "Erro no lado do Servidor."});
        if(data.length > 0) {
            const name = data[0].name;
            const token = jwt.sign({name}, "our-jsonwebtoken-secret-key", {expiresIn: '1d'});
            res.cookie('token', token); 
            return res.json({Status: "Success"})
        } else {
            return res.json({Message: "Dados inválidos"});
        }
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.listen(8080, () =>{
    console.log("API de Login Online")
})