from flask import Flask, json, request, abort, Response
from flask_cors import CORS
from secrets import token_bytes
from webauthn import (
    generate_registration_options,
    verify_registration_response,
    options_to_json,
    base64url_to_bytes
)
from webauthn.helpers.cose import COSEAlgorithmIdentifier
from webauthn.helpers.structs import (
    AttestationConveyancePreference,
    AuthenticatorAttachment,
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialDescriptor,
    ResidentKeyRequirement,
)
import json

api = Flask(__name__)
CORS(api, origins=["http://localhost:4200"])

db = {}
user_id = {}

@api.route('/register', methods=['POST'])
def get_credential_creation_options():
    data = request.get_json()
    id = token_bytes(8)

    user_id[data['userName']] = id

    options = generate_registration_options(
        rp_id="localhost",
        rp_name="AmbI Mini-Praktikum",
        user_name=data['userName'],
        user_id=id
    )
    # save challenge for user trying to authenticate
    db[data['userName']] = { "challenge": options.challenge }

    return options_to_json(options)

@api.route('/register/verify', methods=['POST'])
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

    return {"hallo": "hallo"}

    return Response()


if __name__ == '__main__':
    api.debug = True
    api.run()
