# 🔄 Projeto Serverless — Simulação de Sequenciador Móvel

Este projeto simula um sistema distribuído com **sequenciador móvel**, utilizando Node.js, Serverless Framework e execução local com `serverless-offline`.

---

## 🎯 Objetivo

Demonstrar como um sistema distribuído pode manter a **ordem de execução de tarefas** usando o conceito de **sequenciador móvel**, onde diferentes processos assumem o controle em momentos distintos (como dias da semana).

---

## 📦 Componentes do Projeto

### Funções

| Função             | Papel                                                                 |
|--------------------|-----------------------------------------------------------------------|
| `emissor`          | Dispara o sequenciador adequado (semana ou fim de semana)             |
| `sequenciadorSemana` | Executa os agentes nos dias úteis (segunda a sexta)                   |
| `sequenciadorFDS`  | Executa os agentes nos fins de semana (sábado e domingo)              |
| `agente1`          | Simula etapa 1 da tarefa                                               |
| `agente2`          | Simula etapa 2 da tarefa                                               |
| `agente3`          | Simula etapa 3 da tarefa                                               |

---

## 🔁 Lógica de Sequenciador Móvel

- O sistema possui dois sequenciadores em um **anel lógico**:
  - `sequenciadorSemana` assume o bastão nos dias úteis
  - `sequenciadorFDS` assume o bastão nos fins de semana
- O `emissor` detecta o dia atual e delega o bastão para o sequenciador correto
- O sequenciador então **executa os agentes em ordem definida**

---

## 🚀 Executando Localmente

🛠️ Requisitos

- Node.js 18+
- Serverless Framework 3+
- Porta 3000 livre no sistema

### 1. Instalar dependências

```bash
npm install --save-dev serverless serverless-offline
```

### 2. Iniciar o ambiente offline

```bash
npx serverless offline
```

### 3. Disparar o emissor manualmente

```bash
curl -X POST http://localhost:3000/dev/emissor
```

## 🧪 Testes e Simulações

Forçar execução manual do sequenciador da semana:


```bash
curl -X POST http://localhost:3000/dev/sequenciadorSemana
```

Forçar execução manual do sequenciador do fim de semana:

```bash
curl -X POST http://localhost:3000/dev/sequenciadorFDS
```
