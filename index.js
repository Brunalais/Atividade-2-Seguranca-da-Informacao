const crypto = require("crypto");

// Texto original
const texto = "Mensagem confidencial de teste.";
console.log("Texto original:", texto);

// 1. Hash SHA-256 do texto
const hash = crypto.createHash("sha256").update(texto).digest("hex");
console.log("Hash SHA-256:", hash);

// Criamos um objeto que junta texto + hash
const payload = JSON.stringify({ texto, hash });

/* =============================
   2. Criptografia SIMÉTRICA (AES)
   ============================= */
const chaveAES = crypto.randomBytes(32); // 256 bits
const iv = crypto.randomBytes(16);       // 128 bits

// Criptografar
const cipher = crypto.createCipheriv("aes-256-cbc", chaveAES, iv);
let criptografadoAES = cipher.update(payload, "utf8", "base64");
criptografadoAES += cipher.final("base64");

console.log("\nCriptografado (AES):", criptografadoAES);

// Descriptografar
const decipher = crypto.createDecipheriv("aes-256-cbc", chaveAES, iv);
let descriptografadoAES = decipher.update(criptografadoAES, "base64", "utf8");
descriptografadoAES += decipher.final("utf8");

console.log("Descriptografado (AES):", descriptografadoAES);

// Validar hash
const objAES = JSON.parse(descriptografadoAES);
const hashCheckAES = crypto.createHash("sha256").update(objAES.texto).digest("hex");
console.log("Hash válido (AES)?", hashCheckAES === objAES.hash);

/* =============================
   3. Criptografia ASSIMÉTRICA (RSA)
   ============================= */
// Gerar par de chaves RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// Criptografar com chave pública
const criptografadoRSA = crypto.publicEncrypt(publicKey, Buffer.from(payload));
console.log("\nCriptografado (RSA base64):", criptografadoRSA.toString("base64").slice(0, 60) + "...");

// Descriptografar com chave privada
const descriptografadoRSA = crypto.privateDecrypt(privateKey, criptografadoRSA).toString("utf8");
console.log("Descriptografado (RSA):", descriptografadoRSA);

// Validar hash
const objRSA = JSON.parse(descriptografadoRSA);
const hashCheckRSA = crypto.createHash("sha256").update(objRSA.texto).digest("hex");
console.log("Hash válido (RSA)?", hashCheckRSA === objRSA.hash);

