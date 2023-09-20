#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const csv = require('csv-parser')
const fs = require('fs')
const { execSync } = require('child_process');

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

        const parser = csv({
            separator: ';'
        })

        parser.on('data', (ocorrencia) => {
            console.log(ocorrencia);
            const key = ocorrencia['municipio'] + '.' + ocorrencia['tipo'];
            channel.publish(exchange, key, Buffer.from(JSON.stringify(ocorrencia)));
            //execSync('sleep 2'); // block process for 2 seconds.
        });

        parser.on('error', function (err) {
            console.error(err.message);
        });

        parser.on('end', () => {
            console.log('cabou');
        });

        fs.createReadStream('/home/mateus/Downloads/ocorrencias2023.csv', { highWaterMark: 128 })
            .on('data', (data) => {
                execSync('sleep 1'); // block process for 1 second.
                return data;
            })
            .pipe(parser)
    });
});
