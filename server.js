const cors = require('cors');

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

// Rota POST - Cadastrar novo produto
app.post('/cadNomes', (req, res) => {
    const {nome_completo} = req.body;   // As variáveis dentro dos {} recebem os dados que vieram do front-end

    //Se os dados que vieram do font-end forem em branco
    if(!nome_completo){
        return res.status(400).json({error: 'Dado incompletos' });
    }

    //Realiza a inserção dos dados recebidos no banco de dados
    const sql = 'INSERT INTO lista_nome (nome_completo) VALUES (?)';
    db.query(sql, [nome_completo], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({error: 'Esse nome já está cadastrado'});
            }
            return res.status(500).json({error: err.message})
        }

        // Em caso de suceeso encaminha uma mensagem e o id da lista
        res.status(201).json({message: 'Nome cadastrado com sucesso', id: result.insertId});
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});