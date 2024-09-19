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


// clientes

const esquemaClientes = new mongoose.Schema({
    nomeCliente: { type: String, required: true },
    nomePet: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
})

const Cliente = mongoose.model("Cliente", esquemaClientes)

async function cadastrarCliente(nomeCliente,nomePet,telefone,email) {
    try {
        const novoCliente = new Cliente({ nomeCliente, nomePet, telefone, email })
        return await novoCliente.save()
    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro)
        throw erro
    }
}

app.post('/clientes', async (req,res) => {
    try {
        const { nomeCliente, nomePet, telefone, email } = req.body
        const novoCliente = await cadastrarCliente(nomeCliente, nomePet, telefone, email)
        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso",
            Cliente: novoCliente
        })
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao cadastrar cliente",
            erro: erro.message })
    }
})

async function buscarClientes() {
    try {
        return await Cliente.find()
    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro)
        throw erro
    }
}

app.get('/clientes', async (req,res) => {
    try {
        const clientes = await buscarClientes()
        res.status(200).json(clientes)
    } catch (erro) {
        res
        .status(500)
        .json({mensagem: "Erro ao buscar livro:", erro: erro.message})
    }
})

async function atualizarCliente(id, nomeCliente, nomePet, telefone, email) {
    try {
        const clienteAtualizado = await Cliente.findByIdAndUpdate(
            id,
            { nomeCliente, nomePet, telefone, email },
            { new: true, runValidators: true }
        )
        return clienteAtualizado
    } catch (erro) {
        console.log("Erro ao editar cliente:", erro)
        throw erro
    }
}

app.put('/clientes/:id', async (req,res) => {
    try {
        const { id } = req.params
        const { nomeCliente, nomePet, telefone, email } = req.body
        const clienteAtualizado = await atualizarCliente(
        id,
        nomeCliente,
        nomePet,
        telefone,
        email
        )
        if (clienteAtualizado) {
            res
            .status(200)
            .json({
                mensagem: "Cliente atualizado com sucesso",
                clientes: clienteAtualizado,
            })
        } else {
            res.status(400).json({mensagem: "cliente não encontrado"})
        }
    } catch (erro) {
        res
        .status(500)
        .json({mensagem: "Error ao atualizar cliente", erro: erro.message})
    }
})

async function deletarCliente(id) {
    try {
        const clienteDeletado = await Cliente.findByIdAndDelete(id)
        return clienteDeletado
    } catch (erro){
        console.error("Error ao deletar cliente", erro)
        throw erro
    }
}

app.delete('/clientes/:id', async (req,res) => {
    try {
        const { id } = req.params
        const clienteDeletado = await deletarCliente(id)
        if(clienteDeletado) {
            res
            .status(200)
            .json({mensagem: "Cliente deletado com sucesso", clientes: deletarCliente})
        } else {
            res.status(404).json({mensagem: "Cliente não encontrado"})
        }
    } catch (erro) {
        res
        .status(500)
        .json({mensagem: "Erro ao deletar cliente", erro: erro.message})
    }
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



// agendamentos 

const esquemaAgendamentos = new mongoose.Schema({
    data: { type: String, required: true },
    horario: { type: String, required: true },
    idCliente: { type: String, required: true },
    idServico: { type: String, required: true },
})

const Agendamento = mongoose.model("Agendamento", esquemaAgendamentos)

async function criarAgendamento(data, horario, idCliente, idServico) {
    try {  
        const novoAgendamento = new Agendamento({ data, horario, idCliente, idServico })
        return await novoAgendamento.save()
    } catch (erro) {
        console.error("Erro ao adicionar agendamento:", erro);
        throw erro;
    }
}

app.post('/agendamentos', async (req, res) => {
    try {
        const { data, horario, idCliente, idServico } = req.body
        const novoAgendamento = await criarAgendamento(data, horario, idCliente, idServico)
        res.status(201).json({
            mensagem: "Agendamento adicionado com sucesso",
            agendamento: novoAgendamento
        })
    } catch (erro) {
        res.status(500).json({ 
            mensagem: "Erro ao adicionar agendamento",
            erro: erro.message });
        }
})

async function buscarAgendamentos() {
    try {
        return await Agendamento.find()
    } catch (erro) {
        console.error("Erro ao buscar agendamento", erro)
        throw erro
    }
}

app.get('/agendamentos', async (req,res) => {
    try {
        const agendamento = await buscarAgendamentos()
        res.status(200).json(agendamento)
    } catch (erro) {
        res.status(500).json({mensagem: "Erro ao buscar agendamento:", erro: erro.mensagem})
    }
})

async function atualizarAgendamentos(id,data,horario,idCliente,idServico){
    try{
      const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
        id,
        { data,horario,idCliente,idServico },
        { new: true, runValidators: true }
      )
      return agendamentoAtualizado 
    } catch (erro) {
      console.error("Erro ao atualizar o agendamento: ", erro)
      throw erro
    }
}
  
app.put("/agendamentos/:id", async (req,res) => {
    try{
      const { id } = req.params
      const { data,horario,idCliente,idServico } = req.body
      const agendamentoAtualizado = await atualizarAgendamentos(
        id,
        data,
        horario,
        idCliente,
        idServico
      )
      if(agendamentoAtualizado) {
        res
        .status(200)
        .json({
          mensagem: "Agendamento atualizado com sucesso",
          agendamento: agendamentoAtualizado,
        })
      } else{
        res.status(404).json({mensagem: "Agendamento não encontrado"})
      }
    } catch (erro) {
      res
      .status(500)
      .json({mensagem: "Erro ao atualizar agendamento", erro: erro.message})
    }
})

async function deletarAgendamento(id){
    try{
      const agendamentoDeletado = await Agendamento.findByIdAndDelete(id)
      return agendamentoDeletado
    } catch (erro) {
      console.error("Erro ao deletar agendamento:", erro)
      throw erro
    }
}
  
app.delete("/agendamentos/:id", async (req,res) => {
    try {
      const { id } = req.params
      const agendamentoDeletado = await deletarAgendamento(id)
      if(agendamentoDeletado) {
        res
        .status(200)
        .json({mensagem: "Agendamento deletado com sucesso", agendamento: agendamentoDeletado})
      } else {
        res.status(404).json({mensagem: "Agendamento não encontrado"})
      }
    } catch (erro) {
      res
      .status(500)
      .json({mensagem: "Erro ao deletar agendamento", erro: erro.message})
     }
})