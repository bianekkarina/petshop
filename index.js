const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

mongoose
.connect("mongodb://localhost:27017/petshop")
.then(() => console.log("Conectado ao MongoDB!"))
.catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro))

const port = 3000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

// serviços

const esquemaServicos = new mongoose.Schema({
    nomeServico: { type: String, required: true },
    preco: { type: Number, required: true }
})

const Servico = mongoose.model("Servico", esquemaServicos)

async function adicionarServ(nomeServico, preco) {
    try {
        const novoServ = new Servico({ nomeServico, preco })
        return await novoServ.save()
    } catch (erro) {
        console.error("Erro ao criar um serviço:", erro)
        throw erro
    }
}

app.post('/servico', async (req, res) => {
    try {
        const { nomeServico, preco } = req.body
        const novoServ = await adicionarServ(nomeServico, preco)
        res.status(201).json({
            mensagem: "Serviço adicionado com sucesso!",
            servico: novoServ
        })
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao adicionar serviço!",
            erro: erro.message
        })
    }
})


async function buscarServ() {
    try {
        return await Servico.find()
    } catch (erro) {
        console.error("Erro ao buscar serviço:", erro)
        throw erro 
    }
}

app.get("/servico", async (req, res) => {
    try {
        const servicos = await buscarServ()
        res.status(200).json(servicos)
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar livro:",
            erro: erro.message
        })
    }
})


async function atualizarServ(id, nomeServico, preco) {
    try {
        const servAtualizado = await Servico.findByIdAndUpdate(
            id,
            { nomeServico, preco },
            { new: true, runValidators: true }
        )
        return servAtualizado
    } catch (erro) {
        console.error("Erro ao editar livro:", erro)
        throw erro
    }
}

app.put("/servico/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { nomeServico, preco } = req.body
        const servAtualizado = await atualizarServ(
            id,
            nomeServico,
            preco
        )
        
        if (servAtualizado) {
            res.status(200).json({
                mensagem: "Dados do serviço atualizado com sucesso!",
                servico: servAtualizado
            })
        } else {
            res.status(404).json({
                mensagem: "Serviço não encontrado!"
            })
        }
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao atualizar dados do serviço!",
            erro: erro.message
        })
    }
})


async function deletarServ(id) {
    try {
        const servDeletado = await Servico.findByIdAndDelete(id)
        return servDeletado
    } catch (erro) {
        console.error("Erro ao deletar serviço:", erro)
        throw erro
    }
}

app.delete("/servico/:id", async (req, res) => {
    try {
        const { id } = req.params
        const servDeletado = await deletarServ(id)

        if (servDeletado) {
            res.status(200).json({
                mensagem: "Serviço deletado com sucesso!",
                servico: servDeletado
            })
        } else {
            res.status(404).json({
                mensagem: "Serviço não encontrado"
            })
        }
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao deletar serviço",
            erro: erro.message
        })
    }
})