const {
    requestPlugin,
    generateFuzz,
    loginAs,
    getAdminUser
} = require('../helpers');
const tools = require('hollaex-tools-lib');

describe('tests for /plugin/meta', function () {

    let user, bearerToken;
    before(async () => {
        user = await tools.user.getUserByEmail(getAdminUser().email);
        user.should.be.an('object');
        bearerToken = await loginAs(user);
        bearerToken.should.be.a('string');
    });


    //Integration Testing
    it('Integration Test -should respond 200 for "Success"', async () => {

        const installPlugin = async () => {
            const response = await requestPlugin()
            .post('/plugins')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": "hello-exchange",
                "version": 1,
                "type": null,
                "author": "bitHolla",
                "bio": "Say hello from an exchange",
                "description": "Demo plugin for proof of concept",
                "documentation": null,
                "logo": null,
                "icon": null,
                "url": null,
                "public_meta": {
                    "public_message": {
                        "type": "string",
                        "required": false,
                        "description": "Not a secret",
                        "value": "Hello Exchange!"
                    }
                },
                "meta": {
                    "private_message": {
                        "type": "string",
                        "required": false,
                        "description": "A secret",
                        "value": "hello exchange..."
                    }
                },
                "prescript": {
                    "install": [
                        "hello-world-npm"
                    ],
                    "run": null
                },
                "postscript": {
                    "run": null
                },
                "script": "\"use strict\";const{publicMeta:publicMeta,meta:meta}=this.configValues,{app:app,loggerPlugin:loggerPlugin,toolsLib:toolsLib}=this.pluginLibraries,helloWorld=require(\"hello-world-npm\"),moment=require(\"moment\"),init=async()=>{if(loggerPlugin.info(\"HELLO-EXCHANGE PLUGIN initializing...\"),!1)throw new Error(\"Configuration value private required\")};init().then(()=>{app.get(\"/plugins/hello-exchange/info\",(e,i)=>(loggerPlugin.verbose(e.uuid,\"GET /plugins/hello-exchange/info\"),i.json({public_message:'g',private_message:'g',library_message:helloWorld(),moment_timestamp:moment().toISOString(),exchange_info:toolsLib.getKitConfig().info})))}).catch(e=>{loggerPlugin.error(\"HELLO-EXCHANGE PLUGIN error during initialization\",e.message)});",
                "admin_view": null,
                "web_view": null,
                "enabled": true
            })
         

            response.should.have.status(200);
            response.should.be.json;
        }

        const plugin = await requestPlugin()
        .get('/plugins/meta?name=hello-exchange')
        .set('Authorization', `Bearer ${bearerToken}`)

        if(plugin.body.message !== 'Plugin not found'){
            await requestPlugin()
            .delete('/plugins?name=hello-exchange')
            .set('Authorization', `Bearer ${bearerToken}`)
        }

         await installPlugin();
    });


    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await requestPlugin()
            .get('/plugins/meta?name=hello-exchange')
            .set('Authorization', `Bearer ${bearerToken}`)
         

        response.should.have.status(200);
        response.should.be.json;

    });

    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await requestPlugin()
            .put('/plugins/meta')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": "hello-exchange",
                "meta": {
                    "private_message": "hello exchange..."
                },
                "public_meta": {
                    "public_message": "test"
                }
            })
         

        response.body.public_meta.public_message.value.should.equal('test');
        response.should.have.status(200);
        response.should.be.json;

    });



    it('Integration Test -should respond 200 for "Success"', async () => {
        const response = await requestPlugin()
            .delete('/plugins?name=hello-exchange')
            .set('Authorization', `Bearer ${bearerToken}`)
         

        response.should.have.status(200);
        response.should.be.json;

    });


     //Fuz Testing
     it('Fuzz Test -should return error', async () => {
        const response = await requestPlugin()
            .post('/plugins')
            .set('Authorization', `Bearer ${bearerToken}`)
            .send({
                "name": `hello-${generateFuzz(10)}`,
                "version": 1,
                "type": null,
                "author": "bitHolla",
                "bio": "Say hello from an exchange",
                "description": "Demo plugin for proof of concept",
                "documentation": null,
                "logo": null,
                "icon": null,
                "url": null,
                "public_meta": {
                    "public_message": {
                        "type": "string",
                        "required": false,
                        "description": "Not a secret",
                        "value": "Hello Exchange!"
                    }
                },
                "meta": {
                    "private_message": {
                        "type": "string",
                        "required": false,
                        "description": "A secret",
                        "value": "hello exchange..."
                    }
                },
                "prescript": {
                    "install": [
                        "hello-world-npm"
                    ],
                    "run": null
                },
                "postscript": {
                    "run": null
                },
                "script": generateFuzz(),
                "admin_view": null,
                "web_view": null,
                "enabled": true
            })

        response.should.have.status(400);
    });

});