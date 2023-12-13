import { Fido2Lib } from "fido2-lib";

const f2l = new Fido2Lib({
  timeout: 42,
  rpId: "example.com",
  rpName: "Ambient Intelligence Portal",
  rpIcon: "https://mupam.net/wp-content/uploads/2019/10/Logos_frauhofer-300x150.png",
  challengeSize: 128,
  attestation: "none",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: "required"
});

export default f2l;
