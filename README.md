# SAMU services

This is the final project of the Introduction to Distributed Systems course.

Our challenge is to create an end-to-end structure to illustrate a a system based on data streaming.

We decide to analyze the SAMU services in 2023. SAMU is Mobile Emergency Medical Services.

<!-- Assume-se que rabbitmq eatá rodando em localhost, porta 5672  
`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management`
___
A fonte de dados em [fonte.js](https://github.com/felipinas/samu-services/blob/main/backend/fonte.js). deve apontar para um arquivo contendo os dados de [Dados Recife - SAMU](http://dados.recife.pe.gov.br/dataset/servico-de-atendimento-movel-de-urgencia-samu-2023/resource/548a12cf-a382-409c-bf68-21db251199b4) -->

# Steps to run this code

* Download [RabbitMQ](https://www.rabbitmq.com/download.html) and [Node.js](https://nodejs.org/en/download).

* On the frontend and backend folders, run ```npm install```.

* Now, open 3 terminals: 1 inside frontend and 2 inside backend/src:
  * backend/src: run ```node server.js```
  * backend/src: run ```node source.js```
  * frontend: run ```npm run dev```

* Now you can go to local page and see the charts.

# Stack

* Backend:
  * Node.js
  * RabbitMQ

* Frontend:
  * React
  * Recharts
