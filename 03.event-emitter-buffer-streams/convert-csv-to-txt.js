/**
 * @script `npm run m3t3`
 */
import path from 'path'
import { fileURLToPath } from 'url'
import csv from 'csvtojson'
import { pipeline } from 'stream'
import fs from 'fs'

function convertCSVToText(source, destination) {
  pipeline(
    fs.createReadStream(source),
    csv(),
    fs.createWriteStream(destination),
    (error) => {
      error && console.log(error)
    }
  )
}

const csvFilePath = path.resolve(fileURLToPath(import.meta.url), '../books.csv')
const textFilePath = path.resolve(
  fileURLToPath(import.meta.url),
  '../books.txt'
)
convertCSVToText(csvFilePath, textFilePath)
