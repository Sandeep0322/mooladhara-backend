import zlib from 'zlib'
import crypto from 'crypto'
import { QuestionAnswerInterface } from '../src/models/ChatHistroy'

const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32) // 32 bytes key
const iv = crypto.randomBytes(16) // 16 bytes IV

// Function to compress and encrypt text
export function compressEncrypt(text: string) {
  // Compress the text
  const compressed = zlib.deflateSync(Buffer.from(text, 'utf8'))

  // Encrypt the compressed text
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(compressed)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

// Function to decrypt and decompress text
export function decryptDecompress(encrypted: any) {
  const iv = Buffer.from(encrypted.iv, 'hex')
  const encryptedText = Buffer.from(encrypted.encryptedData, 'hex')

  // Decrypt the data
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  // Decompress the data
  const decompressed = zlib.inflateSync(decrypted)

  return decompressed.toString()
}

export function decryptQuestionAnswer(
  qa: QuestionAnswerInterface
): QuestionAnswerInterface {
  // Decrypt the current level's answer
  const decryptedAnswer = decryptDecompress(qa.answer)

  // If there's a nested history, recursively decrypt it
  const decryptedHistory = qa.history
    ? decryptQuestionAnswer(qa.history)
    : undefined

  // Return the decrypted object
  return {
    ...qa,
    answer: decryptedAnswer,
    history: decryptedHistory,
  }
}
