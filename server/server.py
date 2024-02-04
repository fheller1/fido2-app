#! /usr/bin/python

from flask import Flask, request, abort, Response
from flask_cors import CORS
from secrets import token_bytes
from webauthn import (
    generate_registration_options,
    generate_authentication_options,
    verify_registration_response,
    verify_authentication_response,
    options_to_json
)
from webauthn.helpers import bytes_to_base64url, base64url_to_bytes
from webauthn.helpers.structs import (
    UserVerificationRequirement,
    PublicKeyCredentialDescriptor,
)
import time
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
from sqlalchemy.orm.exc import NoResultFound


def create_app():

    db = SQLAlchemy()
    api = Flask(__name__)
    CORS(api, origins=["https://fido2.igd.fraunhofer.de"])
    
    db_name = 'fido2-app'
    api.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_name
    api.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    db.init_app(api)

    class User(db.Model):
        __tablename__ = 'users1000'
        user_name = db.Column(db.String, primary_key = True)
        credential_id = db.Column(db.String)
        challenge = db.Column(db.String)
        public_key = db.Column(db.String)
        login_challenge = db.Column(db.String)
        sign_count = db.Column(db.Integer)
        session = db.Column(db.String)
        session_started = db.Column(db.String)

        def __init__(self, user_name):
            self.user_name = user_name
            self.credential_id = None
            self.challenge = None
            self.public_key = None
            self.login_challenge = None
            self.sign_count = 0
            self.session = None
            self.session_started = None


    @api.route('/register', methods=['POST'])
    def get_credential_creation_options():
        data = request.get_json()
        userName = data['userName']

        found = True
        try:
            user = db.session.execute(db.select(User).filter_by(user_name=userName)).scalar_one()
        except NoResultFound:
            found = False
            user = User(userName)

        if found and user.credential_id is not None:
            abort(409)

        id = token_bytes(8)

        options = generate_registration_options(
            rp_id="igd.fraunhofer.de",
            rp_name="AmbI Mini-Praktikum",
            user_name=userName,
            user_id=id
        )
        # save challenge for user trying to authenticate
        user.challenge = bytes_to_base64url(options.challenge)
        if not found:
            db.session.add(user)
        db.session.commit()

        print("Created credential creation challenge for user " + userName + ".")
        return options_to_json(options)

    @api.route('/register-verify', methods=['POST'])
    def validate_registration():
        try:
            userName = request.get_json()['userName']
            user = db.session.execute(db.select(User).filter_by(user_name=userName)).scalar_one()
            expected_challenge = base64url_to_bytes(user.challenge)
        except NoResultFound:
            abort(404)

        verification = verify_registration_response(
            credential=request.get_json()['credential'],
            expected_challenge=expected_challenge,
            expected_rp_id='igd.fraunhofer.de',
            expected_origin='https://fido2.igd.fraunhofer.de',
            require_user_verification=True
        )

        user.credential_id = bytes_to_base64url(verification.credential_id)
        user.public_key = bytes_to_base64url(verification.credential_public_key)
        user.challenge = None
        db.session.commit()

        print("Successfully validated user " + userName + "\'s credential.")
        return {"status": 200}


    @api.route('/login', methods=['POST'])
    def get_credential_request_options():
        try:
            userName = request.get_json()['userName']
            user = db.session.execute(db.select(User).filter_by(user_name=userName)).scalar_one()
            credential_id = base64url_to_bytes(user.credential_id)
        except NoResultFound:
            abort(404)

        challenge = token_bytes(64)
        user.login_challenge = bytes_to_base64url(challenge)
        db.session.commit()

        options = generate_authentication_options(
            rp_id='localhost',
            challenge=challenge,
            allow_credentials=[PublicKeyCredentialDescriptor(id=credential_id)],
            user_verification=UserVerificationRequirement.REQUIRED
        )

        print("Created credential request challenge for user " + userName + ".")
        return options_to_json(options)


    @api.route('/login-verify', methods=['POST'])
    def validate_login():
        json = request.get_json()
        userName = json['userName']
        assertion = json['assertion']
        try:
            user = db.session.execute(db.select(User).filter_by(user_name=userName)).scalar_one()
            expected_challenge = base64url_to_bytes(user.login_challenge)
            public_key = base64url_to_bytes(user.public_key)
            sign_count = user.sign_count
        except:
            abort(404)
        
        try:
            verification = verify_authentication_response(
                credential=assertion,
                expected_challenge=expected_challenge,
                expected_rp_id='igd.fraunhofer.de',
                expected_origin='https://fido2.igd.fraunhofer.de',
                credential_public_key=public_key,
                credential_current_sign_count=sign_count,
                require_user_verification=True
            )
        except:
            abort(403)
        
        session = token_bytes(64)

        user.sign_count = verification.new_sign_count
        user.session = bytes_to_base64url(session)
        user.session_started = time.time()
        db.session.commit()

        print("Successfully validated user " + userName + "\'s credential to login and saved its session.")
        return '{\"status\": 200, \"session\": \"' + bytes_to_base64url(session) + '\"}'
    

    @api.route('/logout', methods=['POST'])
    def logout():
        try:
            userName = request.get_json()['userName']
            user = db.session.execute(db.select(User).filter_by(user_name=userName)).scalar_one()
        except:
            abort(404)

        user.session = None
        user.session_started = None
        db.session.commit()
        
        print("Successfully logged out user " + userName + ".")
        return {"status": 200}


    @api.route('/', methods=['GET'])
    def get_data():
        users = db.session.execute(db.select(User))
        print([user for user in users])
        return Response()
    

    @api.route('/create-all')
    def create_all():
        db.create_all()
        return Response()


    return api


if __name__ == '__main__':
    api = create_app()
    api.run()
