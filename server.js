import express  from "express";
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors()); 
const db = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "Lurian",
    password: "root",
    database: "barber"
});

app.get('/', (req, res) =>{
    const sql = "SELECT idCliente, upper(nomeCliente) AS nomeCliente, upper(servicoCliente) as servicoCliente, upper(barbeiro) as barbeiro, telefoneCliente, valor, hora, tempo, DATE_FORMAT(datas, '%d/%m/%Y') AS datas FROM services ORDER BY month(datas), day(datas), time(hora) ";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    });
});

app.post('/register', (req, res) =>{
    const sql = "INSERT INTO services (`nomeCliente`, `telefoneCliente`, `barbeiro`, `servicoCliente`, `datas`, `hora`, `tempo`, `valor`) VALUES (?)";
    console.log(req.body)
    const values= [
        req.body.name,
        req.body.telefone,
        req.body.barbeiro,
        req.body.servico,
        req.body.datas,
        req.body.hora,
        req.body.tempo,
        req.body.valor
    ]
    db.query(sql, [values], (err, result) =>{
        if(!err){
            res.status(200).json({sucess: ""});
        } else {
            console.log(err);
        }
        
    })
})


app.get('/view/:id', (req, res) =>{
    const sql = "SELECT * FROM services WHERE idCliente = ?";
    const id = req.params.id;

    db.query(sql,[id], (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    });
});

app.put('/update/:id', (req, res) => {
    const sql = 'UPDATE services SET `nomeCliente`=?, `telefoneCliente`=?, `barbeiro`=?, `servicoCliente`=?, `datas`=?, `hora`=?, `tempo`=?, `valor`=? WHERE idCliente=?';
    const id = req.params.id;
    db.query(sql, [req.body.name, 
        req.body.telefone, 
        req.body.barbeiro, 
        req.body.servico, req.body.datas, 
        req.body.hora, req.body.tempo, 
        req.body.valor, id], (err, result) => {
        if(err) return console.log(err);
        return res.json(result);
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM services WHERE idCliente = ?";
    const id =  req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Erro ao deletar Linha"});
        return res.json(result);
    })
})

app.post('/check/:id', (req,res) => {
    const sql = "INSERT INTO realizados (`nomeCliente`,`barbeiro`, `servico`, `valor`) SELECT nomeCliente, barbeiro, servicoCliente, valor FROM services WHERE idCliente =?";
    const id =  req.params.id; 
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Erro ao mover Linha"});
        return res.json(result);
    })
})

app.get('/balance/', (req, res) =>{
    const sql = "SELECT sum(valor) as valor FROM realizados";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clients/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clientsday/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services WHERE DATE(datas) = CURDATE()";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clientsgui/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services WHERE barbeiro='Guilherme' and DATE(datas) = CURDATE()";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clientsguitotal/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services WHERE barbeiro='Guilherme'";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clientsjon/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services WHERE barbeiro='Jonatan' and DATE(datas) = CURDATE()";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/clientsjonday/', (req, res) =>{
    const sql = "SELECT COUNT(idCliente) AS idCliente FROM services WHERE barbeiro='Jonatan'";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})


app.get('/product/', (req, res) =>{
    const sql= "SELECT id, upper(barbeiro) as barbeiro, upper(description) as description, valor, DATE_FORMAT(dateLaunch, '%d/%m/%Y') as dateLaunch FROM store  ORDER BY month(dateLaunch), day(dateLaunch) DESC";
    db.query(sql, (err, result) =>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    });
});



app.post('/product/add', (req, res) =>{
    const sql = "INSERT INTO store (`barbeiro`, `description`, `valor`) VALUES (?)";
    const values = [
        req.body.barbeiro,
        req.body.description,
        req.body.valor
    ]
    db.query(sql, [values], (err, result) =>{
        if(!err){
            res.status(200).json({sucess: ""});
        } else {
            console.log(err);
        }
        
    });
});

app.get('/product/day', (req, res) => {
    const sql = "SELECT COUNT(id) as id FROM store WHERE DATE(dateLaunch) = CURDATE()";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
});

app.get('/product/total', (req, res) =>{
    const sql = "SELECT sum(valor) as valor FROM store WHERE DATE(dateLaunch) = CURDATE()";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
})

app.get('/product/listday', (req, res) =>{
    const sql = "SELECT barbeiro, description, valor FROM store WHERE DATE(dateLaunch) = CURDATE()";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
})

app.get('/product/listweek', (req, res) =>{
    const sql = "SELECT barbeiro, description, valor FROM store WHERE WEEK(dateLaunch) = WEEK(CURDATE())";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
})

app.get('/product/week', (req, res) =>{
    const sql = "SELECT sum(valor) as valor FROM store WHERE WEEK(dateLaunch) = WEEK(CURDATE())";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
})

app.get('/product/month', (req, res) =>{
    const sql = "SELECT sum(valor) as valor FROM store WHERE MONTH(dateLaunch) = MONTH(CURDATE())";
    db.query(sql, (err, result) =>{
        if (err) return res.json({Error: "Erro na query"});
        return res.json(result);
    })
})


app.listen(8081, ()=>{
    console.log("Online")
})