const amqp = require('amqplib/callback_api');
const csv = require('csv-parser')
const fs = require('fs')
const { execSync } = require('child_process');

const { EXCHANGE_NAME } = require('./utils')

amqp.connect('amqp://localhost', function (connectionError, connection) {
    if (connectionError) throw connectionError;

    connection.createChannel(function (channelError, channel) {
        if (channelError) throw channelError;

        channel.assertExchange(EXCHANGE_NAME, 'topic', {
            durable: false
        });

        const parser = csv({
            separator: ';'
        })

        parser.on('data', (incident) => {
            console.log(incident);

            const county = incident['municipio'];
            const type = incident['tipo'];

            const key = `${county}.${type}`;

            channel.publish(EXCHANGE_NAME, key, Buffer.from(JSON.stringify(incident)));
        });

        parser.on('error', () => console.error(err.message));

        parser.on('end', () => console.log('Finished'));

        fs.createReadStream(__dirname + '/db/ocorrencias2023.csv', { highWaterMark: 128 })
            .on('data', (data) => {
                execSync('sleep 1'); // block process for 1 second.
                return data;
            })
            .pipe(parser)
    });
});
