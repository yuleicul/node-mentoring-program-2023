const os = require('os')
const child_process = require('child_process')
const fs = require('fs')

// Returns the operating system name as returned by uname(3).
// For example, it returns 'Linux' on Linux, 'Darwin' on macOS, and 'Windows_NT' on Windows.
const command =
  os.type() === 'Windows_NT'
    ? `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`
    : `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`

let mostCPUIntensiveProcessInfo = ''

function execCommand() {
  child_process.exec(command, (error, stdout) => {
    mostCPUIntensiveProcessInfo = stdout
    process.stdout.write(mostCPUIntensiveProcessInfo.trim() + '\r')
    if (error !== null) {
      console.error(`child_process.exec(command): ${error}`)
    }
  })
}

setInterval(execCommand, 3000)

function appendToFile() {
  setInterval(() => {
    fs.appendFile(
      'activityMonitor.log',
      `${Date.now()}: ${mostCPUIntensiveProcessInfo}`,
      (err) => {
        if (err) console.error(`fs.writeFile: ${err}`)
      }
    )
  }, 60000)
}

execCommand()
appendToFile()
