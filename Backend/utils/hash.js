import crypto from "crypto"

export const createHash = (data, previousHash="") => {

return crypto
.createHash("sha256")
.update(JSON.stringify(data) + previousHash)
.digest("hex")

}