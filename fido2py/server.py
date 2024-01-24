from flask import Flask, json, request, abort, Response
from flask_cors import CORS
from secrets import token_bytes
from webauthn import (
    generate_registration_options,
    generate_authentication_options,
    verify_registration_response,
    verify_authentication_response,
    options_to_json
)
from webauthn.helpers import bytes_to_base64url
from webauthn.helpers.structs import (
    UserVerificationRequirement,
    PublicKeyCredentialDescriptor,
)
import time

def create_app():

    api = Flask(__name__)
    CORS(api, origins=["http://localhost:4200"])

    db = {}
    user_id = {}

    @api.route('/register', methods=['POST'])
    def get_credential_creation_options():
        data = request.get_json()
        userName = data['userName']

        if userName in db and 'credential_id' in db[userName]:
            abort(409)

        id = token_bytes(8)
        user_id[userName] = id

        options = generate_registration_options(
            rp_id="localhost",
            rp_name="AmbI Mini-Praktikum",
            user_name=userName,
            user_id=id
        )
        # save challenge for user trying to authenticate
        db[userName] = { "challenge": options.challenge }

        print("Created credential creation challenge for user " + userName + ".")
        return options_to_json(options)

    @api.route('/register-verify', methods=['POST'])
    def validate_registration():
        try:
            userName = request.get_json()['userName']
            expected_challenge = db[userName]['challenge']
        except:
            abort(404)

        verification = verify_registration_response(
            credential=request.get_json()['credential'],
            expected_challenge=expected_challenge,
            expected_rp_id='localhost',
            expected_origin='http://localhost:4200',
            require_user_verification=True
        )
        
        db[userName]['credential_id'] = verification.credential_id
        db[userName]['public_key'] = verification.credential_public_key
        del db[userName]['challenge']

        print("Successfully validated user " + userName + "\'s credential.")
        return {"status": 200}


    @api.route('/login', methods=['POST'])
    def get_credential_request_options():
        try:
            userName = request.get_json()['userName']
            credential_id = db[userName]['credential_id']
        except:
            abort(404)
        challenge = token_bytes(64)
        db[userName]['login_challenge'] = challenge
        db[userName]['sign_count'] = 0
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
            expected_challenge = db[userName]['login_challenge']
            public_key = db[userName]['public_key']
            sign_count = db[userName]['sign_count']
        except:
            abort(404)
        
        try:
            verification = verify_authentication_response(
                credential=assertion,
                expected_challenge=expected_challenge,
                expected_rp_id='localhost',
                expected_origin='http://localhost:4200',
                credential_public_key=public_key,
                credential_current_sign_count=sign_count,
                require_user_verification=True
            )
        except:
            abort(403)
        
        db[userName]['sign_count'] = verification.new_sign_count

        # Create session for the user to keep him authenticated for some time
        session = token_bytes(64)
        db[userName]['session'] = session
        db[userName]['session_started'] = int(time.time())

        print("Successfully validated user " + userName + "\'s credential to login and saved its session.")
        return '{\"status\": 200, \"session\": \"' + bytes_to_base64url(session) + '\"}'
    

    @api.route('/logout', methods=['POST'])
    def logout():
        userName = request.get_json()['userName']
        try:
            del db[userName]['session']
            del db[userName]['session_started']
        except:
            abort(404)
        
        print("Successfully logged out user " + userName + ".")
        return {"status": 200}


    @api.route('/', methods=['GET'])
    def get_data():
        return Response()
    
    return api
