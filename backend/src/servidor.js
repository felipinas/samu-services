const amqp = require('amqplib/callback_api');
const WebSocketServer = require('ws').Server;

const server = new WebSocketServer({ port: 8080, path: '/ocorrencias' });

const sockets = {}

sumario = {
    'ocrr por cidade': {},
    'ocrr por tipo': {}
}

function atualizar_clientes() {
    for (const socket in sockets) {
        sockets[socket].send(JSON.stringify(sumario));
    }
}

setInterval(atualizar_clientes, 5000);

let autoIncremento = 0;

server.on('connection', function (socket) {
    const id = autoIncremento;
    autoIncremento++;

    sockets[id] = socket

    socket.on('close', () => {
        delete sockets[id];
        console.log('acabou ' + id)
    })

    socket.on('error', () => {
        delete sockets[id];
        console.log('acabou ' + id)
    })
});

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        const exchange = 'SAMU';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }

            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            channel.bindQueue(q.queue, exchange, '#');

            channel.consume(q.queue, function (msg) {
                ocorr = JSON.parse(msg.content);

                if (sumario['ocrr por cidade'][ocorr['municipio']]) {
                    sumario['ocrr por cidade'][ocorr['municipio']]++;
                } else {
                    sumario['ocrr por cidade'][ocorr['municipio']] = 1;
                }
                if (sumario['ocrr por tipo'][ocorr['tipo']]) {
                    sumario['ocrr por tipo'][ocorr['tipo']]++;
                } else {
                    sumario['ocrr por tipo'][ocorr['tipo']] = 1;
                }

                console.log(sumario)
            });
        });
    });
});
