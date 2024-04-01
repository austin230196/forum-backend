import amqplib from "amqplib";
import AdvancedError from "../helpers/advanced-error";


export default class ConfigEvent {
    public constructor(
        // protected readonly eventName: string
    ){

    }


    private async getChannel(){
        const conn = await amqplib.connect("amqps://ghqhkuxg:odAJIwmuvB7f0UM5D91B12fi4hIwtVgs@armadillo.rmq.cloudamqp.com/ghqhkuxg");
        const channel = await conn.createChannel();
        return channel;
    }

    public async listenForAmqp(queueName: string){
        let channel = await this.getChannel();
        await channel.assertQueue(queueName);


        //consumer
        channel.consume(queueName, msg => {
            if(msg !== null){
                //message gotten
                console.log(`${msg.content.toString()}`);
                channel.ack(msg)
            }else {
                throw new AdvancedError("Consumer cancelled by server", 555);
            }
        })
    }



    public async addToAmqpQueue<T>(data: T, queueName: string){
        let channel = await this.getChannel();
        await channel.assertQueue(queueName);

        let DATA = JSON.stringify(data);
        await channel.sendToQueue(queueName, Buffer.from(DATA))
    }
}