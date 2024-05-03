# Fido2App

Welcome to the repository for Fido2App. This web application serves as demonstrator for an implementation of the [Webauthn/FIDO2](https://webauthn.guide/) standard. You can build it and use it on your local machine to try out your phone or other devices that allow identification to register and log in.

## Run the flask server
Navigate to `/fido2py`. Make sure Python is installed. Make sure the packages `flask, flask_cors, secrets, webauthn, time` are installed, if not, install with `pip install {package name}`.

Then start the server with the command `python server.py`.

## Run the Angular frontend
Make sure you are in the main folder. Then start the frontend with the command `npm run start`. Node.js, npm and Angular must all be installed. The demo can then be accessed on `http://localhost:4200`.

## Run the frontend using https
To serve the frontend with https, you must first create ssl certificates for your device, and save them on your local device. Then, open `package.json`, and change the paths after `"start-ssl` to point to your local certificate and private key.

Then, you can start using `npm run start-ssl`. You can access the demo on your local device on `http://localhost:4200`.
To access the demo on an other device in your local network, follow the URL printed after you ran `npm start-ssl`. You may need to open the according port in your firewall. Since you use a self-signed certificate, browsers show a warning prior to opening the website, but you can dismiss this warning and then use the demo.
