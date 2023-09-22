const amqp = require('amqplib/callback_api');
const WebSocketServer = require('ws').Server;
const crypto = require('crypto');

const { EXCHANGE_NAME } = require('./utils')

const server = new WebSocketServer({ port: 8080, path: '/ocorrencias' });

const sockets = {}

const summary = {
    casesPerCity: {},
    casesPerType: {},
    casesPerGender: {
        male: 0,
        female: 0,
        notDefined: 0
    }
}

function updateClients() {
    const valueToSend = JSON.stringify({...summary, lastUpdate: new Date()})

    for (const socket of Object.values(sockets)) {
        socket.send(valueToSend);
    }
}

setInterval(updateClients, 5000);

server.on('connection', function (socket) {
    const id = crypto.randomBytes(16).toString("hex");

    sockets[id] = socket

    socket.on('close', () => delete sockets[id])

    socket.on('error', () => delete sockets[id])
});

amqp.connect('amqp://localhost', function (connectionError, connection) {
    if (connectionError) throw connectionError;
    

    connection.createChannel(function (channelError, channel) {
        if (channelError) throw channelError;

        channel.assertExchange(EXCHANGE_NAME, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) throw error2;
            
            channel.bindQueue(q.queue, EXCHANGE_NAME, '#');

            channel.consume(q.queue, function (msg) {
                const ocorr = JSON.parse(msg.content);

                if (summary.casesPerCity[ocorr['municipio']]) {
                    summary.casesPerCity[ocorr['municipio']]++;
                } else {
                    summary.casesPerCity[ocorr['municipio']] = 1;
                }

                if (summary.casesPerType[ocorr['tipo']]) {
                    summary.casesPerType[ocorr['tipo']]++;
                } else {
                    summary.casesPerType[ocorr['tipo']] = 1;
                }

                if (ocorr['sexo'] === 'MASCULINO') summary.casesPerGender.male ++;
                if (ocorr['sexo'] === 'FEMININO') summary.casesPerGender.female ++;
                if (!ocorr['sexo']) summary.casesPerGender.notDefined ++;

                console.log(summary)
            });
        });
    });
});
